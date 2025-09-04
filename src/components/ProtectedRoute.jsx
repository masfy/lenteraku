import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ allowed }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/login" replace />;
  if (user.aktif === false) return <div className="p-6">Akun nonaktif. Hubungi admin/guru.</div>;
  return <Outlet />;
}
