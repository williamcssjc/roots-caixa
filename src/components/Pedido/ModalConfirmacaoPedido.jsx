import React from "react";

const ModalConfirmacaoPedido = ({
  pedido,
  cliente,
  total,
  valorFrete = 0,
  onFechar,
  onConfirmar,
  carregando
}) => {
  return (
    <div className="modal" onClick={onFechar}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-amber-500 mb-4">Confirmar Pedido</h3>

        <div className="bg-gray-700 rounded-lg p-3 mb-4">
          <h4 className="font-bold text-white mb-2">Itens do Pedido:</h4>
          <ul className="space-y-1 mb-3">
            {pedido.map((item, i) => (
              <li key={i} className="text-gray-300">
                {item.quantidade}× {item.nome}
                {item.observacao && (
                  <span className="text-sm text-gray-400"> ({item.observacao})</span>
                )}
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-gray-600 pt-2">
            <span className="font-bold text-white">Total:</span>
            <span className="font-bold text-amber-500">R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <p>Subtotal: R$ {total.toFixed(2)}</p>
        <p>Entrega: R$ {valorFrete.toFixed(2)}</p>
        <p><strong>Total Geral: R$ {(total + valorFrete).toFixed(2)}</strong></p>

        <div className="bg-gray-700 rounded-lg p-3 mb-4">
          <h4 className="font-bold text-white mb-2">Dados de Entrega:</h4>
          <p className="text-gray-300"><span className="text-gray-400">Nome:</span> {cliente.nome}</p>
          <p className="text-gray-300"><span className="text-gray-400">Endereço:</span> {cliente.endereco}</p>
          <p className="text-gray-300"><span className="text-gray-400">Telefone:</span> {cliente.telefone}</p>
          <p className="text-gray-300"><span className="text-gray-400">Pagamento:</span> {cliente.pagamento}</p>
        </div>

        <div className="flex gap-3">
          <button 
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md"
            onClick={onFechar}
          >
            Voltar
          </button>
          <button 
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md"
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? 'Processando...' : 'Finalizar Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacaoPedido;
