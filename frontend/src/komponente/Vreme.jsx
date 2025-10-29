import { useEffect, useState } from "react";
import { dohvatiPrognozu } from "../api/vreme";

function Vreme() {
  const [stanje, postaviStanje] = useState({
    ucitavanje: true,
    greska: null,
    podaci: null,
  });

  useEffect(() => {
    let otkazano = false;

    (async () => {
      try {
        let parametri = { grad: "Beograd" };
        try {
          const poz = await new Promise((resolve, reject) => {
            if (!navigator.geolocation) return reject(new Error("nema geolokacije"));
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
          });
          parametri = { sirina: poz.coords.latitude, duzina: poz.coords.longitude };
        } catch {}

        const podaci = await dohvatiPrognozu(parametri);
        if (!otkazano) postaviStanje({ ucitavanje: false, greska: null, podaci });
      } catch (e) {
        if (!otkazano) postaviStanje({ ucitavanje: false, greska: e.message, podaci: null });
      }
    })();

    return () => { otkazano = true; };
  }, []);

  if (stanje.ucitavanje) return <div className="vreme_status">Učitavanje prognoze…</div>;
  if (stanje.greska)   return <div className="vreme_status vreme_status--error">Greška: {stanje.greska}</div>;

  const { dani } = stanje.podaci;

  return (
    <section className="vreme">
      <h2 className="podnaslov">Vremenska prognoza</h2>
      <div className="vreme_grid">
        {dani.map((d) => (
          <div key={d.datum} className="vreme_kartica">
            <div><strong>
              {new Intl.DateTimeFormat("sr-Latn-RS", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                timeZone: "Europe/Belgrade",
              }).format(new Date(d.datum))}
            </strong></div>

            <div className="vreme_C">
              <span>{d.temp_max}°C</span>
              <span>{d.temp_min}°C</span>
            </div>

            <div className="vreme_opis">{d.opis || "—"}</div>

            <div className="vreme_stanje">
              <span>🌧 {d.padavine_mm}mm</span>
              <span>💨 {d.vetar_kmh ?? "—"}km/h</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Vreme;
