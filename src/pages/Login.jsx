import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    await login(username, password);
  }
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-primary/10 to-transparent">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Masuk ke Lentera</h1>
        <div>
          <label className="label">Username</label>
          <input className="input" value={username} onChange={(e)=>setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Memproses..." : "Masuk"}</button>
        <p className="text-xs text-onSurface/60">Lupa password? Hubungi guru (fitur dummy).</p>
      </form>
    </div>
  );
}
