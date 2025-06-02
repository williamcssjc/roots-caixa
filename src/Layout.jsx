import React from "react";
import "./layout.css";
import logo from "./assets/logo.png"; // Correto!

function Layout() {
  return (
    <div className="pagina-caixa">
      <nav className="menu-navegacao">
        <button>Caixa</button>
        <button>Estoque</button>
        <button>Relatórios</button>
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
