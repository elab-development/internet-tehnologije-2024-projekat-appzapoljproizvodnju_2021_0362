import { useContext } from "react";
import { AuthContext } from "../api/AuthContext";
import http from "../api/http";
import { toast } from "react-toastify";

export default function ProfilGlava() {
    const { user, setUser } = useContext(AuthContext);

    if (!user) return null;

    const slikaSrc = `http://127.0.0.1:8000${user.profile_picture}`;

    async function promenaSlike(fajl) {
        const formData = new FormData();
        formData.append('profile_picture', fajl);

        const response = await http.post('/update-picture', formData);
        console.log(response.data);

        const noviUser = {
            ...user,
            profile_picture: response.data.profile_picture_url
        };

        setUser(noviUser);
        localStorage.setItem("user", JSON.stringify(noviUser));
        toast.success(response.data.message);
    }

    return(
        <>
            <div className="profil-glava">
                <div className="profilna-slika-sekcija">
                    <img src={slikaSrc} alt="Profilna slika" className="foto"/>
                    <label className="dugme-za-sliku" title="Promeni profilnu sliku">
                        <img src="/img/plus.png"/>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const fajl = e.target.files[0];
                                promenaSlike(fajl);
                            }}
                            hidden
                        />
                    </label>
                    <p>{user.name}</p>
                </div>
                <div className="informacije">
                        <div className="levo">
                            <p>Email:</p>
                            <p>Username:</p>
                            <p>Tip naloga:</p>
                            <p>Datum otvaranja naloga:</p>
                        </div>
                        <div className="desno">
                            <p>{user.email}</p>
                            <p>{user.username}</p>
                            <p>{user.role}</p>
                            <p>{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                </div>
            </div>
        </>
    );
}