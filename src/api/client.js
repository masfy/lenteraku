const API_BASE_URL = "https://script.google.com/macros/s/AKfycbyVRmkVQ2D00OOmD5YrtbhIFubnNmoYwxtuFghMlx_33fPeqx6dIbIAbcMUrLMcIB5vCg/exec"; // Ganti dengan URL Apps Script

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = "GET", body, params } = {}) {
  const url = new URL(API_BASE_URL + path);
  if (params) Object.entries(params).forEach(([k, v]) => v !== undefined && v !== null && url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "omit",
    mode: "cors",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || data.error || "Permintaan gagal");
  }
  return data;
}

export const api = {
  // Auth
  login: (username, password) => request("/login", { method: "POST", body: { username, password } }),
  logout: () => request("/logout", { method: "POST" }),
  me: () => request("/me"),

  // Kelas
  getKelas: (role) => (role === "guru" ? request("/kelas") : request("/kelas/saya")),
  createKelas: (payload) => request("/kelas", { method: "POST", body: payload }),
  updateKelas: (id, payload) => request(`/kelas/${id}`, { method: "PUT", body: payload }),
  deleteKelas: (id) => request(`/kelas/${id}`, { method: "DELETE" }),

  // Siswa
  getSiswa: (kelas_id) => request("/siswa", { params: { kelas_id } }),
  createSiswa: (payload) => request("/siswa", { method: "POST", body: payload }),
  updateSiswa: (id, payload) => request(`/siswa/${id}`, { method: "PUT", body: payload }),
  resetSiswaPassword: (id) => request(`/siswa/${id}/reset-password`, { method: "POST" }),
  setAktifSiswa: (id, aktif) => request(`/siswa/${id}/aktif`, { method: "PATCH", body: { aktif } }),

  // Aktivitas
  getAktivitas: (params) => request("/aktivitas", { params }),
  createAktivitas: (payload) => request("/aktivitas", { method: "POST", body: payload }),
  verifyAktivitas: (id, payload) => request(`/aktivitas/${id}/verify`, { method: "PUT", body: payload }),

  // Rekap & Leaderboard
  getRekap: (params) => request("/rekap", { params }),
  getLeaderboard: (kelas_id) => request("/leaderboard", { params: { kelas_id } }),

  // Level
  getLevel: () => request("/level"),
  createLevel: (payload) => request("/level", { method: "POST", body: payload }),
  updateLevel: (id, payload) => request(`/level/${id}`, { method: "PUT", body: payload }),
  deleteLevel: (id) => request(`/level/${id}`, { method: "DELETE" }),

  // Profil & Stats
  updateProfilGuru: (payload) => request("/profil-guru", { method: "PUT", body: payload }),
  statsDashboardGuru: (kelas_id) => request("/stats-dashboard-guru", { params: { kelas_id } }),
  statsDashboardSiswa: (siswa_id) => request("/stats-dashboard-siswa", { params: { siswa_id } }),
};
