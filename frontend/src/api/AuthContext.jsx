import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, me as apiMe } from "./auth";
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

  async function login(credentials) {
    const { user, token } = await apiLogin(credentials);
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    toast.success("Uspešna prijava!");
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
