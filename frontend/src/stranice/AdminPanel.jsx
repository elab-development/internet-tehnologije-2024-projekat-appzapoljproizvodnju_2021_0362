import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../api/AuthContext";

import Naslov from "../komponente/Naslov";

const API_BASE = "http://127.0.0.1:8000";

export default function AdminPanel() {
  const { token, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    axios
      .get(`${API_BASE}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const p = res.data;
        setUsers(Array.isArray(p) ? p : (p?.data || p?.users || []));
      })
      .finally(() => setLoading(false));
  }, [authLoading, token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Obrisati korisnika?")) return;

    await axios.delete(`${API_BASE}/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  if (authLoading || loading) return <div style={{ padding: 24 }}>Učitavanje...</div>;

  return (
    <div className="adminPanel">
      <Naslov tekst="Admin panel - korisnici" />
      <div className="userList">
        {users.map((u) => (
          <div key={u.id} className="userRow">
            <div className="userInfo">
              <b>{u.username ?? u.name}</b> — {u.email} — <i>{u.role}</i>
            </div>
            <button className="deleteBtn" onClick={() => handleDelete(u.id)}>
              Obriši
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}