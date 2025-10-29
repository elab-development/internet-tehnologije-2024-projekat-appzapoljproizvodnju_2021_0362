import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PrivateRoute from "./api/PrivateRoute";
import { ToastContainer } from "react-toastify";

import ScrollToTop from "./podaci/ScrollToTop";
import Header from "./komponente/Header";
import Footer from "./komponente/Footer";

import Kalendar from "./stranice/Kalendar";
import Nalog from "./stranice/Nalog";
import Pocetna from "./stranice/Pocetna";
import Prognoza from "./stranice/Prognoza";
import Vrste from "./stranice/Vrste";
import Login from "./stranice/Login";
import Registracija from "./stranice/Registracija";
import Promena from "./stranice/Promena";
import ZaboravljenaLozinka from "./stranice/ZaboravljenaLozinka";
import ResetLozinke from "./stranice/ResetLozinke";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Pocetna />} />
            <Route path="/vrste" element={<Vrste />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registracija" element={<Registracija />} />
            <Route path="/promena-lozinke" element={<Promena />} />
            <Route path="/zaboravljena-lozinka" element={<ZaboravljenaLozinka />} />
            <Route path="/reset-lozinke" element={<ResetLozinke />} />
            <Route element={<PrivateRoute />}>
              <Route path="/prognoza" element={<Prognoza />} />
              <Route path="/nalog" element={<Nalog />} />
              <Route path="/kalendar" element={<Kalendar />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </Router>
      <ToastContainer position="bottom-right" autoClose={2500} newestOnTop theme="dark" />
    </>
  );
}

export default App;
