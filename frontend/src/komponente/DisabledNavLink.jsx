import { NavLink } from "react-router-dom";

export default function DisabledNavLink({ to, disabled, children }) {
  if (disabled) {
    return (
      <span className="nav-link disabled" aria-disabled="true" title="Uloguj se da pristupiš">
        {children}
      </span>
    );
  }
  return (
    <NavLink to={to} className={({isActive}) => "nav-link" + (isActive ? " active" : "")}>
      {children}
    </NavLink>
  );
}