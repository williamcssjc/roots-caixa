import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Caixa from "./pages/Caixa";
import Estoque from "./pages/Estoque";
import Relatorios from "./pages/Relatorios";

function App() {
  return (
    <Router>
      <nav className="menu-navegacao">
        <Link to="/caixa"><button>Caixa</button></Link>
        <Link to="/estoque"><button>Estoque</button></Link>
        <Link to="/relatorios"><button>Relatórios</button></Link>
      </nav>

      <Routes>
        <Route path="/caixa" element={<Caixa />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="*" element={<Caixa />} /> {/* Rota padrão */}
      </Routes>
    </Router>
  );
}

export default App;
