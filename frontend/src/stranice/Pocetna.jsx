import Dugme from "../komponente/Dugme";
import Uzgoj from "../komponente/Uzgoj";
import Naslov from "../komponente/Naslov";
import Tekst from "../komponente/Tekst";

function Pocetna() {
  return (
    <>
    <Naslov tekst="Dobrodošli" />
    <Tekst tekst="ToMateO je vaša digitalna pomoć u uzgoju paradajza – od prvog semena do bogate berbe. 
                  Na sajtu možete pronaći detaljno uputstvo za svaku fazu gajenja: sejanje, presađivanje, zalivanje, prihranu i zaštitu od bolesti. 
                  Na osnovu vremenskih uslova i faze razvoja biljke, aplikacija vam nudi korisne savete i podsetnike. 
                  Korisnici mogu zakazivati svoje aktivnosti u kalendaru, beležiti komentare i voditi dnevnik uzgoja kako bi pratili napredak kroz sezonu. 
                  Za one koji žele više, dostupan je i premium pristup sa dodatnim funkcionalnostima. 
                  Bilo da ste početnik ili iskusni proizvođač, ToMateO će vam pomoći da vaše biljke budu zdrave, a rod obilan i kvalitetan. 🍅" />
    <Uzgoj />
    <Dugme tekst="Vrste" link="/vrste" />
    </>
  );
}

export default Pocetna;