// AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavbarAdm from "../NavbarAdm";

function AdminLayout() {
  return (
    <div>
      <NavbarAdm />
      <Outlet />
    </div>
  );
}

export default AdminLayout;
