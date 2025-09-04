import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Table from "../../components/Table.jsx";
import { showToast } from "../../components/Toast.jsx";

export default function SiswaPage() {
  const [kelas, setKelas] = useState([]);
  const [kelasId, setKelasId] = useState("");
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ nama: "", email: "", username: "" });
  const [modal, setModal] = useState(false);

  useEffect(() => {
    (async () => {
      const k = await api.getKelas("guru");
      setKelas(k.data || []);
      if (k.data?.[0]) setKelasId(k.data[0].id);
    })();
  }, []);

  useEffect(() => {
    if (!kelasId) return;
    (async () => {
      const s = await api.getSiswa(kelasId);
      setData(s.data || []);
    })();
  }, [kelasId]);

  async function save() {
    if (!form.nama.trim() || !form.username.trim()) return showToast("Nama & username wajib", "danger");
    const payload = { ...form, kelas_id: kelasId };
    if (form.id) await api.updateSiswa(form.id, payload);
    else await api.createSiswa(payload);
    setModal(false);
    setForm({ nama: "", email: "", username: "" });
    const s = await api.getSiswa(kelasId);
    setData(s.data || []);
    showToast("Data siswa tersimpan");
  }

  async function resetPassword(id) {
    await api.resetSiswaPassword(id);
    showToast("Password siswa telah direset");
  }

  async function setAktif(id, aktif) {
    await api.setAktifSiswa(id, aktif);
    const s = await api.getSiswa(kelasId);
    setData(s.data || []);
    showToast(`Akun ${aktif ? "diaktifkan" : "dinonaktifkan"}`);
  }

  const filtered = data.filter(d =>
    (d.nama || "").toLowerCase().includes(q.toLowerCase()) ||
    (d.username || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Manajemen Siswa</h2>
      <div className="flex gap-2 items-center">
        <select className="input w-auto" value={kelasId} onChange={(e)=>setKelasId(e.target.value)}>
          {kelas.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
        </select>
        <input className="input max-w-xs" placeholder="Cari siswa..." value={q} onChange={(e)=>setQ(e.target.value)} />
        <button className="btn btn-primary ml-auto" onClick={()=>{ setForm({ nama: "", email: "", username: "" }); setModal(true); }}>Tambah</button>
      </div>

      <Table
        columns={[
          { key: "nama", label: "Nama" },
          { key: "username", label: "Username" },
          { key: "aktif", label: "Status" },
          { key: "aksi", label: "Aksi" }
        ]}
        data={filtered}
        renderCell={(c, r) => {
          if (c.key === "aktif") return r.aktif ? <span className="badge">Aktif</span> : <span className="badge">Nonaktif</span>;
          if (c.key === "aksi") return (
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={()=>{ setForm(r); setModal(true); }}>Ubah</button>
              <button className="btn btn-outline" onClick={()=>resetPassword(r.id)}>Reset Password</button>
              <button className="btn btn-outline" onClick={()=>setAktif(r.id, !r.aktif)}>{r.aktif ? "Nonaktifkan" : "Aktifkan"}</button>
            </div>
          );
          return r[c.key];
        }}
      />

      {modal && (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md space-y-3">
            <h3 className="font-semibold">{form.id ? "Ubah Siswa" : "Tambah Siswa"}</h3>
            <div><label className="label">Nama</label><input className="input" value={form.nama} onChange={(e)=>setForm({...form, nama: e.target.value})}/></div>
            <div><label className="label">Email (opsional)</label><input className="input" value={form.email||""} onChange={(e)=>setForm({...form, email: e.target.value})}/></div>
            <div><label className="label">Username</label><input className="input" value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})}/></div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={()=>setModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={save}>Simpan</button>
            </div>
            <p className="text-xs text-onSurface/60">Password siswa otomatis saat seed/penambahan. Harap diganti setelah login.</p>
          </div>
        </div>
      )}
    </div>
  );
}
