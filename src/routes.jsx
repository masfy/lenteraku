import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";

import DashboardGuru from "./pages/guru/DashboardGuru.jsx";
import KelasPage from "./pages/guru/KelasPage.jsx";
import SiswaPage from "./pages/guru/SiswaPage.jsx";
import AktivitasVerify from "./pages/guru/AktivitasVerify.jsx";
import RekapPage from "./pages/guru/RekapPage.jsx";
import LevelPage from "./pages/guru/LevelPage.jsx";
import ProfilGuru from "./pages/guru/ProfilGuru.jsx";

import DashboardSiswa from "./pages/siswa/DashboardSiswa.jsx";
import AktivitasSiswaForm from "./pages/siswa/AktivitasSiswaForm.jsx";
import AktivitasSiswaList from "./pages/siswa/AktivitasSiswaList.jsx";
import LeaderboardPage from "./pages/siswa/LeaderboardPage.jsx";

export default function RoutesDef() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />

      <Route element={<ProtectedRoute allowed={["guru"]} />}>
        <Route element={<Layout role="guru" />}>
          <Route path="/guru" element={<DashboardGuru />} />
          <Route path="/guru/kelas" element={<KelasPage />} />
          <Route path="/guru/siswa" element={<SiswaPage />} />
          <Route path="/guru/verifikasi" element={<AktivitasVerify />} />
          <Route path="/guru/rekap" element={<RekapPage />} />
          <Route path="/guru/level" element={<LevelPage />} />
          <Route path="/guru/profil" element={<ProfilGuru />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowed={["siswa"]} />}>
        <Route element={<Layout role="siswa" />}>
          <Route path="/siswa" element={<DashboardSiswa />} />
          <Route path="/siswa/aktivitas/tambah" element={<AktivitasSiswaForm />} />
          <Route path="/siswa/aktivitas" element={<AktivitasSiswaList />} />
          <Route path="/siswa/leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
