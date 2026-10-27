// Membuat API statis (file JSON) dari database SQLite ke folder docs/api untuk GitHub Pages
const fs = require("fs");
const path = require("path");
const db = require("./db");

const OUT = path.join(__dirname, "..", "docs", "api");
const updatedAt = new Date().toISOString().slice(0, 10);

const slug = (teks) => teks.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const ringkas = ({ id, title, company, location, salary }) => ({ id, title, company, location, salary });

const tulis = (file, data, resource) => {
  const lokasi = path.join(OUT, file);
  fs.mkdirSync(path.dirname(lokasi), { recursive: true });
  fs.writeFileSync(lokasi, JSON.stringify({ data, meta: { resource, updated_at: updatedAt } }, null, 4));
  console.log("dibuat: docs/api/" + file);
};

// serialize: tunggu tabel dan data awal di db.js selesai dibuat dulu
db.serialize(() => db.all("SELECT * FROM lowongan ORDER BY id", (err, jobs) => {
  if (err) throw err;

  fs.rmSync(OUT, { recursive: true, force: true });

  // 1. Semua lowongan
  tulis("jobs.json", jobs.map(ringkas), "jobs");

  // 2. Detail lowongan
  jobs.forEach((job) => tulis(`jobs/${job.id}.json`, job, "job"));

  // 3. Daftar lokasi dan lowongan per lokasi
  const perLokasi = {};
  jobs.forEach((job) => (perLokasi[job.location] ||= []).push(job));

  tulis(
    "locations.json",
    Object.keys(perLokasi).map((nama) => ({ code: slug(nama), name: nama, total_jobs: perLokasi[nama].length })),
    "locations"
  );

  Object.entries(perLokasi).forEach(([nama, list]) => {
    tulis(`locations/${slug(nama)}.json`, list.map(ringkas), "jobs_by_location");
  });

  console.log("Selesai. Total lowongan: " + jobs.length);
  db.close();
}));
