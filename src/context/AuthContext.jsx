import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import { showToast } from "../components/Toast.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function login(username, password) {
    setLoading(true);
    try {
      const res = await api.login(username, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      showToast("Berhasil masuk.");
      if (res.user.role === "guru") navigate("/guru");
      else navigate("/siswa");
    } catch (e) {
      showToast(e.message || "Login gagal", "danger");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await api.logout();
    } catch (_e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  async function refreshMe() {
    if (!localStorage.getItem("token")) return;
    try {
      const me = await api.me();
      localStorage.setItem("user", JSON.stringify(me.user));
      setUser(me.user);
    } catch (_e) {
      await logout();
    }
  }

  useEffect(() => {
    refreshMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
