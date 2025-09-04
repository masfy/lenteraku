import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Table from "../../components/Table.jsx";
import { formatDate } from "../../utils/date.js";

export default function RekapPage() {
  const [kelas, setKelas] = useState([]);
  const [kelasId, setKelasId] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });
  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ total: 0, total_poin: 0 });

  useEffect(() => {
    (async () => {
      const k = await api.getKelas("guru");
      setKelas(k.data || []);
      if (k.data?.[0]) setKelasId(k.data[0].id);
    })();
  }, []);

  async function load() {
    const res = await api.getRekap({ kelas_id: kelasId || undefined, from: range.from || undefined, to: range.to || undefined, status: status || undefined });
    setData(res.data?.rows || []);
    setSummary(res.data?.summary || { total: 0, total_poin: 0 });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Rekap Aktivitas</h2>
      <div className="flex flex-wrap gap-2 items-end">
        <select className="input w-auto" value={kelasId} onChange={(e)=>setKelasId(e.target.value)}>
          {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
        </select>
        <div><label className="label">Dari</label><input className="input" type="date" value={range.from} onChange={(e)=>setRange({...range, from: e.target.value})}/></div>
        <div><label className="label">Sampai</label><input className="input" type="date" value={range.to} onChange={(e)=>setRange({...range, to: e.target.value})}/></div>
        <div><label className="label">Status</label>
          <select className="input w-auto" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="">Semua</option><option>Menunggu</option><option>Disetujui</option><option>Ditolak</option>
          </select>
        </div>
        <button className="btn btn-outline" onClick={load}>Terapkan</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card"><div className="text-xs text-onSurface/60">Total Aktivitas</div><div className="text-2xl font-bold">{summary.total}</div></div>
        <div className="card"><div className="text-xs text-onSurface/60">Total Poin</div><div className="text-2xl font-bold">{summary.total_poin}</div></div>
      </div>

      <Table
        columns={[
          { key: "tanggal_baca", label: "Tanggal" },
          { key: "siswa_nama", label: "Siswa" },
          { key: "judul_bacaan", label: "Judul" },
          { key: "durasi_menit", label: "Durasi (m)" },
          { key: "status", label: "Status" },
          { key: "poin", label: "Poin" }
        ]}
        data={data}
        renderCell={(c, r) => c.key === "tanggal_baca" ? formatDate(r.tanggal_baca) : r[c.key]}
      />
      <button className="btn btn-outline">Export CSV</button>
    </div>
  );
}
