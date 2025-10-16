import podaci from "../podaci/vrste.json";
import Kartica from "../komponente/Kartica";
import Dugme from "../komponente/Dugme";

function Vrste() {
  return (
    <>
      <div className="sve-kartice">
        {podaci.map((kartica, index) => (
          <Kartica key={kartica.id} index={index} slika={kartica.slika} naslov={kartica.naslov} tekst={kartica.tekst} />
        ))}
      </div>
      <Dugme tekst="Početna" link="/" />
    </>
  );
}

export default Vrste;