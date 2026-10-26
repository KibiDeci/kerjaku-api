import axios from "axios";

// Alamat API Laravel. Bisa diganti lewat file .env: VITE_API_URL=http://alamat-server/api
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
