import React, { useEffect, useState } from "react";
let setFn;
export function showToast(msg, variant = "primary") {
  setFn?.({ msg, variant, open: true });
  setTimeout(() => setFn?.((s) => ({ ...s, open: false })), 2400);
}
export default function Toast() {
  const [state, setState] = useState({ msg: "", variant: "primary", open: false });
  useEffect(() => { setFn = setState; }, []);
  return state.open ? (
    <div className="snackbar" role="status" aria-live="polite">
      <span className={state.variant === "danger" ? "text-red-200" : "text-white"}>{state.msg}</span>
    </div>
  ) : null;
}
