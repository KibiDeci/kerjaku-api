# Panduan Membuat Ulang Project KerjaKu (Step by Step)

Panduan ini untuk membuat ulang project **KerjaKu** dari nol: aplikasi lowongan kerja dengan frontend **Ionic React** dan backend **REST API Node.js (Express)** dengan data disimpan di file JSON.

## Daftar Isi

0. [Gambaran Project](#0-gambaran-project)
1. [Persiapan Software](#1-persiapan-software)
2. [Backend: Node.js + Express API](#2-backend-nodejs--express-api)
3. [Frontend: React + Axios](#3-frontend-react--axios)
4. [Menjalankan Project](#4-menjalankan-project)
5. [Testing API](#5-testing-api)
6. [Bonus: API Statis untuk GitHub Pages](#6-bonus-api-statis-untuk-github-pages)
7. [Build ke Android (Capacitor)](#7-build-ke-android-capacitor)
8. [Masalah yang Sering Muncul](#8-masalah-yang-sering-muncul)
9. [Ringkasan untuk Presentasi](#9-ringkasan-untuk-presentasi)

---

## 0. Gambaran Project

### Teknologi

| Bagian | Teknologi |
|---|---|
| Frontend | React 19 + Vite, Bootstrap 5, React Router 6 |
| HTTP client | Axios |
| Mobile | Capacitor 8 |
| Backend | Node.js + Express 5 |
| Database | File JSON (`api/data/db.json`) |

### Struktur folder akhir

```
myApp/
├── api/                          ← BACKEND (Node.js + Express)
│   ├── data/
│   │   └── db.json               ← "database" (users, lowongan, lamaran)
│   ├── db.js                     ← fungsi baca/simpan db.json
│   ├── server.js                 ← semua endpoint API
│   ├── build-static.js           ← membuat API statis ke docs/api
│   └── package.json
├── docs/                         ← API statis (GitHub Pages), opsional
├── src/                          ← FRONTEND (React)
│   ├── components/
│   │   ├── BottomBar.jsx
│   │   ├── CardJob.jsx
│   │   └── TopBar.jsx
│   ├── data/
│   │   ├── api.js                ← setting axios
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── lamaran.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Detail.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   └── Profile.jsx
│   ├── theme/style.css
│   ├── App.jsx
│   └── main.jsx
├── capacitor.config.ts
└── package.json
```

### Alur kerja

```
Halaman React (src/pages)
  memanggil fungsi di src/data/*.js
  yang mengirim request lewat Axios ke http://127.0.0.1:8000/api/...
  lalu Express mencocokkan URL dengan app.get / app.post / app.put di server.js
  yang membaca dan menyimpan data di api/data/db.json.
Hasilnya dikirim balik ke halaman dalam format JSON.
```

### Daftar endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/jobs?search=` | Daftar lowongan (bisa dicari berdasarkan judul) |
| GET | `/api/jobs/:id` | Detail lowongan |
| POST | `/api/login` | Login dengan `username` dan `password` |
| PUT | `/api/users/:username` | Update profil |
| GET | `/api/lamaran?username=&jobId=` | Daftar lamaran |
| POST | `/api/lamaran` | Kirim lamaran |

---

## 1. Persiapan Software

Install semua ini dulu:

| Software | Fungsi | Cek versi |
|---|---|---|
| [Node.js](https://nodejs.org) (versi LTS) | Menjalankan backend dan frontend | `node -v` |
| [Git](https://git-scm.com) | Version control | `git --version` |
| VS Code | Editor | |

Tidak perlu PHP, Composer, XAMPP, atau database server.

### Extension VS Code yang disarankan

- **Thunder Client**: untuk testing API
- **ES7+ React snippets** (opsional)

---

## 2. Backend: Node.js + Express API

Semua perintah di bagian ini dijalankan di terminal (PowerShell).

### 2.1 Buat folder dan install package

```powershell
cd myApp
mkdir api
cd api
npm init -y
npm install express cors
mkdir data
```

- `express`: framework untuk membuat server dan endpoint API.
- `cors`: mengizinkan frontend (port 5173) memanggil API (port 8000).

### 2.2 Data awal: `api/data/db.json`

File ini berperan sebagai database. Isinya 3 "tabel": `users`, `lowongan`, dan `lamaran`.

```json
{
  "users": [
    { "id": 1, "username": "admin", "name": "Admin", "email": "admin@kerjaku.com", "phone": "081234567890", "password": "admin123" },
    { "id": 2, "username": "anggia", "name": "Anggia", "email": "anggia@kerjaku.com", "phone": "081298765432", "password": "kerja123" }
  ],
  "lowongan": [
    { "id": 1, "title": "Frontend Developer", "company": "PT Teknologi Nusantara", "location": "Jakarta", "salary": "Rp8.000.000", "description": "Membuat tampilan website menggunakan React." },
    { "id": 2, "title": "Mobile Developer", "company": "Aplikasi Kita", "location": "Bandung", "salary": "Rp7.000.000", "description": "Membuat aplikasi Android dan iOS menggunakan Ionic." },
    { "id": 3, "title": "UI/UX Designer", "company": "Kreatif Digital", "location": "Yogyakarta", "salary": "Rp6.000.000", "description": "Mendesain tampilan aplikasi menggunakan Figma." },
    { "id": 4, "title": "Digital Marketing", "company": "Toko Maju", "location": "Surabaya", "salary": "Rp5.500.000", "description": "Mengelola iklan dan media sosial perusahaan." },
    { "id": 5, "title": "Staff Admin", "company": "PT Sinar Abadi", "location": "Bekasi", "salary": "Rp4.500.000", "description": "Mengelola surat dan arsip kantor." },
    { "id": 6, "title": "Data Analyst", "company": "Analitika Data", "location": "Jakarta", "salary": "Rp9.000.000", "description": "Mengolah data dan membuat laporan untuk tim bisnis." }
  ],
  "lamaran": []
}
```

### 2.3 Fungsi baca/simpan: `api/db.js`

```js
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
```

### 2.4 Server dan endpoint: `api/server.js`

```js
const express = require("express");
const cors = require("cors");
const { baca, simpan, idBaru } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Data user yang boleh dikirim ke frontend (tanpa password)
const userPublik = (u) => ({ username: u.username, name: u.name, email: u.email, phone: u.phone });

const formatLamaran = (l, db) => {
  const user = db.users.find((u) => u.id === l.user_id);
  return {
    id: l.id,
    jobId: l.lowongan_id,
    username: user.username,
    nama: user.name,
    email: user.email,
    cv: l.cv,
    pesan: l.pesan || "",
    tanggal: l.tanggal,
  };
};

const tanggalSekarang = () => new Date().toISOString().slice(0, 19).replace("T", " ");

// GET /api/jobs?search=dev
app.get("/api/jobs", (req, res) => {
  const { lowongan } = baca();
  const search = (req.query.search || "").toLowerCase();
  const hasil = search ? lowongan.filter((j) => j.title.toLowerCase().includes(search)) : lowongan;
  res.json(hasil);
});

// GET /api/jobs/:id
app.get("/api/jobs/:id", (req, res) => {
  const job = baca().lowongan.find((j) => j.id === Number(req.params.id));
  if (!job) return res.status(404).json({ message: "Lowongan tidak ditemukan" });
  res.json(job);
});

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ message: "Username dan password wajib diisi" });
  }

  const user = baca().users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  res.json(userPublik(user));
});

// PUT /api/users/:username
app.put("/api/users/:username", (req, res) => {
  const db = baca();
  const user = db.users.find((u) => u.username === req.params.username);
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const { name, email, phone, password } = req.body;
  if (!name) return res.status(422).json({ message: "Nama tidak boleh kosong" });
  if (!email) return res.status(422).json({ message: "Email tidak boleh kosong" });
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(422).json({ message: "Format email tidak valid" });
  if (db.users.some((u) => u.email === email && u.id !== user.id)) {
    return res.status(422).json({ message: "Email sudah dipakai user lain" });
  }
  if (password && password.length < 6) {
    return res.status(422).json({ message: "Password minimal 6 karakter" });
  }

  user.name = name;
  user.email = email;
  user.phone = phone || "";
  if (password) user.password = password;
  simpan(db);

  res.json(userPublik(user));
});

// GET /api/lamaran?username=&jobId=
app.get("/api/lamaran", (req, res) => {
  const db = baca();
  let list = db.lamaran;

  if (req.query.username) {
    const user = db.users.find((u) => u.username === req.query.username);
    list = list.filter((l) => user && l.user_id === user.id);
  }
  if (req.query.jobId) {
    list = list.filter((l) => l.lowongan_id === Number(req.query.jobId));
  }

  res.json(list.map((l) => formatLamaran(l, db)));
});

// POST /api/lamaran
app.post("/api/lamaran", (req, res) => {
  const { jobId, username, cv, pesan } = req.body;
  if (!jobId || !username) return res.status(422).json({ message: "jobId dan username wajib diisi" });
  if (!cv) return res.status(422).json({ message: "Link CV wajib diisi" });

  const db = baca();
  const job = db.lowongan.find((j) => j.id === Number(jobId));
  const user = db.users.find((u) => u.username === username);
  if (!job || !user) return res.status(404).json({ message: "Lowongan atau user tidak ditemukan" });

  if (db.lamaran.some((l) => l.lowongan_id === job.id && l.user_id === user.id)) {
    return res.status(422).json({ message: "Kamu sudah melamar lowongan ini" });
  }

  const lamaran = {
    id: idBaru(db.lamaran),
    lowongan_id: job.id,
    user_id: user.id,
    cv,
    pesan: pesan || "",
    tanggal: tanggalSekarang(),
  };
  db.lamaran.push(lamaran);
  simpan(db);

  res.status(201).json(formatLamaran(lamaran, db));
});

app.use((req, res) => res.status(404).json({ message: "Endpoint tidak ditemukan" }));

app.listen(PORT, () => console.log(`KerjaKu API jalan di http://127.0.0.1:${PORT}/api`));
```

### 2.5 Script npm: `api/package.json`

Tambahkan bagian `scripts`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "node --watch server.js",
  "static": "node build-static.js"
}
```

`npm run dev` otomatis me-restart server setiap file disimpan.

### 2.6 Jalankan server API

```powershell
cd api
npm run dev
```

Muncul tulisan `KerjaKu API jalan di http://127.0.0.1:8000/api`. Coba buka `http://127.0.0.1:8000/api/jobs` di browser. Biarkan terminal ini tetap terbuka.

---

## 3. Frontend: React + Axios

Buka **terminal baru**, lalu masuk ke folder `myApp` (bukan folder `api`).

### 3.1 Buat project React dengan Vite

Karena folder `myApp` sudah berisi `api/`, buat project di folder sementara lalu pindahkan isinya:

```powershell
cd ..                                   # sekarang di folder myApp
npm create vite@latest temp -- --template react
Move-Item temp\* . -Force
Move-Item temp\.gitignore . -Force
Remove-Item temp -Recurse
```

### 3.2 Install package

```powershell
npm install
npm install axios bootstrap react-router-dom
npm install @capacitor/core @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar
npm install -D @capacitor/cli
```

| Package | Fungsi |
|---|---|
| `axios` | Mengirim request ke API |
| `bootstrap` | Tampilan (CSS) |
| `react-router-dom` | Pindah halaman (routing) |
| `@capacitor/*` | Mengubah web app menjadi app Android/iOS |

### 3.3 Hapus file bawaan yang tidak dipakai

Hapus `src/App.css`, `src/index.css`, dan folder `src/assets`.

### 3.4 Buat struktur folder

```powershell
mkdir src\components, src\data, src\pages, src\theme
```

### 3.5 `src/main.jsx`

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3.6 `src/data/api.js` (setting Axios)

```js
import axios from "axios";

// Alamat API Node.js (Express). Bisa diganti lewat file .env: VITE_API_URL=http://alamat-server/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: { Accept: "application/json" },
});

// Ambil pesan error dari respon API
export const pesanError = (err) => {
  if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
  }
  return "Tidak bisa terhubung ke server API";
};

export default api;
```

### 3.7 `src/data/auth.js`

```js
import api from "./api";

// Data login disimpan di variabel, jadi hilang saat aplikasi di-refresh atau ditutup
let currentUser = null;

// Kirim username dan password ke API (POST /login)
export const cekLogin = async (username, password) => {
  const res = await api.post("/login", { username, password });
  return res.data;
};

// Simpan data user yang sedang login
export const login = (user) => {
  currentUser = user;
};

// Hapus data login
export const logout = () => {
  currentUser = null;
};

// Ubah data akun lewat API (PUT /users/{username})
export const updateAccount = async (username, data) => {
  const res = await api.put("/users/" + username, data);
  login(res.data);
  return res.data;
};

// Ambil user yang sedang login (null jika belum login)
export const getUser = () => {
  return currentUser;
};
```

### 3.8 `src/data/jobs.js`

```js
import api from "./api";

// Ambil daftar lowongan (GET /jobs?search=...)
export const getJobs = async (search = "") => {
  const res = await api.get("/jobs", { params: search ? { search } : {} });
  return res.data;
};

// Ambil detail 1 lowongan (GET /jobs/{id})
export const getJob = async (id) => {
  const res = await api.get("/jobs/" + id);
  return res.data;
};
```

### 3.9 `src/data/lamaran.js`

```js
import api from "./api";

// Ambil lamaran milik user (GET /lamaran?username=...)
export const getLamaran = async (username) => {
  const res = await api.get("/lamaran", { params: { username } });
  return res.data;
};

// Kirim lamaran baru (POST /lamaran)
export const kirimLamaran = async (data) => {
  const res = await api.post("/lamaran", data);
  return res.data;
};

// Cek apakah user sudah melamar lowongan tertentu
export const sudahMelamar = async (jobId, username) => {
  const res = await api.get("/lamaran", { params: { jobId, username } });
  return res.data.length > 0;
};
```

### 3.10 `src/theme/style.css`

```css
/* Latar belakang abu-abu muda */
body {
  background: #f4f6fb;
}

/* Kerangka halaman: isi di tengah, bottom bar di bawah */
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page-content {
  flex: 1;
}
.bottom-bar {
  position: sticky;
  bottom: 0;
  z-index: 1020;
}

/* Kartu lowongan bisa diklik */
.card-job {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-job:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
}

/* Lingkaran huruf pertama (logo perusahaan / avatar) */
.inisial {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0d6efd;
  color: #fff;
  font-weight: bold;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
```

### 3.11 Komponen

**`src/components/TopBar.jsx`**

```jsx
import { useNavigate } from "react-router-dom";
import { logout } from "../data/auth";

const TopBar = () => {
  const navigate = useNavigate();

  const buttonLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar bg-primary px-3 shadow-sm sticky-top">
      <span className="navbar-brand text-white fw-bold" style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        💼 KerjaKu
      </span>
      <div className="d-flex gap-2">
        <button className="btn btn-light btn-sm" onClick={() => navigate("/profile")}>
          Profil
        </button>
        <button className="btn btn-outline-light btn-sm" onClick={buttonLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
```

**`src/components/BottomBar.jsx`**

```jsx
import { useLocation, useNavigate } from "react-router-dom";

const menu = [
  { path: "/dashboard", label: "Lowongan", icon: "💼" },
  { path: "/profile", label: "Profil", icon: "👤" },
];

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer className="bottom-bar">
      <div className="d-flex bg-white border-top shadow-sm">
        {menu.map((item) => (
          <button
            key={item.path}
            className={location.pathname === item.path ? "btn flex-fill text-primary fw-bold" : "btn flex-fill text-muted"}
            onClick={() => navigate(item.path)}
          >
            <div className="fs-4">{item.icon}</div>
            <small>{item.label}</small>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default BottomBar;
```

**`src/components/CardJob.jsx`**

```jsx
import { useNavigate } from "react-router-dom";

const CardJob = (props) => {
  const navigate = useNavigate();

  return (
    <div className="card card-job border-0 shadow-sm mb-3" onClick={() => navigate("/detail/" + props.id)}>
      <div className="card-body d-flex gap-3 align-items-center">
        <div className="inisial">{props.company.charAt(0)}</div>
        <div>
          <h5 className="card-title mb-1">{props.title}</h5>
          <p className="text-muted mb-2">{props.company}</p>
          <span className="badge bg-light text-dark border me-2">📍 {props.location}</span>
          <span className="text-success fw-bold">{props.salary}</span>
        </div>
      </div>
    </div>
  );
};

export default CardJob;
```

### 3.12 Halaman

**`src/pages/Login.jsx`**

```jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, cekLogin } from "../data/auth"
import { pesanError } from "../data/api"

const Login = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const buttonLogin = async (e) => {
    e.preventDefault()

    if (username.trim() === "" || password === "") {
      setError("Username dan password wajib diisi")
      return
    }

    setLoading(true)
    try {
      const user = await cekLogin(username.trim(), password)
      login(user)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(pesanError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <main className="page-content">
        <div className="container py-5" style={{ maxWidth: "400px" }}>
          <div className="card border-0 shadow-sm p-4 mt-5">
            <div className="text-center fs-1">💼</div>
            <h1 className="text-primary fw-bold text-center">KerjaKu</h1>
            <p className="text-muted text-center mb-4">Cari dan lamar pekerjaan</p>

            <form onSubmit={buttonLogin}>
              <input type="text" className="form-control mb-3" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <small className="text-muted text-center mt-3">
              Akun test: <b>anggia</b> / <b>kerja123</b>
            </small>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login
```

**`src/pages/Dashboard.jsx`**

```jsx
import { useEffect, useState } from "react"
import TopBar from "../components/TopBar"
import CardJob from "../components/CardJob"
import BottomBar from "../components/BottomBar"
import { getJobs } from "../data/jobs"
import { getUser } from "../data/auth"
import { pesanError } from "../data/api"

const Dashboard = () => {
  const user = getUser()
  const [search, setSearch] = useState("")
  const [hasil, setHasil] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Ambil lowongan dari API setiap kali kata pencarian berubah
  useEffect(() => {
    setLoading(true)
    getJobs(search)
      .then((data) => {
        setHasil(data)
        setError("")
      })
      .catch((err) => setError(pesanError(err)))
      .finally(() => setLoading(false))
  }, [search])

  return (
    <div className="page">
      <main className="page-content">
        <TopBar />

        <div className="container py-4" style={{ maxWidth: "700px" }}>
          <div className="bg-primary text-white rounded-3 p-4 mb-4">
            <h4 className="mb-1">Halo, {user.name} 👋</h4>
            <p className="mb-0">Temukan pekerjaan yang cocok untukmu</p>
          </div>

          <input type="text" className="form-control form-control-lg mb-3" placeholder="🔍 Cari posisi..." value={search} onChange={(e) => setSearch(e.target.value)} />

          {error && <div className="alert alert-danger py-2">{error}</div>}

          {loading ? (
            <p className="text-center text-muted">Memuat lowongan...</p>
          ) : (
            <>
              <p className="text-muted small">{hasil.length} lowongan ditemukan</p>

              {hasil.map((job) => (
                <CardJob key={job.id} id={job.id} title={job.title} company={job.company} location={job.location} salary={job.salary} />
              ))}

              {hasil.length === 0 && !error && <p className="text-center text-muted">Lowongan tidak ditemukan</p>}
            </>
          )}
        </div>
      </main>
      <BottomBar />
    </div>
  )
}

export default Dashboard
```

**`src/pages/Detail.jsx`**

```jsx
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TopBar from "../components/TopBar"
import { getUser } from "../data/auth"
import { getJob } from "../data/jobs"
import { kirimLamaran, sudahMelamar } from "../data/lamaran"
import { pesanError } from "../data/api"

const Detail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const user = getUser()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cv, setCv] = useState("")
  const [pesan, setPesan] = useState("")
  const [error, setError] = useState("")
  const [terkirim, setTerkirim] = useState(false)

  // Ambil detail lowongan dan status lamaran dari API
  useEffect(() => {
    setLoading(true)
    Promise.all([getJob(id), sudahMelamar(id, user.username)])
      .then(([dataJob, sudah]) => {
        setJob(dataJob)
        setTerkirim(sudah)
      })
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
  }, [id, user.username])

  if (loading) {
    return (
      <div className="page">
        <main className="page-content">
          <TopBar />
          <p className="text-center text-muted mt-5">Memuat lowongan...</p>
        </main>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="page">
        <main className="page-content">
          <TopBar />
          <p className="text-center mt-5">Lowongan tidak ditemukan</p>
        </main>
      </div>
    )
  }

  const buttonLamar = async (e) => {
    e.preventDefault()

    if (cv.trim() === "") {
      setError("Link CV wajib diisi")
      return
    }

    try {
      await kirimLamaran({ jobId: job.id, username: user.username, cv: cv.trim(), pesan: pesan })
      setError("")
      setTerkirim(true)
    } catch (err) {
      setError(pesanError(err))
    }
  }

  return (
    <div className="page">
      <main className="page-content">
        <TopBar />

        <div className="container py-4" style={{ maxWidth: "600px" }}>
          <button className="btn btn-link px-0 mb-3" onClick={() => navigate(-1)}>
            ← Kembali
          </button>

          <div className="card border-0 shadow-sm p-4 mb-4">
            <div className="d-flex gap-3 align-items-center mb-3">
              <div className="inisial">{job.company.charAt(0)}</div>
              <div>
                <h3 className="mb-0">{job.title}</h3>
                <p className="text-muted mb-0">{job.company}</p>
              </div>
            </div>
            <p className="mb-1">📍 {job.location}</p>
            <p className="text-success fw-bold">💰 {job.salary} / bulan</p>
            <h6 className="fw-bold">Deskripsi</h6>
            <p className="mb-0">{job.description}</p>
          </div>

          {terkirim ? (
            <div className="alert alert-success">✅ Lamaran kamu sudah terkirim.</div>
          ) : (
            <form className="card border-0 shadow-sm p-4" onSubmit={buttonLamar}>
              <h5 className="mb-3">📝 Form Lamaran</h5>

              <input type="text" className="form-control mb-2" value={user.name} disabled />
              <input type="email" className="form-control mb-2" value={user.email} disabled />
              <input type="text" className="form-control mb-2" placeholder="Link CV (Google Drive)" value={cv} onChange={(e) => setCv(e.target.value)} />
              <textarea className="form-control mb-3" rows="3" placeholder="Pesan untuk perusahaan (opsional)" value={pesan} onChange={(e) => setPesan(e.target.value)} />

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <button type="submit" className="btn btn-primary w-100">
                Kirim Lamaran
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}

export default Detail
```

**`src/pages/Profile.jsx`**

```jsx
import { useState } from "react"
import TopBar from "../components/TopBar"
import BottomBar from "../components/BottomBar"
import { getUser, updateAccount } from "../data/auth"
import { pesanError } from "../data/api"

const Profile = () => {
  const [user, setUser] = useState(getUser())
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone || "")
  const [password, setPassword] = useState("")
  const [pesan, setPesan] = useState("")

  const buttonSimpan = async (e) => {
    e.preventDefault()

    if (name.trim() === "" || email.trim() === "") {
      setPesan("Nama dan email tidak boleh kosong")
      return
    }

    const data = { name: name.trim(), email: email.trim(), phone: phone }
    if (password !== "") data.password = password

    try {
      setUser(await updateAccount(user.username, data))
      setPassword("")
      setPesan("Profil berhasil disimpan")
    } catch (err) {
      setPesan(pesanError(err))
    }
  }

  return (
    <div className="page">
      <main className="page-content">
        <TopBar />

        <div className="container py-4" style={{ maxWidth: "500px" }}>
          <div className="text-center mb-4">
            <div className="inisial mx-auto mb-2" style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
              {user.name.charAt(0)}
            </div>
            <h4 className="mb-0">{user.name}</h4>
            <p className="text-muted">@{user.username}</p>
          </div>

          <form className="card border-0 shadow-sm p-4" onSubmit={buttonSimpan}>
            <label>Nama</label>
            <input type="text" className="form-control mb-3" value={name} onChange={(e) => setName(e.target.value)} />

            <label>Email</label>
            <input type="email" className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Nomor HP</label>
            <input type="text" className="form-control mb-3" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label>Password Baru</label>
            <input type="password" className="form-control mb-3" placeholder="Kosongkan jika tidak diganti" value={password} onChange={(e) => setPassword(e.target.value)} />

            {pesan && <div className="alert alert-info py-2">{pesan}</div>}

            <button type="submit" className="btn btn-primary w-100">
              Simpan
            </button>
          </form>
        </div>
      </main>
      <BottomBar />
    </div>
  )
}

export default Profile
```

**`src/pages/NotFound.jsx`**

```jsx
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <main className="page-content">
        <div className="text-center py-5">
          <h1 className="display-1 text-primary">404</h1>
          <p>Halaman tidak ditemukan</p>
          <button className="btn btn-primary" onClick={() => navigate("/", { replace: true })}>
            Kembali ke Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
```

### 3.13 `src/App.jsx` (routing)

```jsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Detail from "./pages/Detail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { getUser } from "./data/auth";

import "bootstrap/dist/css/bootstrap.min.css";
import "./theme/style.css";

// Halaman yang wajib login
const RequireLogin = ({ children }) => (getUser() ? children : <Navigate to="/login" replace />);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RequireLogin><Dashboard /></RequireLogin>} />
      <Route path="/detail/:id" element={<RequireLogin><Detail /></RequireLogin>} />
      <Route path="/profile" element={<RequireLogin><Profile /></RequireLogin>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
```

---

## 4. Menjalankan Project

Butuh **2 terminal** yang terbuka bersamaan. Backend harus dijalankan lebih dulu.

**Terminal 1 (backend):**

```powershell
cd myApp\api
npm run dev
```

**Terminal 2 (frontend):**

```powershell
cd myApp
npm run dev
```

Buka alamat yang muncul di Terminal 2 (biasanya `http://localhost:5173`), lalu login dengan:

| Username | Password |
|---|---|
| `anggia` | `kerja123` |
| `admin` | `admin123` |

### Kalau clone dari GitHub (bukan membuat dari nol)

Folder `node_modules/` tidak ikut ke GitHub. Jalankan langkah berikut sekali:

```powershell
# Backend
cd api
npm install

# Frontend
cd ..
npm install
```

Setelah itu jalankan seperti biasa (Terminal 1 dan Terminal 2 di atas).

---

## 5. Testing API

### Lewat browser (hanya untuk GET)

- `http://127.0.0.1:8000/api/jobs`
- `http://127.0.0.1:8000/api/jobs?search=developer`
- `http://127.0.0.1:8000/api/jobs/1`
- `http://127.0.0.1:8000/api/lamaran?username=anggia`

### Lewat Thunder Client atau Postman (untuk POST dan PUT)

Atur header `Content-Type: application/json`.

**Login**

```
POST http://127.0.0.1:8000/api/login
```
```json
{ "username": "anggia", "password": "kerja123" }
```

**Update profil**

```
PUT http://127.0.0.1:8000/api/users/anggia
```
```json
{ "name": "Anggia Putri", "email": "anggia@kerjaku.com", "phone": "081298765432" }
```

**Kirim lamaran**

```
POST http://127.0.0.1:8000/api/lamaran
```
```json
{ "jobId": 1, "username": "anggia", "cv": "https://drive.google.com/cv-anggia", "pesan": "Saya tertarik" }
```

Koleksi Postman yang sudah jadi ada di `api/postman/KerjaKu-API.postman_collection.json` (bisa di-import).

### Kode status yang mungkin muncul

| Kode | Arti | Contoh |
|---|---|---|
| 200 | Berhasil | Login benar |
| 201 | Data berhasil dibuat | Lamaran terkirim |
| 401 | Tidak diizinkan | Password salah |
| 404 | Tidak ditemukan | `/api/jobs/99` |
| 422 | Validasi gagal | CV kosong, atau sudah pernah melamar |

### Lihat isi database

Buka `api/data/db.json` di VS Code. Setiap lamaran baru atau perubahan profil langsung tersimpan di file ini.

---

## 6. Bonus: API Statis untuk GitHub Pages

Fitur opsional ini mengekspor data lowongan ke file JSON di folder `docs/api`, supaya bisa di-hosting gratis di GitHub Pages tanpa server.

**a. Buat file `api/build-static.js`:**

```js
// Membuat API statis (file JSON) dari data/db.json ke folder docs/api untuk GitHub Pages
const fs = require("fs");
const path = require("path");
const { baca } = require("./db");

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

fs.rmSync(OUT, { recursive: true, force: true });

const jobs = baca().lowongan;

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
```

**b. Jalankan:**

```powershell
cd api
npm run static
```

**c. Upload ke GitHub**, lalu buka **Settings → Pages**. Pilih branch `main` dan folder `/docs`.

---

## 7. Build ke Android (Capacitor)

**a. Buat `capacitor.config.ts` di folder `myApp`:**

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'myApp',
  webDir: 'dist'
};

export default config;
```

**b. Ganti alamat API.** Di HP, `127.0.0.1` merujuk ke HP itu sendiri, bukan ke laptop. Caranya:

1. Cari IP laptop dengan `ipconfig`, lihat bagian **IPv4 Address** (misalnya `192.168.1.10`).
2. Buat file `.env` di folder `myApp` (bukan di folder `api`):
   ```env
   VITE_API_URL=http://192.168.1.10:8000/api
   ```
3. Jalankan backend seperti biasa (`npm run dev` di folder `api`). Express sudah menerima koneksi dari jaringan.
4. Pastikan HP dan laptop terhubung ke WiFi yang sama. Kalau Windows Firewall bertanya, pilih **Allow** untuk Node.js.

**c. Build dan buka di Android Studio:**

```powershell
npm install @capacitor/android
npm run build
npx cap add android
npx cap sync
npx cap open android
```

**d. Izinkan HTTP.** Android memblokir koneksi `http://` secara default. Buka `android/app/src/main/AndroidManifest.xml`, lalu tambahkan atribut ini pada tag `<application>`:

```xml
android:usesCleartextTraffic="true"
```

Setiap kali kode frontend diubah, jalankan ulang `npm run build` lalu `npx cap sync`.

---

## 8. Masalah yang Sering Muncul

| Masalah | Penyebab | Solusi |
|---|---|---|
| "Tidak bisa terhubung ke server API" | Backend belum dijalankan | Jalankan `npm run dev` di folder `api` |
| `Cannot find module 'express'` | Package belum di-install | `npm install` di folder `api` |
| `EADDRINUSE: address already in use :::8000` | Port 8000 sudah dipakai (server lama masih jalan) | Tutup terminal lama, atau jalankan dengan port lain: `$env:PORT=8001; npm run dev` (ubah juga `VITE_API_URL`) |
| `SyntaxError: Unexpected token` saat start | Format `db.json` rusak (kurang koma/kurung) | Perbaiki `api/data/db.json`, cek dengan formatter VS Code |
| `req.body` bernilai `undefined` | Lupa `app.use(express.json())` | Tambahkan sebelum endpoint |
| Error CORS di console browser | Lupa `app.use(cors())` | Tambahkan di `server.js` |
| Halaman dashboard error setelah refresh | Data login hanya disimpan di memori | Login ulang. Memang begitu desainnya. |
| Ingin mengembalikan data awal | Data lamaran/profil sudah berubah | `git checkout api/data/db.json` |

---

## 9. Ringkasan untuk Presentasi

**"API-nya pakai apa?"**
> REST API dengan **Node.js + Express**, format data JSON, data disimpan di file `api/data/db.json`. Frontend memanggil API memakai **Axios**.

**"Alurnya bagaimana?"**
> Halaman React memanggil fungsi di `src/data`, lalu Axios mengirim request ke Express. Express mencocokkan URL dengan route di `server.js` (`app.get`, `app.post`, `app.put`), membaca atau menyimpan data di `db.json`, lalu mengirim hasilnya sebagai JSON.

**"Kenapa pakai file JSON, bukan database?"**
> Supaya sederhana dan tidak perlu install database server. Strukturnya tetap seperti 3 tabel: `users`, `lowongan`, dan `lamaran`. Kalau dikembangkan, bisa diganti ke SQLite atau MySQL tanpa mengubah frontend.

**"Kenapa pakai `cors` dan `express.json()`?"**
> `cors()` mengizinkan frontend di port 5173 memanggil API di port 8000. `express.json()` membuat body request berformat JSON bisa dibaca lewat `req.body`.

**"Password aman?"**
> Belum. Password masih disimpan sebagai teks biasa di `db.json`, dan API tidak pernah mengirim password ke frontend. Pengembangan berikutnya bisa memakai **bcrypt** untuk hash password.

**"Sudah pakai token?"**
> Belum. Login hanya mencocokkan username dan password, lalu data user disimpan di memori aplikasi. Pengembangan berikutnya bisa memakai **JWT** (`jsonwebtoken`) untuk autentikasi berbasis token.
