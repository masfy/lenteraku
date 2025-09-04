import React from "react";

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-card max-w-xl w-full">
        <div className="border-b px  -4 px-4 py-3 font-semibold">{title}</div>
        <div className="p-4">{children}</div>
        <div className="border-t px-4 py-3 flex justify-end gap-2">{footer}</div>
      </div>
      <button className="absolute inset-0" aria-label="Tutup" onClick={onClose} />
    </div>
  );
}
