// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "./components/layouts/AdminLayout";
import ClienteLayout from "./components/layouts/ClienteLayout";

// Páginas Admin
import Caixa from "./pages/admin/Caixa";
import Estoque from "./pages/admin/Estoque";
import Relatorios from "./pages/admin/Relatorios";
import Dashboard from "./pages/admin/Dashboard";
import PainelPedidos from "./pages/admin/PainelPedidos";

// Páginas Cliente
import PedidoCliente from "./pages/clientes/PedidoCliente";
import Cadastro from "./pages/clientes/Cadastro";
import Carrinho from "./pages/clientes/Carrinho";
import Promocoes from "./pages/clientes/Promocoes";

function App() {
  return (
    <Routes>
      {/* Rotas Admin SEM LOGIN */}
      <Route path="/admin/*" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="caixa" element={<Caixa />} />
        <Route path="estoque" element={<Estoque />} />
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="pedidos" element={<PainelPedidos />} />
      </Route>

      {/* Layout e rotas Cliente */}
      <Route path="/cliente/*" element={<ClienteLayout />}>
        <Route path="pedido" element={<PedidoCliente />} />
        <Route path="cadastro" element={<Cadastro />} />
        <Route path="carrinho" element={<Carrinho />} />
        <Route path="promocoes" element={<Promocoes />} />
      </Route>

      {/* Página padrão */}
      <Route path="*" element={<PedidoCliente />} />
    </Routes>
  );
}

export default App;
