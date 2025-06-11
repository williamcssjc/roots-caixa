// 📁 src/components/pedido/StatusPedido.jsx
import React from "react";

const StatusPedido = ({ numeroPedido, status }) => {
  if (!numeroPedido) return null;

  const getStatusColor = () => {
    switch (status) {
      case "Recebido":
        return "bg-blue-500";
      case "Em Preparo":
        return "bg-yellow-500";
      case "Saiu para Entrega":
        return "bg-purple-500";
      case "Entregue":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-bold text-amber-500 mb-2">
        Pedido #{String(numeroPedido).padStart(3, "0")}
      </h3>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
        <p className="text-white">{status || "Aguardando atualização..."}</p>
      </div>
    </div>
  );
};

export default StatusPedido;
