import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to={user?.role === "guru" ? "/guru" : "/siswa"} className="font-semibold text-primary">Lentera</Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-onSurface/70">{user?.nama} {user?.role && <span className="badge ml-2">Role: {user.role}</span>}</span>
          <Link to="/logout" className="btn btn-outline">Keluar</Link>
        </div>
      </div>
    </header>
  );
}
