import { useState } from "react";
import { register as apiRegister } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

import Dugme from "../komponente/Dugme";

export default function Registracija() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const { user, token } = await apiRegister(form);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.message || "Greška pri registraciji");
    }
  }

  return (
    <div>
      <h2 className="podnaslov">Registracija</h2>
      <form onSubmit={onSubmit}>
        <label>Ime</label>
        <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} required />
        <label>Korisničko ime</label>
        <input value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
        <label>Lozinka</label>
        <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required />
        {err && <p style={{color:"crimson"}}>{err}</p>}
        <button type="submit">Registruj se</button>
        <label>Već imate nalog? Ulogujte se</label>
        <Dugme tekst="Uloguj se" link="/login" />
      </form>
    </div>
  );
}
