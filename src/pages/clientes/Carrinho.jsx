
// Carrinho.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../layout.css";

function Carrinho() {
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
        <h1>Seu Carrinho</h1>
        <p style={{ color: '#fff' }}>Em breve: visualização de pedidos do cliente e finalização via app.</p>
      </main>
    </div>
  );
}

export default Carrinho;
