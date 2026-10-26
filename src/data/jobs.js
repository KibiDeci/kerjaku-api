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
