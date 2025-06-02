import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { atualizarEstoque } from "./Cardápio";

const RegistroVenda = () => {
  const [pedido, setPedido] = useState("X-Salada");
  const [quantidade, setQuantidade] = useState(1);

  const registrarVenda = async () => {
    const venda = {
      pedido,
      quantidade,
      data: Timestamp.now()
    };

    await addDoc(collection(db, "vendas"), venda);
    await atualizarEstoque(pedido, quantidade);
    alert("Venda registrada com sucesso!");
  };

  return (
    <div>
      <h2>Registrar Venda</h2>
      <select value={pedido} onChange={(e) => setPedido(e.target.value)}>
        <option value="X-Salada">X-Salada</option>
        <option value="X-Bacon">X-Bacon</option>
        <option value="X-Cheddar">X-Cheddar</option>
      </select>
      <input
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(parseInt(e.target.value))}
        min="1"
      />
      <button onClick={registrarVenda}>Registrar</button>
    </div>
  );
};

export default RegistroVenda;
