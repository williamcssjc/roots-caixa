// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Caixa from "./pages/Caixa";
import Estoque from "./pages/Estoque";
import Relatorios from "./pages/Relatorios";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/caixa" element={<Caixa />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
