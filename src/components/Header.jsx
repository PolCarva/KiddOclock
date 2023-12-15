import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Cerrar sesión");
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Kidd O'Clock</h1>
      <button
        onClick={handleLogout}
        className="px-3 py-1 rounded text-white bg-red-500 hover:bg-red-600"
      >
        Cerrar Sesión
      </button>
    </header>
  );
};

export default Header;
