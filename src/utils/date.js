// Format tampilan tanggal di Asia/Makassar (WITA)
export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

export function todayISO() {
  const now = new Date();
  // Ambil offset Asia/Makassar (UTC+8) secara manual
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const wita = new Date(utc + 8 * 3600000);
  return wita.toISOString().slice(0, 10);
}
