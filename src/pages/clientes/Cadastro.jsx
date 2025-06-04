
// Cadastro.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../layout.css";

function Cadastro() {
  return (
    <div className="pagina-caixa">
      <nav className="menu-navegacao">
        <Link to="/caixa"><button>Caixa</button></Link>
        <Link to="/estoque"><button>Estoque</button></Link>
        <Link to="/relatorios"><button>Relatórios</button></Link>
        <Link to="/promocoes"><button>Promoções</button></Link>
      </nav>

      <header className="cabecalho">
        <img src={logo} alt="Logo Roots Burguer" className="logo" />
      </header>

      <main className="conteudo">
        <h1>Cadastro de Clientes</h1>
        <p style={{ color: '#fff' }}>Função futura para cadastro e fidelização de clientes.</p>
      </main>
    </div>
  );
}

export default Cadastro;
