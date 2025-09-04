import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { progressKeLevelBerikutnya } from "../../utils/level.js";

export default function DashboardSiswa() {
  const [stats, setStats] = useState(null);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    (async () => {
      const lv = await api.getLevel();
      setLevels(lv.data || []);
      const me = await api.me();
      const s = await api.statsDashboardSiswa(me.user.id);
      setStats(s.data);
    })();
  }, []);

  const prog = stats ? progressKeLevelBerikutnya(stats.total_poin || 0, levels) : null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Dashboard Siswa</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card"><div className="text-xs text-onSurface/60">Total Poin</div><div className="text-2xl font-bold">{stats?.total_poin ?? "-"}</div></div>
        <div className="card"><div className="text-xs text-onSurface/60">Level Saat Ini</div><div className="text-2xl font-bold">Lv. {stats?.level ?? "-"}</div></div>
        <div className="card"><div className="text-xs text-onSurface/60">Disetujui</div><div className="text-2xl font-bold">{stats?.disetujui ?? "-"}</div></div>
        <div className="card"><div className="text-xs text-onSurface/60">Menunggu / Ditolak</div><div className="text-2xl font-bold">{stats?.menunggu ?? 0} / {stats?.ditolak ?? 0}</div></div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Progress ke Level Berikutnya</div>
          {prog?.next && <span className="badge">Target Lv. {prog.next.nama_level}</span>}
        </div>
        <div className="mt-2 h-3 bg-gray-200 rounded">
          <div className="h-full bg-primary rounded" style={{ width: `${prog?.progress || 0}%` }} />
        </div>
        <p className="text-xs text-onSurface/60 mt-2">Teruskan kebiasaan membaca. Coba baca 15–20 menit tiap hari.</p>
      </div>
    </div>
  );
}
