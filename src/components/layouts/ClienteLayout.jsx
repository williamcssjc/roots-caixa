import React from "react";
import { Outlet } from "react-router-dom";
import NavbarCliente from "../NavbarCliente";

function ClienteLayout() {
  return (
    <div>
      <NavbarCliente />
      <Outlet />
    </div>
  );
}

export default ClienteLayout;
