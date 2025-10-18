import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ScrollToTop from "./podaci/ScrollToTop";

import Header from "./komponente/Header";
import Footer from "./komponente/Footer";

import Kalendar from "./stranice/Kalendar";
import Nalog from "./stranice/Nalog";
import Pocetna from "./stranice/Pocetna";
import Prognoza from "./stranice/Prognoza";
import Vrste from "./stranice/Vrste";
import Login from "./stranice/Login";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/nalog" element={<Nalog />} />
          <Route path="/kalendar" element={<Kalendar />} />
          <Route path="/prognoza" element={<Prognoza />} />
          <Route path="/vrste" element={<Vrste />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
