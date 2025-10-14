import podaci from "../podaci/kartice.json";

function Uzgoj() {
  return (
    <>
        <div>
            {podaci.map((kartica, index) => {
            
                return(
                    <div key={kartica.id}>
                        <img src={kartica.slika} alt={`Slika ${index}`} />
                        <div>
                            <h3>{kartica.naslov}</h3>
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