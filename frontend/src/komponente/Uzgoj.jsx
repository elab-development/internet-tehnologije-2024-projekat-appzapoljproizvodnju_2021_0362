import podaci from "../podaci/kartice.json";

function Uzgoj() {
  return (
    <>
        <div className="sve-kartice">
            {podaci.map((kartica, index) => {
            
                return(
                    <div key={kartica.id} className="kartice">
                        <img src={kartica.slika} alt={`Slika ${index}`} />
                        <div className="tekst">
                            <h2>{kartica.naslov}</h2>
                            <p>{kartica.tekst}</p>
                        </div>
                    </div>
                )
            })}  
        </div>
    </>
  );
}

export default Uzgoj;