import Naslov from "../komponente/Naslov";
import Tekst from "../komponente/Tekst";
import KomponentaKalendar from "../komponente/KomponentaKalendar";
import Dugme from "../komponente/Dugme";

export default function Kalendar() {
  return (
    <>
      <Naslov tekst="Kalendar" />
      <Tekst tekst="Kalendar vam omogućava da lako organizujete sve faze uzgoja paradajza – od sejanja i presađivanja do berbe. 
                    Ovde možete dodavati sopstvene zadatke, unositi sezonske aktivnosti i pregledati planirane obaveze po datumima. 
                    Kalendar vas podseća na važne korake i pomaže da ni jedna faza ne bude propuštena, bilo da se radi o zalivanju, prihrani ili zaštiti biljaka. 
                    Na taj način imate potpun pregled celog procesa uzgoja i uvek znate šta treba uraditi sledeće. 🌱" />
      <KomponentaKalendar />
      <div className="grupa-dugmica">
        <Dugme tekst="Nalog" link="/nalog" />
        <Dugme tekst="Prognoza" link="/prognoza" />
      </div>
    </>
  );
}
