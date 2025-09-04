import React, { useState } from "react";
import { api } from "../../api/client.js";
import { todayISO } from "../../utils/date.js";
import { showToast } from "../../components/Toast.jsx";

export default function AktivitasSiswaForm() {
  const [form, setForm] = useState({
    judul_bacaan: "",
    jenis_bacaan: "buku",
    penulis_sumber: "",
    tanggal_baca: todayISO(),
    durasi_menit: 0,
    ringkasan: "",
    refleksi: "",
    bukti_url: ""
  });

  function valid() {
    if (!form.judul_bacaan.trim()) return false;
    if (!form.penulis_sumber.trim()) return false;
    if (!form.tanggal_baca) return false;
    if (new Date(form.tanggal_baca) > new Date(todayISO())) return false;
    if (!Number.isInteger(Number(form.durasi_menit)) || Number(form.durasi_menit) <= 0) return false;
    const sentencesRingkasan = (form.ringkasan.match(/\./g) || []).length;
    const sentencesRefleksi = (form.refleksi.match(/\./g) || []).length;
    if (sentencesRingkasan < 2) return false;
    if (sentencesRefleksi < 1) return false;
    return true;
  }

  async function submit(e) {
    e.preventDefault();
    if (!valid()) return showToast("Periksa kembali isian form", "danger");
    await api.createAktivitas(form);
    showToast("Aktivitas diajukan (Menunggu verifikasi)");
    setForm({ ...form, judul_bacaan: "", penulis_sumber: "", durasi_menit: 0, ringkasan: "", refleksi: "", bukti_url: "" });
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Tambah Aktivitas Membaca</h2>
      <form className="card space-y-3" onSubmit={submit}>
        <div><label className="label">Judul Bacaan</label><input className="input" value={form.judul_bacaan} onChange={(e)=>setForm({...form, judul_bacaan: e.target.value})} required/></div>
        <div><label className="label">Jenis/Format</label>
          <select className="input" value={form.jenis_bacaan} onChange={(e)=>setForm({...form, jenis_bacaan: e.target.value})}>
            <option value="buku">Buku</option><option value="artikel">Artikel</option><option value="komik">Komik</option><option value="pdf">PDF</option><option value="tautan">Tautan</option>
          </select>
        </div>
        <div><label className="label">Penulis/Sumber</label><input className="input" value={form.penulis_sumber} onChange={(e)=>setForm({...form, penulis_sumber: e.target.value})} required/></div>
        <div><label className="label">Tanggal Baca</label><input className="input" type="date" value={form.tanggal_baca} onChange={(e)=>setForm({...form, tanggal_baca: e.target.value})} required/></div>
        <div><label className="label">Durasi (menit)</label><input className="input" type="number" value={form.durasi_menit} onChange={(e)=>setForm({...form, durasi_menit: Number(e.target.value)})} required/></div>
        <div><label className="label">Ringkasan (min 2 kalimat)</label><textarea className="input h-28" value={form.ringkasan} onChange={(e)=>setForm({...form, ringkasan: e.target.value})} placeholder="Tulis 2–3 kalimat..." required/></div>
        <div><label className="label">Refleksi (min 1 kalimat)</label><textarea className="input h-24" value={form.refleksi} onChange={(e)=>setForm({...form, refleksi: e.target.value})} placeholder="Apa yang kamu pelajari?" required/></div>
        <div><label className="label">Bukti/Link (opsional)</label><input className="input" value={form.bukti_url} onChange={(e)=>setForm({...form, bukti_url: e.target.value})} /></div>
        <div className="flex justify-end"><button className="btn btn-primary" type="submit">Kirim</button></div>
      </form>
    </div>
  );
}
