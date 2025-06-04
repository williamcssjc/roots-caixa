import React from "react";
import logo from "../../assets/logo.png";
import "../../layout.css";
import { Link } from "react-router-dom";

function Estoque() {
  return (
    <div className="pagina-caixa">
      <nav className="menu-navegacao">
        <Link to="/caixa"><button>Caixa</button></Link>
        <Link to="/estoque"><button>Estoque</button></Link>
        <Link to="/relatorios"><button>Relatórios</button></Link>
      </nav>

      <header className="cabecalho">
        <img src={logo} alt="Logo Roots Burguer" className="logo" />
      </header>

      <main className="conteudo">
        <h1>ESTOQUE</h1>

        <div className="lista-pedido">
          <ul>
            <li>Alface americana - Quantidade: 10</li>
            <li>Bacon - Quantidade: 15</li>
            <li>Blend 120g - Quantidade: 20</li>
            <li>Maionese - Quantidade: 8</li>
            <li>Pão Brioche - Quantidade: 25</li>
            <li>Queijo cheddar - Quantidade: 12</li>
            <li>Tomate - Quantidade: 14</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Estoque;
