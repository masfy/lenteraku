import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { showToast } from "../../components/Toast.jsx";

export default function ProfilGuru() {
  const [form, setForm] = useState({ nama: "", email: "", sekolah: "", foto_url: "" });

  useEffect(() => {
    (async () => {
      const me = await api.me();
      setForm({ nama: me.user.nama || "", email: me.user.email || "", sekolah: me.user.sekolah || "", foto_url: me.user.foto_url || "" });
    })();
  }, []);

  async function save() {
    await api.updateProfilGuru(form);
    showToast("Profil tersimpan");
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-lg font-semibold">Profil Guru</h2>
      <div className="card space-y-3">
        <div><label className="label">Nama</label><input className="input" value={form.nama} onChange={(e)=>setForm({...form, nama: e.target.value})}/></div>
        <div><label className="label">Email</label><input className="input" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})}/></div>
        <div><label className="label">Sekolah (opsional)</label><input className="input" value={form.sekolah} onChange={(e)=>setForm({...form, sekolah: e.target.value})}/></div>
        <div><label className="label">Foto URL (opsional)</label><input className="input" value={form.foto_url} onChange={(e)=>setForm({...form, foto_url: e.target.value})}/></div>
        <div className="flex justify-end"><button className="btn btn-primary" onClick={save}>Simpan</button></div>
      </div>
    </div>
  );
}
