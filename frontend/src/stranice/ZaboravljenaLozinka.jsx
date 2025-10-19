import { useState } from "react";
import { forgotPassword } from "../api/auth";

export default function ZaboravljenaLozinka() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(""); setErr(""); setToken("");
    try {
      const res = await forgotPassword(email);
      setMsg(res.message || "Ako email postoji, poslat je token.");
      if (res.token) setToken(res.token);
    } catch (e) {
      setErr(e?.response?.data?.message || "Greška");
    }
  }

  return (
    <>
        <h2 className="podnaslov">Izaberite novu lozinku</h2>
        <form onSubmit={onSubmit}>
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button type="submit">Pošalji zahtev</button>
            {msg && <p style={{color:"green"}}>{msg}</p>}
            {token && (
                <p>
                Token (za demo): <code>{token}</code>
                </p>
            )}
            {err && <p style={{color:"crimson"}}>{err}</p>}
        </form>
    </>
  );
}
