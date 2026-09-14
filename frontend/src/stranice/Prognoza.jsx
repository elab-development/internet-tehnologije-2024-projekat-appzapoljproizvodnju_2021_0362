import Vreme from "../komponente/Vreme";
import Naslov from "../komponente/Naslov";
import Tekst from "../komponente/Tekst";

function Prognoza() {
  return (
    <>
      <Naslov tekst="Prognoza" />
      <Tekst tekst="Na ovoj stranici možete pratiti vremensku prognozu za vaše područje i planirati aktivnosti u skladu sa uslovima na terenu. 
                    Prognoza prikazuje temperaturu, padavine, vetar i druge faktore koji direktno utiču na rast i razvoj paradajza. 
                    Praćenjem vremenskih promena možete pravovremeno reagovati – zaštititi biljke od mraza, izbeći prekomerno zalivanje ili iskoristiti idealne dane za rad u plasteniku i na otvorenom. 
                    Precizne informacije vam pomažu da uzgoj bude uspešan i bez neželjenih iznenađenja. 🌦️" />
      <Vreme />
    </>
  );
}

export default Prognoza;