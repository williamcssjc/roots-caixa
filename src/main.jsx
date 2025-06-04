// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App";

// Admin pages
import Caixa from "./pages/admin/Caixa";
import Estoque from "./pages/admin/Estoque";
import Relatorios from "./pages/admin/Relatorios";

// Cliente pages
import Cadastro from "./pages/clientes/Cadastro";
import Carrinho from "./pages/clientes/Carrinho";
import PedidoCliente from "./pages/clientes/PedidoCliente";
import Promocoes from "./pages/clientes/Promocoes";

import "./index.css";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="caixa" element={<Caixa />} />
      <Route path="estoque" element={<Estoque />} />
      <Route path="relatorios" element={<Relatorios />} />
    </Routes>
  );
}

function ClienteRoutes() {
  return (
    <Routes>
      <Route path="cadastro" element={<Cadastro />} />
      <Route path="carrinho" element={<Carrinho />} />
      <Route path="pedido" element={<PedidoCliente />} />
      <Route path="promocoes" element={<Promocoes />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/cliente/*" element={<ClienteRoutes />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
