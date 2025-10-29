function Kartica({ slika, naslov, tekst, index }) {
    
  return (
    <div className="kartice">
      <img src={slika} alt={`Slika ${index}`} />
      <div className="tekst">
        <h2>{naslov}</h2>
        <p>{tekst}</p>
      </div>
    </div>
  );
}

export default Kartica;