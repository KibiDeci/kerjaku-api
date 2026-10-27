const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Kirim error database sebagai 500
const errorServer = (res, err) => res.status(500).json({ message: err.message });

// Query lamaran beserta data user, dengan nama kolom yang dipakai frontend
const SQL_LAMARAN = `
  SELECT l.id, l.lowongan_id AS jobId, u.username, u.name AS nama, u.email, l.cv, l.pesan, l.tanggal
  FROM lamaran l JOIN users u ON u.id = l.user_id`;

// GET /api/jobs?search=dev
app.get("/api/jobs", (req, res) => {
  const search = req.query.search || "";
  db.all("SELECT * FROM lowongan WHERE title LIKE ? ORDER BY id", [`%${search}%`], (err, rows) => {
    if (err) return errorServer(res, err);
    res.json(rows);
  });
});

// GET /api/jobs/:id
app.get("/api/jobs/:id", (req, res) => {
  db.get("SELECT * FROM lowongan WHERE id = ?", [req.params.id], (err, job) => {
    if (err) return errorServer(res, err);
    if (!job) return res.status(404).json({ message: "Lowongan tidak ditemukan" });
    res.json(job);
  });
});

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(422).json({ message: "Username dan password wajib diisi" });
  }

  db.get(
    "SELECT username, name, email, phone FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, user) => {
      if (err) return errorServer(res, err);
      if (!user) return res.status(401).json({ message: "Username atau password salah" });
      res.json(user);
    }
  );
});

// PUT /api/users/:username
app.put("/api/users/:username", (req, res) => {
  const { name, email, phone, password } = req.body;

  db.get("SELECT id FROM users WHERE username = ?", [req.params.username], (err, user) => {
    if (err) return errorServer(res, err);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    if (!name) return res.status(422).json({ message: "Nama tidak boleh kosong" });
    if (!email) return res.status(422).json({ message: "Email tidak boleh kosong" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(422).json({ message: "Format email tidak valid" });
    if (password && password.length < 6) {
      return res.status(422).json({ message: "Password minimal 6 karakter" });
    }

    // COALESCE: kalau password kosong (null), password lama tetap dipakai
    db.run(
      "UPDATE users SET name = ?, email = ?, phone = ?, password = COALESCE(?, password) WHERE id = ?",
      [name, email, phone || "", password || null, user.id],
      (err) => {
        if (err && err.code === "SQLITE_CONSTRAINT") {
          return res.status(422).json({ message: "Email sudah dipakai user lain" });
        }
        if (err) return errorServer(res, err);
        res.json({ username: req.params.username, name, email, phone: phone || "" });
      }
    );
  });
});

// GET /api/lamaran?username=&jobId=
app.get("/api/lamaran", (req, res) => {
  const { username, jobId } = req.query;
  let sql = SQL_LAMARAN + " WHERE 1 = 1";
  const params = [];

  if (username) {
    sql += " AND u.username = ?";
    params.push(username);
  }
  if (jobId) {
    sql += " AND l.lowongan_id = ?";
    params.push(jobId);
  }

  db.all(sql + " ORDER BY l.id", params, (err, rows) => {
    if (err) return errorServer(res, err);
    res.json(rows);
  });
});

// POST /api/lamaran
app.post("/api/lamaran", (req, res) => {
  const { jobId, username, cv, pesan } = req.body;
  if (!jobId || !username) return res.status(422).json({ message: "jobId dan username wajib diisi" });
  if (!cv) return res.status(422).json({ message: "Link CV wajib diisi" });

  db.get("SELECT id FROM lowongan WHERE id = ?", [jobId], (err, job) => {
    if (err) return errorServer(res, err);

    db.get("SELECT id FROM users WHERE username = ?", [username], (err, user) => {
      if (err) return errorServer(res, err);
      if (!job || !user) return res.status(404).json({ message: "Lowongan atau user tidak ditemukan" });

      // Pakai function biasa (bukan arrow) supaya this.lastID bisa dibaca
      db.run(
        "INSERT INTO lamaran (lowongan_id, user_id, cv, pesan) VALUES (?, ?, ?, ?)",
        [job.id, user.id, cv, pesan || ""],
        function (err) {
          if (err && err.code === "SQLITE_CONSTRAINT") {
            return res.status(422).json({ message: "Kamu sudah melamar lowongan ini" });
          }
          if (err) return errorServer(res, err);

          db.get(SQL_LAMARAN + " WHERE l.id = ?", [this.lastID], (err, lamaran) => {
            if (err) return errorServer(res, err);
            res.status(201).json(lamaran);
          });
        }
      );
    });
  });
});

app.use((req, res) => res.status(404).json({ message: "Endpoint tidak ditemukan" }));

app.listen(PORT, () => console.log(`KerjaKu API jalan di http://127.0.0.1:${PORT}/api`));
