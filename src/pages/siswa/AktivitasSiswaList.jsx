import React, { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import Table from "../../components/Table.jsx";
import { formatDate } from "../../utils/date.js";

export default function AktivitasSiswaList() {
  const [tab, setTab] = useState("Disetujui");
  const [data, setData] = useState([]);

  async function load() {
    const res = await api.getAktivitas({ status: tab });
    setData(res.data || []);
  }

  useEffect(() => { load(); }, [tab]);

  return (
    <div className="space-y-4">
      <h2 className
