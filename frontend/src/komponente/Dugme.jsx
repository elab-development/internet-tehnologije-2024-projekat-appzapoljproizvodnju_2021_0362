import { Link } from "react-router-dom";

export default function Dugme({ tekst, link }) {
  return (
    <Link to={link} className="dugme">
      {tekst}
    </Link>
  );
}