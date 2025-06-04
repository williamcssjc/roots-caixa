// NavbarAdm.jsx
import React from "react";
import { Link } from "react-router-dom";

function NavbarAdm() {
  return (
    <nav className="menu-navegacao">
      <Link to="/admin/caixa"><button>Caixa</button></Link>
      <Link to="/admin/estoque"><button>Estoque</button></Link>
      <Link to="/admin/relatorios"><button>Relatórios</button></Link>
    </nav>
  );
}

export default NavbarAdm;
