import podaci from "../podaci/kartice.json";
import Kartica from "../komponente/Kartica";

function Uzgoj() {
  return (
    <>
        <div className="sve-kartice">
        {podaci.map((kartica, index) => (
            <Kartica key={kartica.id} index={index} slika={kartica.slika} naslov={kartica.naslov} tekst={kartica.tekst} />
        ))}
        </div>
    </>
  );
}

export default Uzgoj;