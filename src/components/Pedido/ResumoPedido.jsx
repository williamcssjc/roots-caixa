import React from "react";
import ItemPedido from "./ItemPedido";


const ResumoPedido = ({ pedido, total, valorFrete = 0, onAjustarQuantidade }) => {
  if (pedido.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 mb-6 text-center">
        <p className="text-gray-400">Seu pedido está vazio</p>
        <p className="text-sm text-gray-500 mt-2">Selecione produtos para adicionar</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-6">
      <h3 className="text-xl font-bold text-amber-500 mb-4">Seu Pedido:</h3>
      <div className="max-h-80 overflow-y-auto mb-4">
        {pedido.map((item, i) => (
          <ItemPedido key={i} item={item} onAjustarQuantidade={onAjustarQuantidade} />
        ))}
      </div>
      
      <div className="espacamento-frete">
          <p>Subtotal: R$ {total.toFixed(2)}</p>
          <p>Entrega: R$ {valorFrete.toFixed(2)}</p>
          <p><strong>Total Geral: R$ {(total + valorFrete).toFixed(2)}</strong></p>
      </div>
    </div>
  );
};


export default ResumoPedido;
