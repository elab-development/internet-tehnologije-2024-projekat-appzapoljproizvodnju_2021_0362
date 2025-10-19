import { useState } from "react";
import { changePassword } from "../api/auth";

export default function PromenaLozinke() {
  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMsg(""); setErr("");

    try {
      const res = await changePassword(form);
      setMsg(res.message || "Lozinka promenjena");
      setForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (e) {
      const r = e?.response;
      if (r?.status === 422 && r.data?.errors) {
        const first = Object.values(r.data.errors).flat()?.[0] || "Neispravni podaci";
        setErr(first);
      } else if (r?.data?.message) {
        setErr(r.data.message);
      } else {
        setErr("Greška pri promeni lozinke");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
        <h2 className="podnaslov">Promena lozinke</h2>
        <form onSubmit={onSubmit}>
            <label>Stara lozinka</label>
            <input
                type="password"
                value={form.current_password}
                onChange={(e)=>setForm({...form, current_password:e.target.value})}
                required
                autoComplete="current-password"
            />

            <label>Nova lozinka</label>
            <input
                type="password"
                value={form.password}
                onChange={(e)=>setForm({...form, password:e.target.value})}
                required
                autoComplete="new-password"
                minLength={8}
            />

            <label>Potvrda nove lozinke</label>
            <input
                type="password"
                value={form.password_confirmation}
                onChange={(e)=>setForm({...form, password_confirmation:e.target.value})}
                required
                autoComplete="new-password"
                minLength={8}
            />

            {err && <p style={{ color: "crimson" }}>{err}</p>}
            {msg && <p style={{ color: "green" }}>{msg}</p>}
            <button type="submit" disabled={loading}>
                {loading ? "Čuvam..." : "Promeni lozinku"}
            </button>
        </form>
  </>
 );
}
