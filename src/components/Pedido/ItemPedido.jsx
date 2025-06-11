import React from "react";

const ItemPedido = ({ item, onAjustarQuantidade }) => (
  <div className="bg-gray-800 rounded-lg p-3 mb-3">
    <div className="flex justify-between items-center mb-1">
      <div className="font-bold text-white">{item.nome}</div>
      <div className="text-amber-500 font-bold">R$ {(item.preco * item.quantidade).toFixed(2)}</div>
    </div>
    {item.observacao && (
      <div className="text-sm text-gray-400 mb-2 italic">{item.observacao}</div>
    )}
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-300">
        R$ {item.preco.toFixed(2)} × {item.quantidade}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onAjustarQuantidade(item.nome, -1, item.observacao)} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-md">-</button>
        <span className="text-white w-6 text-center">{item.quantidade}</span>
        <button onClick={() => onAjustarQuantidade(item.nome, 1, item.observacao)} className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-md">+</button>
      </div>
    </div>
  </div>
);

export default ItemPedido;