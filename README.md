# KerjaKu - Aplikasi Lowongan Kerja (UTS)

Aplikasi mobile **Ionic React** untuk mencari dan melamar pekerjaan. Data diambil dari **REST API Laravel** (folder `api/`) memakai **axios**.

## Struktur

```
myApp/
├── src/              → frontend React (Ionic)
│   ├── data/api.js   → konfigurasi axios (alamat API)
│   ├── data/auth.js  → login & update profil (API)
│   ├── data/jobs.js  → daftar & detail lowongan (API)
│   └── data/lamaran.js → kirim & cek lamaran (API)
├── api/              → backend Laravel (REST API + SQLite)
└── postman/          → koleksi Postman untuk tes API
```

## Endpoint API

Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/jobs?search=dev` | Daftar lowongan (bisa dicari) |
| GET | `/jobs/{id}` | Detail lowongan |
| POST | `/login` | Login (`username`, `password`) |
| PUT | `/users/{username}` | Update profil (`name`, `email`, `phone`, `password`) |
| GET | `/lamaran?username=&jobId=` | Daftar lamaran |
| POST | `/lamaran` | Kirim lamaran (`jobId`, `username`, `cv`, `pesan`) |

Akun test: `anggia` / `kerja123` dan `admin` / `admin123`.

## API Statis (seperti wilayah.id)

Data lowongan juga tersedia sebagai file JSON statis di folder `docs/`, di-hosting gratis lewat GitHub Pages.

| Endpoint | Isi |
|---|---|
| `/api/jobs.json` | Semua lowongan |
| `/api/jobs/[ID].json` | Detail lowongan |
| `/api/categories.json` | Daftar kategori |
| `/api/categories/[CODE].json` | Lowongan per kategori (`IT`, `DSN`, `MKT`, `ADM`) |
| `/api/companies.json` | Daftar perusahaan |
| `/api/companies/[ID].json` | Detail perusahaan + lowongannya |

Ubah data di `static-api/data.json`, lalu jalankan `npm run build:api` untuk membuat ulang file di `docs/api/`.

## Cara Menjalankan

**1. Backend (API Laravel)** — butuh PHP 8.2 dan Composer

```bash
cd api
composer install
copy .env.example .env
php artisan key:generate
type nul > database\database.sqlite
php artisan migrate --seed
php artisan serve
```

API berjalan di `http://127.0.0.1:8000`.

**2. Frontend** — buka terminal baru di folder utama

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.
