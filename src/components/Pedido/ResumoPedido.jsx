import React from "react";
import ItemPedido from "./ItemPedido";

const ResumoPedido = ({ pedido, total, onAjustarQuantidade }) => {
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
      <div className="flex justify-between items-center pt-3 border-t border-gray-700">
        <span className="text-lg font-bold text-white">Total:</span>
        <span className="text-xl font-bold text-amber-500">R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ResumoPedido;
