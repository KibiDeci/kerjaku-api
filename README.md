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
