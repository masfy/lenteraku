import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Table from "../../components/Table.jsx";
import { showToast } from "../../components/Toast.jsx";

export default function LevelPage() {
  const [levels, setLevels] = useState([]);
  const [form, setForm] = useState({ nama_level: "", min_poin: 0, max_poin: 0, deskripsi: "" });
  const [modal, setModal] = useState(false);

  async function load() {
    const res = await api.getLevel();
    setLevels(res.data || []);
  }
  useEffect(() => { load(); }, []);

  function valid() {
    if (!form.nama_level) return false;
    if (Number(form.min_poin) > Number(form.max_poin)) return false;
    // Validasi overlap sederhana (client-side; server wajib validasi juga)
    return true;
  }

  async function save() {
    if (!valid()) return showToast("Periksa rentang level", "danger");
    if (form.id) await api.updateLevel(form.id, form);
    else await api.createLevel(form);
    setModal(false);
    setForm({ nama_level: "", min_poin: 0, max_poin: 0, deskripsi: "" });
    load();
    showToast("Level tersimpan");
  }

  async function remove(id) {
    await api.deleteLevel(id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Level & Target Poin</h2>
        <button className="btn btn-primary" onClick={()=>{ setForm({ nama_level: "", min_poin: 0, max_poin: 0, deskripsi: "" }); setModal(true); }}>Tambah</button>
      </div>

      <Table
        columns={[
          { key: "nama_level", label: "Nama" },
          { key: "min_poin", label: "Min" },
          { key: "max_poin", label: "Max" },
          { key: "deskripsi", label: "Deskripsi" },
          { key: "aksi", label: "Aksi" },
        ]}
        data={levels}
        renderCell={(c, r) => c.key === "aksi" ? (
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={()=>{ setForm(r); setModal(true); }}>Ubah</button>
            <button className="btn btn-outline" onClick={()=>remove(r.id)}>Hapus</button>
          </div>
        ) : r[c.key]}
      />

      {modal && (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md space-y-3">
            <h3 className="font-semibold">{form.id ? "Ubah Level" : "Tambah Level"}</h3>
            <div><label className="label">Nama Level</label><input className="input" value={form.nama_level} onChange={(e)=>setForm({...form, nama_level: e.target.value})}/></div>
            <div><label className="label">Min Poin</label><input className="input" type="number" value={form.min_poin} onChange={(e)=>setForm({...form, min_poin: Number(e.target.value)})}/></div>
            <div><label className="label">Max Poin</label><input className="input" type="number" value={form.max_poin} onChange={(e)=>setForm({...form, max_poin: Number(e.target.value)})}/></div>
            <div><label className="label">Deskripsi (opsional)</label><textarea className="input h-20" value={form.deskripsi||""} onChange={(e)=>setForm({...form, deskripsi: e.target.value})}/></div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={()=>setModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={save}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
