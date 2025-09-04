import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Table from "../../components/Table.jsx";
import { formatDate } from "../../utils/date.js";

export default function DashboardGuru() {
  const [stats, setStats] = useState(null);
  const [kelas, setKelas] = useState([]);
  const [kelasId, setKelasId] = useState("");
  const [waiting, setWaiting] = useState([]);
  const [top, setTop] = useState([]);

  useEffect(() => {
    (async () => {
      const resKelas = await api.getKelas("guru");
      setKelas(resKelas.data || []);
      if (resKelas.data?.[0]) setKelasId(resKelas.data[0].id);
      const s = await api.statsDashboardGuru();
      setStats(s.data);
      const w = await api.getAktivitas({ status: "Menunggu" });
      setWaiting(w.data?.slice(0, 5) || []);
    })();
  }, []);

  useEffect(() => {
    if (!kelasId) return;
    (async () => {
      const lb = await api.getLeaderboard(kelasId);
      setTop(lb.data?.slice(0, 5) || []);
    })();
  }, [kelasId]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard Guru</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card"><div className="text-xs text-onSurface/60">Total Kelas</div><div className="text-2xl font-bold">{stats?.total_kelas ?? "-"}</div></div>
        <div className="card"><div className="text-xs text-onSurface/60">Total Siswa</div><div className="text-2xl font-bold">{stats?.total_siswa ?? "-"}</div></div>
        <div className="card"><div className="text-xs text-onSurface/60">Menunggu Verifikasi</div><div className="text-2xl font-bold">{stats?.menunggu ?? "-"}</div></div>
        <div className="card"><div className="text-xs text-onSurface/60">Disetujui Bulan Ini</div><div className="text-2xl font-bold">{stats?.disetujui_bulan_ini ?? "-"}</div></div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Top 5 Leaderboard</div>
          <select className="input w-auto" value={kelasId} onChange={(e)=>setKelasId(e.target.value)}>
            {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
          </select>
        </div>
        <Table
          columns={[
            { key: "no", label: "#" },
            { key: "nama", label: "Nama" },
            { key: "poin", label: "Poin" },
            { key: "level", label: "Level" },
            { key: "durasi", label: "Durasi (menit)" },
            { key: "jumlah", label: "Jml Aktivitas" }
          ]}
          data={top.map((t, i) => ({ ...t, no: i + 1 }))}
          renderCell={(c, r) => c.key === "level" ? <span className="badge">Lv. {r.level}</span> : r[c.key]}
        />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Aktivitas Menunggu</div>
        </div>
        <Table
          columns={[
            { key: "siswa_nama", label: "Siswa" },
            { key: "judul_bacaan", label: "Judul" },
            { key: "tanggal_baca", label: "Tanggal" }
          ]}
          data={waiting}
          renderCell={(c, r) => c.key === "tanggal_baca" ? formatDate(r.tanggal_baca) : r[c.key]}
        />
      </div>
    </div>
  );
}
