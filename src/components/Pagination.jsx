import React from "react";

export default function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="flex items-center gap-2 justify-end mt-3">
      <button disabled={page <= 1} className="btn btn-outline disabled:opacity-40" onClick={() => onChange(page - 1)}>Sebelum</button>
      <span className="text-sm">Hal {page} dari {pages}</span>
      <button disabled={page >= pages} className="btn btn-outline disabled:opacity-40" onClick={() => onChange(page + 1)}>Berikut</button>
    </div>
  );
}
