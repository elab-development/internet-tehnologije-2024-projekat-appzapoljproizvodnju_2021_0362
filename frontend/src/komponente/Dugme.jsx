import { Link } from "react-router-dom";

function Dugme({ tekst, link }) {
  return (
    <Link to={link} className="dugme">
      {tekst}
    </Link>
  );
}

export default Dugme