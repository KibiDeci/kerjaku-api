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
