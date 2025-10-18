import { useState } from "react";
import { useAuth } from "../api/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import Dugme from "../komponente/Dugme";
import Naslov from "../komponente/Naslov";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(form);
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Greška pri logovanju");
    }
  }

  return (
    <div>
      <h2 className="podnaslov">Prijava</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e)=>setForm({...form, email:e.target.value})}
          required
        />
        <label>Lozinka</label>
        <input
          type="password"
          value={form.password}
          onChange={(e)=>setForm({...form, password:e.target.value})}
          required
        />
        {err && <p style={{color:"crimson"}}>{err}</p>}
        <Dugme tekst="Uloguj se" tip="submit" />
        <label>Nemate nalog? Registrujte se</label>
        <Dugme tekst="Registruj se" link="/registracija" />
      </form>
    </div>
  );
}
