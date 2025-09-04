import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Table from "../../components/Table.jsx";
import Modal from "../../components/Modal.jsx";
import { formatDate } from "../../utils/date.js";
import { showToast } from "../../components/Toast.jsx";

export default function AktivitasVerify() {
  const [kelas, setKelas] = useState([]);
  const [kelasId, setKelasId] = useState("");
  const [status, setStatus] = useState("Menunggu");
  const [range, setRange] = useState({ from: "", to: "" });
  const [q, setQ] = useState("");
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState(null);
  const [catatan, setCatatan] = useState("");

  async function load() {
    const res = await api.getAktivitas({ status, kelas_id: kelasId || undefined, q: q || undefined, from: range.from || undefined, to: range.to || undefined });
    setData(res.data || []);
  }

  useEffect(() => {
    (async () => {
      const k = await api.getKelas("guru");
      setKelas(k.data || []);
      if (k.data?.[0]) setKelasId(k.data[0].id);
    })();
  }, []);
  useEffect(() => { load(); }, [status, kelasId]);

  async function setujui(a) {
    await api.verifyAktivitas(a.id, { status: "Disetujui" });
    showToast("Aktivitas disetujui");
    setDetail(null);
    load();
  }

  async function tolak(a) {
    if (!catatan.trim()) return showToast("Catatan wajib diisi saat penolakan", "danger");
    await api.verifyAktivitas(a.id, { status: "Ditolak", catatan: catatan.trim() });
    showToast("Aktivitas ditolak");
    setCatatan("");
    setDetail(null);
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Verifikasi Aktivitas</h2>
      <div className="flex flex-wrap gap-2 items-end">
        <select className="input w-auto" value={kelasId} onChange={(e)=>setKelasId(e.target.value)}>
          <option value="">Semua Kelas</option>
          {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
        </select>
        <select className="input w-auto" value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option>Menunggu</option><option>Disetujui</option><option>Ditolak</option>
        </select>
        <div>
          <label className="label">Dari</label>
          <input className="input" type="date" value={range.from} onChange={(e)=>setRange({...range, from: e.target.value})}/>
        </div>
        <div>
          <label className="label">Sampai</label>
          <input className="input" type="date" value={range.to} onChange={(e)=>setRange({...range, to: e.target.value})}/>
        </div>
        <div className="flex gap-2">
          <input className="input" placeholder="Cari judul/siswa..." value={q} onChange={(e)=>setQ(e.target.value)} />
          <button className="btn btn-outline" onClick={load}>Terapkan</button>
        </div>
      </div>

      <Table
        columns={[
          { key: "siswa_nama", label: "Siswa" },
          { key: "judul_bacaan", label: "Judul" },
          { key: "tanggal_baca", label: "Tanggal" },
          { key: "durasi_menit", label: "Durasi (m)" },
          { key: "status", label: "Status" },
          { key: "aksi", label: "Aksi" }
        ]}
        data={data}
        renderCell={(c, r) => {
          if (c.key === "tanggal_baca") return formatDate(r.tanggal_baca);
          if (c.key === "status") return <span className="badge">{r.status}</span>;
          if (c.key === "aksi") return <button className="btn btn-outline" onClick={()=>setDetail(r)}>Detail</button>;
          return r[c.key];
        }}
      />

      <Modal
        open={!!detail}
        title="Detail Aktivitas"
        onClose={()=>setDetail(null)}
        footer={
          detail?.status === "Menunggu" ? (
            <>
              <button className="btn btn-outline" onClick={()=>setDetail(null)}>Tutup</button>
              <button className="btn btn-primary" onClick={()=>setujui(detail)}>Setujui</button>
              <button className="btn btn-outline" onClick={()=>tolak(detail)}>Tolak</button>
            </>
          ) : <button className="btn btn-outline" onClick={()=>setDetail(null)}>Tutup</button>
        }
      >
        {detail && (
          <div className="space-y-2 text-sm">
            <div><b>Nama:</b> {detail.siswa_nama}</div>
            <div><b>Judul:</b> {detail.judul_bacaan}</div>
            <div><b>Jenis:</b> {detail.jenis_bacaan}</div>
            <div><b>Tanggal:</b> {formatDate(detail.tanggal_baca)}</div>
            <div><b>Durasi:</b> {detail.durasi_menit} menit</div>
            <div><b>Ringkasan:</b> {detail.ringkasan}</div>
            <div><b>Refleksi:</b> {detail.refleksi}</div>
            {detail.bukti_url && <div><b>Bukti:</b> <a className="text-primary underline" href={detail.bukti_url} target="_blank">Lihat</a></div>}
            {detail.status === "Ditolak" && <div><b>Catatan:</b> {detail.catatan_verifikasi}</div>}
            {detail.status === "Menunggu" && (
              <div>
                <label className="label">Catatan (wajib jika Tolak)</label>
                <textarea className="input h-24" value={catatan} onChange={(e)=>setCatatan(e.target.value)} />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
