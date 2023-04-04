import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {

  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <Button color="inherit" onClick={handleLogout}>
      Log out
    </Button>
  );
};

export default Logout;
