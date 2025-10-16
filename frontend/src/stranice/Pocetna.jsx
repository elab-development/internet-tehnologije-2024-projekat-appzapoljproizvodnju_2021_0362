import Dugme from "../komponente/Dugme";
import Uzgoj from "../komponente/Uzgoj";

function Pocetna() {
  return (
    <>
    <Uzgoj />
    <Dugme tekst="Vrste" link="/vrste" />
    </>
  );
}

export default Pocetna;