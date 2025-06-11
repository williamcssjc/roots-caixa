import React from "react";
import { Outlet } from "react-router-dom";


function ClienteLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ClienteLayout;
