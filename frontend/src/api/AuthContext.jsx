import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, me as apiMe } from "./auth";
import { getActivitiesByDate } from "../api/aktivnosti";
import { getCommentsByDate } from "../api/komentari";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!token) { setLoading(false); return; }
      try {
        const u = await apiMe();
        setUser(u);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const aktivnostSutra = () => {
    const danas = new Date();
    const sutra = new Date(danas.getFullYear(), danas.getMonth(), danas.getDate() + 1);
    const popuni = (n) => String(n).padStart(2, "0");
    return `${sutra.getFullYear()}-${popuni(sutra.getMonth() + 1)}-${popuni(sutra.getDate())}`;
  };

  async function login(credentials) {
    const { user, token } = await apiLogin(credentials);
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    toast.success("Uspešna prijava!");

    const d = aktivnostSutra();
    const [acts, coms] = await Promise.all([
      getActivitiesByDate(d).catch(() => []),
      getCommentsByDate(d).catch(() => []),
    ]);
    if ((acts && acts.length > 0) || (coms && coms.length > 0)) {
      toast.info("Sutra imate aktivnost u kalendaru");
    }
  }

  async function logout() {
    try { await apiLogout(); } catch {}
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    toast.info("Uspešna odjava!");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
