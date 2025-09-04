import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      await logout();
      navigate("/login", { replace: true });
    })();
  }, []);
  return <div className="p-6">Keluar...</div>;
}
