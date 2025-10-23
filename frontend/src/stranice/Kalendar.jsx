import Naslov from "../komponente/Naslov";
import Tekst from "../komponente/Tekst";
import { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Kalendar() {
  const [klik, setKlik] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [comment, setComment] = useState("");

  function handleDateClick(info) {
    const parts = info.dateStr.split("-");
    const prikaz = `${parts[2]}.${parts[1]}.${parts[0]}`;
    setKlik({ dateStr: info.dateStr, prikaz });
    console.log("Klik na datum:", info.dateStr);
  }

  function closeModal() {
    setKlik(null);
    setSelectedActivity("");
    setComment("");
  }

  function handleSaveLocal() {
    if (!selectedActivity) return;
    console.log("Dodajem aktivnost:", {
      date: klik.dateStr,
      type: selectedActivity,
      comment,
    });
    closeModal();
  }

  
  return (
    <>
      <Naslov tekst="kalendar" />
      <Tekst tekst="Kalendar vam omogućava da lako organizujete sve faze uzgoja paradajza – od sejanja i presađivanja do berbe. 
                    Ovde možete dodavati sopstvene zadatke, unositi sezonske aktivnosti i pregledati planirane obaveze po datumima. 
                    Kalendar vas podseća na važne korake i pomaže da ni jedna faza ne bude propuštena, bilo da se radi o zalivanju, prihrani ili zaštiti biljaka. 
                    Na taj način imate potpun pregled celog procesa uzgoja i uvek znate šta treba uraditi sledeće. 🌱" />
      <div className="kalendar">
        <FullCalendar className="datumi"
          plugins={[dayGridPlugin, interactionPlugin]}
          fixedWeekCount={false}
          dateClick={handleDateClick}
        />
        {klik && (
          <div className="pozadina-prozora" onClick={closeModal}>
            <div className="prozor" onClick={(e) => e.stopPropagation()}>
              <h3 className="podnaslov">{klik.prikaz}</h3>

              <select value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)}>
                <option value="">Izaberi aktivnost</option>
                <option>Sejanje</option>
                <option>Zalivanje</option>
                <option>Presađivanje</option>
                <option>Prihrana</option>
                <option>Zaštita</option>
                <option>Berba</option>
              </select>

              <textarea value={comment} onChange={(e) => setComment(e.target.value)} spellCheck="false" rows={10} placeholder="Komentar…"/>

              <div className="potvrda">
                <button onClick={closeModal}>Otkaži</button>
                <button onClick={handleSaveLocal} disabled={!selectedActivity} style={{ opacity: selectedActivity ? 1 : 0.6 }}>
                  Sačuvaj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}