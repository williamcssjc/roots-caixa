import { Routes, Route, Link } from 'react-router-dom';
import Caixa from './pages/Caixa';
import Estoque from './pages/Estoque';
import Relatorios from './pages/Relatorios';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/caixa" className="nav-button">Caixa</Link>
        <Link to="/estoque" className="nav-button">Estoque</Link>
        <Link to="/relatorios" className="nav-button">Relatórios</Link>
      </nav>

      <div className="conteudo">
        <Routes>
          <Route path="/" element={<Caixa />} />
          <Route path="/caixa" element={<Caixa />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
