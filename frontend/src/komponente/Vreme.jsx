import { useEffect, useState } from "react";
import { dohvatiPrognozu } from "../api/vreme";

function Vreme() {
  const [stanje, postaviStanje] = useState({ ucitavanje: true, greska: null, podaci: null });

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

  if (stanje.ucitavanje) return <div style={{ padding: 16 }}>Učitavanje prognoze…</div>;
  if (stanje.greska)   return <div style={{ padding: 16, color: "#e66" }}>Greška: {stanje.greska}</div>;

  const { lokacija, dani } = stanje.podaci;

  return (
    <section style={{ padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h2>Vremenska prognoza (14 dana)</h2>
        <small>
          Lokacija: {lokacija?.name || "—"}
          {lokacija?.lat && lokacija?.lon ? ` (${lokacija.lat.toFixed(2)}, ${lokacija.lon.toFixed(2)})` : ""}
        </small>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
        {dani.map(d => (
          <div key={d.datum} style={{
            border: "1px solid #2a2a2a33",
            borderRadius: 12,
            padding: 12,
            display: "grid",
            justifyItems: "center",
            gap: 6
          }}>
            <div style={{ fontWeight: 600 }}>
              {new Intl.DateTimeFormat("sr-RS", {
                weekday: "short", day: "2-digit", month: "2-digit", timeZone: "Europe/Belgrade"
              }).format(new Date(d.datum))}
            </div>

            <div style={{ display: "flex", gap: 8, fontWeight: 700 }}>
              <span>{d.temp_max}°C</span>
              <span style={{ opacity: 0.7 }}>{d.temp_min}°C</span>
            </div>

            <div style={{ fontSize: ".9rem", minHeight: "2.2em", textAlign: "center" }}>
              {d.opis || "—"}
            </div>

            <div style={{ display: "flex", gap: 10, fontSize: ".9rem", opacity: .85 }}>
              <span>🌧 {d.padavine_mm} mm</span>
              <span>💨 {d.vetar_kmh ?? "—"} km/h</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Vreme;
