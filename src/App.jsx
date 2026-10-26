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
