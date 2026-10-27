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
