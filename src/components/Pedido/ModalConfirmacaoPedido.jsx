import React from "react";
import "../../Styles/cards.css";

const ModalConfirmacaoPedido = ({
  pedido,
  cliente,
  total,
  valorFrete = 0,
  onFechar,
  onConfirmar,
  carregando,
}) => {
  return (
    <div className="modal" onClick={onFechar}>
      <div className="modal-conteudo estilo-roots" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-yellow-500 mb-4">📋 Confirme seus dados</h3>

        <div className="bg-zinc-800 rounded-lg p-4 mb-4 space-y-2 text-zinc-300">
          <h4 className="font-bold text-yellow-500 mb-2">🧍 Cliente</h4>
          <p><span className="text-zinc-400">Nome:</span> {cliente.nome}</p>
          <p><span className="text-zinc-400">Telefone:</span> {cliente.telefone}</p>

          <hr className="border-zinc-700 my-3" />

          <h4 className="font-bold text-yellow-500 mb-2">📍 Endereço de Entrega</h4>
          <p>{cliente.endereco}</p>

          <hr className="border-zinc-700 my-3" />

          <h4 className="font-bold text-yellow-500 mb-2">💰 Pagamento</h4>
          <p>{cliente.pagamento}</p>
        </div>

        <div className="bg-zinc-800 rounded-lg p-4 mb-4 text-zinc-300">
          <h4 className="font-bold text-yellow-500 mb-2">🧾 Pedido</h4>
          <ul className="space-y-1 mb-2">
            {pedido.map((item, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>
                  {item.quantidade}× {item.nome}
                  {item.observacao && (
                    <span className="text-sm text-zinc-400"> ({item.observacao})</span>
                  )}
                </span>
                <span>R$ {(item.quantidade * item.preco).toFixed(2).replace(".", ",")}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-zinc-700 pt-2">
            <p className="text-sm flex justify-between">
              <span>Subtotal:</span> 
              <span>R$ {total.toFixed(2).replace(".", ",")}</span>
            </p>
            <p className="text-sm flex justify-between">
              <span>Entrega:</span> 
              <span>R$ {valorFrete.toFixed(2).replace(".", ",")}</span>
            </p>
            <p className="font-bold text-yellow-500 text-lg mt-1 flex justify-between">
              <span>Total:</span> 
              <span>R$ {(total + valorFrete).toFixed(2).replace(".", ",")}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            className="bg-zinc-700 text-white px-4 py-2 rounded hover:bg-zinc-600 transition-all duration-300 ease-in-out"
            onClick={onFechar}
          >
            Voltar
          </button>
          <button
            className={`bg-yellow-500 text-zinc-900 px-4 py-2 font-bold rounded hover:bg-orange-500 transition-all duration-300 ease-in-out ${carregando ? "opacity-70 cursor-not-allowed" : ""}`}
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? "Processando..." : "Finalizar Pedido"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacaoPedido;

