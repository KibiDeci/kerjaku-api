# KerjaKu API

API data lowongan kerja untuk aplikasi **KerjaKu** (UTS Pemrograman Mobile Framework).

Terdiri dari dua bagian:

| Folder | Isi |
|---|---|
| `docs/` | **API statis** (file JSON) seperti wilayah.id, di-hosting di GitHub Pages |
| `api/` | **REST API Laravel + SQLite** (login, lowongan, lamaran, profil) |

## 1. API Statis (GitHub Pages)

Base URL: `https://kibideci.github.io/kerjaku-api`

| Endpoint | Isi |
|---|---|
| `GET /api/jobs.json` | Semua lowongan |
| `GET /api/jobs/[ID].json` | Detail lowongan |
| `GET /api/locations.json` | Daftar lokasi |
| `GET /api/locations/[CODE].json` | Lowongan per lokasi (mis. `jakarta`) |

Contoh response `GET /api/jobs/1.json`:

```json
{
  "data": {
    "id": 1,
    "title": "Frontend Developer",
    "company": "PT Teknologi Nusantara",
    "location": "Jakarta",
    "salary": "Rp8.000.000",
    "description": "Membuat tampilan website menggunakan React."
  },
  "meta": { "resource": "job", "updated_at": "2026-10-26" }
}
```

File JSON dibuat dari database SQLite dengan perintah:

```bash
cd api
php artisan api:static
```

## 2. REST API Laravel

Base URL lokal: `http://127.0.0.1:8000/api`

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/jobs?search=dev` | Daftar lowongan (bisa dicari) |
| GET | `/jobs/{id}` | Detail lowongan |
| POST | `/login` | Login (`username`, `password`) |
| PUT | `/users/{username}` | Update profil (`name`, `email`, `phone`, `password`) |
| GET | `/lamaran?username=&jobId=` | Daftar lamaran |
| POST | `/lamaran` | Kirim lamaran (`jobId`, `username`, `cv`, `pesan`) |

Akun test: `anggia` / `kerja123` dan `admin` / `admin123`.

### Cara menjalankan

Butuh PHP 8.2 dan Composer.

```bash
cd api
composer install
copy .env.example .env
php artisan key:generate
type nul > database\database.sqlite
php artisan migrate --seed
php artisan serve
```

Koleksi Postman: `api/postman/KerjaKu-API.postman_collection.json`.
