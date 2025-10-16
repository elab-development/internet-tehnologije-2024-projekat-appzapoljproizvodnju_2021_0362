import podaci from "../podaci/vrste.json";
import Kartica from "../komponente/Kartica";
import Dugme from "../komponente/Dugme";
import Naslov from "../komponente/Naslov";
import Tekst from "../komponente/Tekst";

function Vrste() {
  return (
    <>
      <Naslov tekst="Vrste paradajza" />
      <Tekst tekst="Na ovoj stranici možete istražiti različite vrste paradajza koje se najčešće gaje u našim uslovima. 
                    Svaka sorta ima svoje osobine – od oblika i boje ploda do ukusa i otpornosti na spoljašnje uslove. 
                    Ovde ćete pronaći i savete kada i kako svaku vrstu saditi, kako je negovati i za šta je najpogodnija – od sveže upotrebe do prerade. 
                    Odaberite sortu koja najbolje odgovara vašim potrebama i započnite uspešan uzgoj. 🍅" />
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