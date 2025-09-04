import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ role }) {
  const base = role === "guru" ? "/guru" : "/siswa";
  const itemsGuru = [
    { to: `${base}`, label: "Dashboard" },
    { to: `${base}/kelas`, label: "Kelas" },
    { to: `${base}/siswa`, label: "Siswa" },
    { to: `${base}/verifikasi`, label: "Verifikasi Aktivitas" },
    { to: `${base}/rekap`, label: "Rekap Aktivitas" },
    { to: `${base}/level`, label: "Level & Target" },
    { to: `${base}/profil`, label: "Profil" }
  ];
  const itemsSiswa = [
    { to: `${base}`, label: "Dashboard" },
    { to: `${base}/aktivitas/tambah`, label: "Tambah Aktivitas" },
    { to: `${base}/aktivitas`, label: "Daftar Aktivitas" },
    { to: `${base}/leaderboard`, label: "Leaderboard" }
  ];
  const items = role === "guru" ? itemsGuru : itemsSiswa;
  return (
    <aside className="w-64 hidden md:block border-r bg-white">
      <nav className="p-4 flex flex-col gap-1">
        {items.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${isActive ? "bg-primary text-white" : "hover:bg-gray-100"}`
            }
          >
            {i.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
