const sqlite3 = require("sqlite3");
const fs = require("fs");
const path = require("path");

// File database SQLite. Dibuat otomatis kalau belum ada.
const FILE = path.join(__dirname, "data", "kerjaku.db");
const fileBaru = !fs.existsSync(FILE);
const db = new sqlite3.Database(FILE);

const usersAwal = [
  ["admin", "Admin", "admin@kerjaku.com", "081234567890", "admin123"],
  ["anggia", "Anggia", "anggia@kerjaku.com", "081298765432", "kerja123"],
];

const lowonganAwal = [
  ["Frontend Developer", "PT Teknologi Nusantara", "Jakarta", "Rp8.000.000", "Membuat tampilan website menggunakan React."],
  ["Mobile Developer", "Aplikasi Kita", "Bandung", "Rp7.000.000", "Membuat aplikasi Android dan iOS menggunakan Ionic."],
  ["UI/UX Designer", "Kreatif Digital", "Yogyakarta", "Rp6.000.000", "Mendesain tampilan aplikasi menggunakan Figma."],
  ["Digital Marketing", "Toko Maju", "Surabaya", "Rp5.500.000", "Mengelola iklan dan media sosial perusahaan."],
  ["Staff Admin", "PT Sinar Abadi", "Bekasi", "Rp4.500.000", "Mengelola surat dan arsip kantor."],
  ["Data Analyst", "Analitika Data", "Jakarta", "Rp9.000.000", "Mengolah data dan membuat laporan untuk tim bisnis."],
];

// serialize: perintah di dalamnya dijalankan berurutan
db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lowongan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS lamaran (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lowongan_id INTEGER NOT NULL REFERENCES lowongan(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cv TEXT NOT NULL,
    pesan TEXT DEFAULT '',
    tanggal TEXT DEFAULT (datetime('now', 'localtime')),
    UNIQUE (lowongan_id, user_id)
  )`);

  // Isi data awal hanya saat file database baru dibuat
  if (fileBaru) {
    usersAwal.forEach((u) =>
      db.run("INSERT INTO users (username, name, email, phone, password) VALUES (?, ?, ?, ?, ?)", u)
    );
    lowonganAwal.forEach((l) =>
      db.run("INSERT INTO lowongan (title, company, location, salary, description) VALUES (?, ?, ?, ?, ?)", l)
    );
    console.log("Database baru dibuat dan diisi data awal: " + FILE);
  }
});

module.exports = db;
