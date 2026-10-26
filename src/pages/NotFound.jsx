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
