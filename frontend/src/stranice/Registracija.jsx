import { useState } from "react";
import { register as apiRegister } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

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
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Registracija</h2>
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
      </form>
      <p style={{marginTop:12}}>Već imaš nalog? <Link to="/login">Prijavi se</Link></p>
    </div>
  );
}
