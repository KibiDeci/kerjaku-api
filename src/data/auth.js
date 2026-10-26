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
