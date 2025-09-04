// Aturan poin dasar: poin = durasi_menit (+ bonus opsional)
export function hitungPoin({ durasi_menit, ringkasan }) {
  let poin = Number(durasi_menit || 0);
  const words = (ringkasan || "").trim().split(/\s+/).filter(Boolean).length;
  if (words >= 50) poin += 10; // contoh bonus
  return poin;
}
