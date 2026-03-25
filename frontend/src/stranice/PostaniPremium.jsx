import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Dugme from "../komponente/Dugme";
import { becomePremium } from "../api/auth";
import { useAuth } from "../api/AuthContext";

export default function PostaniPremium() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await becomePremium();

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Uspešno ste postali premium korisnik!");
      navigate("/kalendar");
    } catch (error) {
      console.error(error);
      toast.error("Došlo je do greške pri aktivaciji premium naloga.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>Postani Premium</h1>

      <form onSubmit={handleSubmit}>
        <p>
          Da biste postali premium korisnik, platite 2400 RSD i imaćete
          pristup svim premium funkcijama zauvek.
        </p>

        <button type="submit" className="dugme" disabled={loading}>
          {loading ? "Obrada..." : "Plati 2400RSD"}
        </button>

        <Dugme tekst="Povratak" link="/" />
      </form>
    </>
  );
}