const OSNOVNI_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export async function dohvatiPrognozu({ grad = "Beograd", sirina, duzina } = {}) {
  const params = new URLSearchParams();
  if (sirina) params.set("lat", sirina);
  if (duzina) params.set("lon", duzina);
  if (!sirina && !duzina && grad) params.set("city", grad);

  const res = await fetch(`${OSNOVNI_URL}/weather?${params.toString()}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`Greška (${res.status})`);

  const json = await res.json();

  const dani = (json.daily || []).map(d => ({
    datum: d.date,
    temp_max: Math.round(d.temp_max_c ?? 0),
    temp_min: Math.round(d.temp_min_c ?? 0),
    padavine_mm: d.precip_mm ?? 0,
    vetar_kmh: d.wind_max_ms != null ? Math.round(d.wind_max_ms * 3.6) : null,
    opis: d.weather_text ?? "",
  }));

  return { lokacija: json.location, dani };
}
