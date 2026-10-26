// Membuat file JSON statis dari data.json ke folder docs/api (untuk GitHub Pages)
// Jalankan: npm run build:api
import fs from "fs";
import path from "path";

const sumber = JSON.parse(fs.readFileSync("static-api/data.json", "utf8"));
const out = "docs/api";

const tulis = (file, data, level) => {
  const lokasi = path.join(out, file);
  fs.mkdirSync(path.dirname(lokasi), { recursive: true });
  const isi = { data, meta: { resource: level, updated_at: sumber.updated_at } };
  fs.writeFileSync(lokasi, JSON.stringify(isi, null, 2));
  console.log("dibuat:", lokasi);
};

fs.rmSync(out, { recursive: true, force: true });

// Gabungkan data perusahaan ke setiap lowongan
const namaPerusahaan = (id) => sumber.companies.find((c) => c.id === id).name;
const jobs = sumber.jobs.map((j) => ({ ...j, company: namaPerusahaan(j.company_id) }));
const ringkas = ({ id, title, company, category, location, type, salary }) => ({ id, title, company, category, location, type, salary });

// 1. Semua lowongan
tulis("jobs.json", jobs.map(ringkas), "jobs");

// 2. Detail lowongan
jobs.forEach((j) => tulis(`jobs/${j.id}.json`, j, "job"));

// 3. Kategori dan lowongan per kategori
tulis("categories.json", sumber.categories, "categories");
sumber.categories.forEach((c) =>
  tulis(`categories/${c.code}.json`, jobs.filter((j) => j.category === c.code).map(ringkas), "jobs_by_category")
);

// 4. Perusahaan dan lowongan per perusahaan
tulis("companies.json", sumber.companies, "companies");
sumber.companies.forEach((c) =>
  tulis(`companies/${c.id}.json`, { ...c, jobs: jobs.filter((j) => j.company_id === c.id).map(ringkas) }, "company")
);
