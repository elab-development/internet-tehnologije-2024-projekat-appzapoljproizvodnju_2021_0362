import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import DisabledNavLink from "./DisabledNavLink";

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const isGuest = !user;
  const isPremium = user?.role === "premium" || user?.role === "admin";

  async function handleLogout() {
    await logout();
    nav("/login");
  }

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/" className="nav-link">Početna</Link></li>
          <li><Link to="/vrste" className="nav-link">Vrste</Link></li>
          <li><DisabledNavLink to="/kalendar" disabled={!isPremium}>Kalendar</DisabledNavLink></li>
          <li><DisabledNavLink to="/prognoza" disabled={!isPremium}>Prognoza</DisabledNavLink></li>
          <li><DisabledNavLink to="/nalog" disabled={isGuest}>Nalog</DisabledNavLink></li>
          <li><Link to="/login" className="nav-link">Login</Link></li>
          <div>
            {user && (
              <>
                <Link type="button" onClick={handleLogout}>Odjava</Link>
              </>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
}
