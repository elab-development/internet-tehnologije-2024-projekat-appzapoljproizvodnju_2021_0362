import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";
import DisabledNavLink from "./DisabledNavLink";

export default function Header() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const isGuest = !user;

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
          <li><DisabledNavLink to="/kalendar" disabled={isGuest}>Kalendar</DisabledNavLink></li>
          <li><DisabledNavLink to="/prognoza" disabled={isGuest}>Prognoza</DisabledNavLink></li>
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
