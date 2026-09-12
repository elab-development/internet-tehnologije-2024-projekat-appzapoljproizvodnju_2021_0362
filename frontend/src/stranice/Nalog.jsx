import Naslov from "../komponente/Naslov";
import ProfilGlava from "../komponente/ProfilGlava";
import DodavanjeBiljaka from "../komponente/DodavanjeBiljaka";

function Nalog() {
    return(
        <>
            <Naslov tekst="Nalog" />
            <ProfilGlava />
            <DodavanjeBiljaka />
        </>
    );
}

export default Nalog;