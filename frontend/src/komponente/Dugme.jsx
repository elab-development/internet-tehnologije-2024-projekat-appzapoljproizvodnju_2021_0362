import { Link } from "react-router-dom";

function Dugme({ tekst, link }) {
  return (
    <Link to={link} className="dugme">
      <strong>{tekst}</strong>
    </Link>
  );
}

export default Dugme