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
