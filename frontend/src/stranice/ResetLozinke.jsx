import { useState } from "react";
import { resetPassword } from "../api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetLozinke() {
  const nav = useNavigate();
  const [qs] = useSearchParams();

  const [form, setForm] = useState({
    email: qs.get("email") || "",
    token: qs.get("token") || "",
    password: "",
    password_confirmation: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      const res = await resetPassword(form);
      setMsg(res.message || "Lozinka promenjena");
      setTimeout(()=> nav("/login"), 800);
    } catch (e) {
      const r = e?.response;
      if (r?.status === 422 && r.data?.errors) {
        const first = Object.values(r.data.errors).flat()?.[0] || "Neispravni podaci";
        setErr(first);
      } else {
        setErr(r?.data?.message || "Greška pri resetu");
      }
    }
  }

  return (
    <>
    <h2 className="podnaslov">Reset lozinke</h2>
    <form onSubmit={onSubmit}>
      <label>Email</label>
      <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />

      <label>Token</label>
      <input value={form.token} onChange={e=>setForm({...form, token:e.target.value})} required />

      <label>Nova lozinka</label>
      <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required minLength={8} />

      <label>Potvrda nove lozinke</label>
      <input type="password" value={form.password_confirmation} onChange={e=>setForm({...form, password_confirmation:e.target.value})} required minLength={8} />

      <button className="dugme-forma" type="submit">Sačuvaj novu lozinku</button>
      {msg && <p style={{color:"green"}}>{msg}</p>}
      {err && <p style={{color:"crimson"}}>{err}</p>}
    </form>
    </>
  );
}
