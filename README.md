# KerjaKu API

API data lowongan kerja untuk aplikasi **KerjaKu** (UTS Pemrograman Mobile Framework).

Terdiri dari dua bagian:

| Folder | Isi |
|---|---|
| `docs/` | **API statis** (file JSON) seperti wilayah.id, di-hosting di GitHub Pages |
| `api/` | **REST API Node.js + Express** (login, lowongan, lamaran, profil), data di file JSON |

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

File JSON dibuat dari `api/data/db.json` dengan perintah:

```bash
cd api
npm run static
```

## 2. REST API Node.js (Express)

Base URL lokal: `http://127.0.0.1:8000/api`

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/jobs?search=dev` | Daftar lowongan (bisa dicari) |
| GET | `/jobs/:id` | Detail lowongan |
| POST | `/login` | Login (`username`, `password`) |
| PUT | `/users/:username` | Update profil (`name`, `email`, `phone`, `password`) |
| GET | `/lamaran?username=&jobId=` | Daftar lamaran |
| POST | `/lamaran` | Kirim lamaran (`jobId`, `username`, `cv`, `pesan`) |

Akun test: `anggia` / `kerja123` dan `admin` / `admin123`.

### Cara menjalankan

Butuh Node.js (versi LTS).

```bash
cd api
npm install
npm run dev
```

Data tersimpan di `api/data/db.json`. Kembalikan ke data awal dengan `git checkout api/data/db.json`.

Koleksi Postman: `api/postman/KerjaKu-API.postman_collection.json`.
