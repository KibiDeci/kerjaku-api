import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";

const Store = () => {
  const [name, Name] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const checkLocation = () => {
    console.log(location);
  };

  const buttonEnter = () => {
    navigate("/", { replace: true });
  };

  useEffect(() => {
    Name(location.state ? location.state.name : "");
  }, [name]);

  return (
    <div>
      <TopBar Title="Store" />

      <button onClick={checkLocation}>Location</button>

      <br />

      <button className="" onClick={buttonEnter}>
        Pergi ke Home
      </button>
    </div>
  );
};

export default Store;
