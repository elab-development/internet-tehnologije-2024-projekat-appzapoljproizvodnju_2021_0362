import Vreme from "../komponente/Vreme";
import Naslov from "../komponente/Naslov";

function Prognoza() {
  return (
    <>
      <Naslov tekst="Prognoza" />
      <Vreme />
    </>
  );
}

export default Prognoza;