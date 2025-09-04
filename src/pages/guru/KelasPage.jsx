import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Table from "../../components/Table.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import { showToast } from "../../components/Toast.jsx";

export default function KelasPage() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nama_kelas: "" });
  const [toDelete, setToDelete] = useState(null);

  async function load() {
    const res = await api.getKelas("guru");
    setData(res.data);
  }
  useEffect(() => { load(); }, []);

  const filtered = data.filter(d => d.nama_kelas.toLowerCase().includes(q.toLowerCase()));

  async function save() {
    if (!form.nama_kelas.trim()) return showToast("Nama kelas wajib diisi", "danger");
    if (form.id) await api.updateKelas(form.id, form);
    else await api.createKelas(form);
    showToast("Data kelas tersimpan");
    setModal(false);
    setForm({ nama_kelas: "" });
    load();
  }

  async function remove() {
    if (!toDelete) return;
    await api.deleteKelas(toDelete.id);
    setToDelete(null);
    showToast("Kelas terhapus");
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Manajemen Kelas</h2>
        <button className="btn btn-primary" onClick={()=>{ setForm({ nama_kelas: "" }); setModal(true); }}>Tambah</button>
      </div>
      <div className="flex gap-2">
        <input className="input max-w-xs" placeholder="Cari kelas..." value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <Table
        columns={[
          { key: "nama_kelas", label: "Nama Kelas" },
          { key: "aksi", label: "Aksi" }
        ]}
        data={filtered}
        renderCell={(c, r) => c.key === "aksi" ? (
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={()=>{ setForm(r); setModal(true); }}>Ubah</button>
            <button className="btn btn-outline" onClick={()=>setToDelete(r)}>Hapus</button>
          </div>
        ) : r[c.key]}
      />

      {modal && (
        <div className="fixed inset-0 z-40 bg-black/30 grid place-items-center p-4">
          <div className="bg-white rounded-xl p-4 w-full max-w-md space-y-3">
            <h3 className="font-semibold">{form.id ? "Ubah Kelas" : "Tambah Kelas"}</h3>
            <div>
              <label className="label">Nama Kelas</label>
              <input className="input" value={form.nama_kelas} onChange={(e)=>setForm({ ...form, nama_kelas: e.target.value })}/>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={()=>setModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={save}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Hapus Kelas"
        message={`Hapus kelas "${toDelete?.nama_kelas}"?`}
        onCancel={()=>setToDelete(null)}
        onConfirm={remove}
      />
    </div>
  );
}
