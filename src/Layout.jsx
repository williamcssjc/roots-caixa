import React from "react";
import "./layout.css";
import logo from "./assets/logo.png"; // Correto!
import { Link } from "react-router-dom"; // importe no topo

function Layout() {
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
        <h1>REGISTRAR VENDA</h1>
        <button className="btn-venda">Adicionar X-Salada</button>
        <button className="btn-venda">Finalizar Venda</button>
      </main>
    </div>
  );
}

export default Layout;
