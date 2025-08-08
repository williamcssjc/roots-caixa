import React from "react";
import "../../Styles/resumo.css";

const ResumoPedido = ({
  pedido,
  valorFrete = 0,
  cliente,
  onAjustarQuantidade,
  onLimparPedido,
}) => {
  const total = pedido.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  if (pedido.length === 0) {
    return (
      <div className="resumo-container">
        <h2>Resumo do Pedido</h2>
        <p className="mensagem-vazio">Seu pedido está vazio</p>
        <p className="mensagem-vazio-sub">Selecione produtos para adicionar</p>
      </div>
    );
  }

  return (
    <div className="resumo-container">
      <h2>Resumo do Pedido</h2>

      {pedido.map((item, i) => (
        <div
          key={i}
          className="item-resumo flex justify-between items-start border-b border-zinc-700 py-2"
        >
          <div className="flex-1 text-white">
            <span className="font-semibold text-yellow-400">
              {item.nome}
            </span>

            {item.sabor && (
              <div className="text-xs text-gray-300">Sabor: {item.sabor}</div>
            )}

            {item.observacao && (
              <div className="text-xs text-gray-400">
                Obs: {item.observacao}
              </div>
            )}

            <div className="flex items-center space-x-2 mt-1">
              <button
                onClick={() =>
                  onAjustarQuantidade(item.nome, -1, item.observacao)
                }
                className="px-2 py-1 bg-zinc-800 text-yellow-400 rounded hover:bg-zinc-700"
              >
                –
              </button>
              <span className="text-white">{item.quantidade}×</span>
              <button
                onClick={() =>
                  onAjustarQuantidade(item.nome, 1, item.observacao)
                }
                className="px-2 py-1 bg-zinc-800 text-yellow-400 rounded hover:bg-zinc-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-amber-400 font-bold">
            R$ {(item.preco * item.quantidade).toFixed(2)}
          </div>
        </div>
      ))}

<div className="item-resumo mt-4 text-sm text-white">
  <div className="flex justify-between">
    <span className="font-medium">Entrega</span>
    <span className="text-yellow-300 font-bold">
      R$ {valorFrete.toFixed(2)}
    </span>
  </div>
  
</div>


    
      {cliente.pagamento === "Dinheiro" && cliente.precisaTroco === "Sim" && cliente.troco && (
  <div className="text-sm text-white mt-2">
    <span className="font-semibold text-yellow-300">Troco para:</span> R$ {parseFloat(cliente.troco).toFixed(2)}
  </div>
)}
  <div className="total text-right text-lg font-bold text-green-400 mt-3">
        Total: R$ {(total + valorFrete).toFixed(2)}
      </div>


      <div className="text-right mt-2">
        <button
          className="text-white text-sm hover:text-red-400 hover:underline"
          onClick={onLimparPedido}
        >
          🗑 Limpar Pedido
        </button>
      </div>
    </div>
  );
};


export default ResumoPedido;
