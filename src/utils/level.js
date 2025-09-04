// Tentukan level berdasar total poin dan daftar level dari API
export function tentukanLevel(total_poin, levels) {
  if (!Array.isArray(levels)) return null;
  const lvl = levels.find(
    (l) => total_poin >= Number(l.min_poin) && total_poin <= Number(l.max_poin)
  );
  return lvl || null;
}

export function progressKeLevelBerikutnya(total_poin, levels) {
  if (!levels?.length) return { next: null, progress: 0 };
  const sorted = [...levels].sort((a, b) => a.min_poin - b.min_poin);
  let current = sorted[0];
  for (const l of sorted) {
    if (total_poin >= l.min_poin) current = l;
  }
  const idx = sorted.findIndex((l) => l.id === current.id);
  const next = sorted[idx + 1] || null;
  let progress = 100;
  if (next) {
    const span = next.min_poin - current.min_poin || 1;
    progress = Math.min(
      100,
      Math.max(0, ((total_poin - current.min_poin) / span) * 100)
    );
  }
  return { next, current, progress: Math.round(progress) };
}
