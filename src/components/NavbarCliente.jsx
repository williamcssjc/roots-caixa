// NavbarCliente.jsx
import React from "react";
import { Link } from "react-router-dom";

function NavbarCliente() {
  return (
    <nav className="menu-navegacao">
      <Link to="/cliente/pedido"><button>Fazer Pedido</button></Link>
      <Link to="/cliente/cadastro"><button>Cadastro</button></Link>
      <Link to="/cliente/carrinho"><button>Carrinho</button></Link>
      <Link to="/cliente/promocoes"><button>Promoções</button></Link>
    </nav>
  );
}

export default NavbarCliente;
