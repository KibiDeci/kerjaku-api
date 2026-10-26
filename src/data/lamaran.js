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
