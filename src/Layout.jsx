import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin pages
import Caixa from "./pages/admin/Caixa";
import Estoque from "./pages/admin/Estoque";
import Relatorios from "./pages/admin/Relatorios";

// Cliente pages
import PedidoCliente from "./pages/clientes/PedidoCliente";
import Cadastro from "./pages/clientes/Cadastro";
import Carrinho from "./pages/clientes/Carrinho";
import Promocoes from "./pages/clientes/Promocoes";


function App() {
  return (
    <Router>
      <Routes>
        {/* Layout e rotas Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="caixa" element={<Caixa />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Route>

        {/* Layout e rotas Cliente */}
        <Route path="/cliente" element={<ClienteLayout />}>
          <Route path="pedido" element={<PedidoCliente />} />
          <Route path="cadastro" element={<Cadastro />} />
          <Route path="carrinho" element={<Carrinho />} />
          <Route path="promocoes" element={<Promocoes />} />
        </Route>

        {/* Página padrão */}
        <Route path="*" element={<PedidoCliente />} />
      </Routes>
    </Router>
  );
}

export default App;
