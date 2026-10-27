const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "data", "db.json");

// Baca seluruh data dari file JSON
const baca = () => JSON.parse(fs.readFileSync(FILE, "utf8"));

// Simpan seluruh data ke file JSON
const simpan = (db) => fs.writeFileSync(FILE, JSON.stringify(db, null, 2) + "\n");

// Ambil id berikutnya untuk sebuah tabel
const idBaru = (list) => (list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1);

module.exports = { baca, simpan, idBaru };
