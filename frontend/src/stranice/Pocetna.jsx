import Dugme from "../komponente/Dugme";
import Uzgoj from "../komponente/Uzgoj";
import Naslov from "../komponente/Naslov";

function Pocetna() {
  return (
    <>
    <Naslov tekst="Dobrodošli" />
    <Uzgoj />
    <Dugme tekst="Vrste" link="/vrste" />
    </>
  );
}

export default Pocetna;