import React from "react";
import Modal from "./Modal.jsx";

export default function ConfirmDialog({ open, title = "Konfirmasi", message, onCancel, onConfirm }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-outline" onClick={onCancel}>Batal</button>
          <button className="btn btn-primary" onClick={onConfirm}>Ya, Lanjut</button>
        </>
      }
    >
      <p className="text-sm">{message}</p>
    </Modal>
  );
}
