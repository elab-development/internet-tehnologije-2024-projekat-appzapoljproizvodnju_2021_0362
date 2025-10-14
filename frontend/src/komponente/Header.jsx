import { Link } from "react-router-dom";

function Header() {

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">-Početna-</Link></li>
          <li><Link to="/vrste">-Vrste-</Link></li>
          <li><Link to="/nalog">-Nalog-</Link></li>
          <li><Link to="/prognoza">-Prognoza-</Link></li>
          <li><Link to="/kalendar">-Kalendar-</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;