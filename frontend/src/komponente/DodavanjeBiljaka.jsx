import { useEffect, useState } from "react";
import http from "../api/http";

export default function DodavanjeBiljaka() {
    
    const [plants, setPlants] = useState([]);
    const [prikazForme, setPrikazForme] = useState(false);
    const [promenaBiljke, setPromenaBiljke] = useState(null);
    const [trenutnaStrana, setTrenutnaStrana] = useState(1);
    const [ukupnoStrana, setUkupnoStrana] = useState(1);
   
    const [formaPromene, setformaPromene] = useState({
        variety: "",
        location: "",
        planted_on: "",
        is_active: "true",
        health_status: "",
        watering_count: 0,
        last_watered_at: "",
        fertilizing_count: 1,
        last_fertilized_at: "",
    });
    
    const [podaciForme, setPodaciForme] = useState({
        variety: "",
        location: "",
        planted_on: "",
    });

    const handleChange = (e) => {
        setPodaciForme({
            ...podaciForme,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await http.post("/plants", podaciForme);
            console.log(response.data);
            setPlants((prev) => [response.data, ...prev]);
        } catch (error) {
            console.log(error.response?.data);
            console.log(error.response?.data?.errors);
            console.error(error);
        }
    };

    const prikaziVrednost = (vrednost) => {
        if (vrednost === null || vrednost === undefined || vrednost === "") {
            return "-";
        }
        return vrednost;
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
        });
    }, [trenutnaStrana]);

    useEffect(() => {
        const ucitajBiljke = async () => {
            try {
                const response = await http.get(`/plants?page=${trenutnaStrana}`);
                setPlants(response.data.data);
                setUkupnoStrana(response.data.last_page);
            } catch (error) {
                console.error(error);
            }
        };

        ucitajBiljke();
    }, [trenutnaStrana]);


    const DatumFormatiranje = (datum) => {
        if (!datum) return "-";

        return new Date(datum).toLocaleDateString("sr-RS");
    };

    const handleEditChange = (e) => {
        setformaPromene({
            ...formaPromene,
            [e.target.name]: e.target.value,
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const podaciZaSlanje = {
            ...formaPromene,
            is_active: formaPromene.is_active === "true",
            health_status: formaPromene.health_status,
            };

            const response = await http.patch(`/plants/${promenaBiljke}`, podaciZaSlanje);

            setPlants((prev) =>
            prev.map((plant) =>
                plant.id === promenaBiljke ? response.data : plant
            )
            );

            setPromenaBiljke(null);
        } catch (error) {
            console.log(error.response?.data);
            console.log(error.response?.data?.errors);
            console.error(error);
        }
    };

    const handleDownloadPdf = async (id) => {
        try {
            const response = await http.get(`/plants/${id}/pdf`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", `biljka_${id}.pdf`);

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error.response?.data);
            console.error(error);
            console.log(error.response);
        }
    };

    return(
        <>
            <button className="dugme-dodaj-biljku" onClick={() => setPrikazForme(!prikazForme)}>Dodaj biljku</button>
            {prikazForme && (
                <form onSubmit={handleSubmit}>
                    <label>Vrsta:</label>
                    <input type="text" name="variety" onChange={handleChange} value={podaciForme.variety}/>
                    <label>Lokacija:</label>
                    <input type="text" name="location" onChange={handleChange} value={podaciForme.location}/>
                    <label>Datum sadnje:</label>
                    <input type="date" name="planted_on" onChange={handleChange} value={podaciForme.planted_on}/>

                    <button className="dugme-dodaj-biljku" type="submit">Sačuvaj biljku</button>
                </form>)}

            <div className="paginacija-biljaka">
                <button
                    onClick={() => setTrenutnaStrana((prev) => prev - 1)}
                    disabled={trenutnaStrana === 1}
                >
                    {"<-"}
                </button>

                <p>
                    Strana {trenutnaStrana} od {ukupnoStrana}
                </p>

                <button
                    onClick={() => setTrenutnaStrana((prev) => prev + 1)}
                    disabled={trenutnaStrana === ukupnoStrana}
                >
                    {"->"}
                </button>
            </div>

            <div className="lista-biljaka">
                {plants.map((plant) => (
                    <div key={plant.id} className="profil-glava">
                        <div className="informacije">
                            <div className="levo">
                                <p>Vrsta:</p>
                                <p>Lokacija:</p>
                                <p>Datum sadnje:</p>
                                <p>Aktivnost:</p>
                                <p>Zdravstveno stanje:</p>
                                <p>Broj zalivanja:</p>
                                <p>Poslednje zalivanje:</p>
                                <p>Naredno zalivanje:</p>
                                <p>Broj đubrenja:</p>
                                <p>Poslednje đubrenje:</p>
                                <p>Naredno đubrenje:</p>
                            </div>
                            <div className="desno">
                                <p>{plant.variety}</p>
                                <p>{prikaziVrednost(plant.location)}</p>
                                <p>{DatumFormatiranje(plant.planted_on)}</p>
                                <p>{plant.is_active ? "Aktivna" : "Neaktivna"}</p>
                                <p>{plant.health_status || "-"}</p>
                                <p>{plant.watering_count}</p>
                                <p>{DatumFormatiranje(plant.last_watered_at)}</p>
                                <p>{DatumFormatiranje(plant.next_watering_at)}</p>
                                <p>{plant.fertilizing_count}</p>
                                <p>{DatumFormatiranje(plant.last_fertilized_at)}</p>
                                <p>{DatumFormatiranje(plant.next_fertilizing_at)}</p>
                            </div>
                        </div>

                        <div className="izmeni-preuzmi">
                            <button
                            className="dugme-dodaj-biljku"
                            onClick={() => {
                            setPromenaBiljke(plant.id);
                            setformaPromene({
                            variety: plant.variety || "",
                            location: plant.location || "",
                            planted_on: plant.planted_on ? plant.planted_on.slice(0, 10) : "",
                            is_active: String(plant.is_active),
                            health_status: (plant.health_status || ""),
                            watering_count: plant.watering_count || 0,
                            last_watered_at: plant.last_watered_at ? plant.last_watered_at.slice(0, 10) : "",
                            fertilizing_count: plant.fertilizing_count || 0,
                            last_fertilized_at: plant.last_fertilized_at ? plant.last_fertilized_at.slice(0, 10) : "",
                            });
                            }}>
                                Izmeni
                            </button>
                            <button type="button" className="dugme-dodaj-biljku" onClick={() => handleDownloadPdf(plant.id)}>
                                Preuzmi PDF
                            </button>
                        </div>

                        {promenaBiljke === plant.id && (
                            <form className="forma-promena" onSubmit={handleEditSubmit}>
                                <label>Vrsta:</label>
                                <input
                                type="text"
                                name="variety"
                                value={formaPromene.variety}
                                onChange={handleEditChange}
                                />

                                <label>Lokacija:</label>
                                <input
                                type="text"
                                name="location"
                                value={formaPromene.location}
                                onChange={handleEditChange}
                                />

                                <label>Datum sadnje:</label>
                                <input
                                type="date"
                                name="planted_on"
                                value={formaPromene.planted_on}
                                onChange={handleEditChange}
                                />

                                <label>Aktivnost:</label>
                                <select
                                name="is_active"
                                value={formaPromene.is_active}
                                onChange={handleEditChange}
                                >
                                <option value="true">Aktivna</option>
                                <option value="false">Neaktivna</option>
                                </select>

                                <label>Zdravstveno stanje:</label>
                                <select
                                name="health_status"
                                value={formaPromene.health_status}
                                onChange={handleEditChange}
                                >
                                <option value="dobro stanje">Dobro stanje</option>
                                <option value="kriticno stanje">Kritično stanje</option>
                                <option value="biljka je uvenula">Biljka je uvenula</option>
                                </select>

                                <label>Broj zalivanja:</label>
                                <input
                                type="number"
                                name="watering_count"
                                value={formaPromene.watering_count}
                                onChange={handleEditChange}
                                />

                                <label>Poslednje zalivanje:</label>
                                <input
                                type="date"
                                name="last_watered_at"
                                value={formaPromene.last_watered_at}
                                onChange={handleEditChange}
                                />

                                <label>Broj đubrenja:</label>
                                <input
                                type="number"
                                name="fertilizing_count"
                                value={formaPromene.fertilizing_count}
                                onChange={handleEditChange}
                                />

                                <label>Poslednje đubrenje:</label>
                                <input
                                type="date"
                                name="last_fertilized_at"
                                value={formaPromene.last_fertilized_at}
                                onChange={handleEditChange}
                                />

                                <button className="dugme-dodaj-biljku" type="submit">Sačuvaj izmene</button>
                                <button className="dugme-dodaj-biljku" type="button" onClick={() => setPromenaBiljke(null)}>
                                Otkaži
                                </button>
                            </form>
                        )}

                    </div>
                ))}
            </div>
            <div className="paginacija-biljaka">
                <button
                type="button"
                onClick={() => setTrenutnaStrana((prev) => prev - 1)}
                disabled={trenutnaStrana === 1}
                >
                    {"<-"}
                </button>

                <p>
                    Strana {trenutnaStrana} od {ukupnoStrana}
                </p>

                <button
                type="button"
                onClick={() => setTrenutnaStrana((prev) => prev + 1)}
                disabled={trenutnaStrana === ukupnoStrana}
                >
                    {"->"}
                </button>
            </div>
        </>
    );
}



