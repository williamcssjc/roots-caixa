import React, { useState, useEffect } from "react";

const ProdutoModal = ({ produto, onClose, onConfirm }) => {
  const [observacao, setObservacao] = useState("");
  const [pontoBlend, setPontoBlend] = useState("");
  const [opcionaisSelecionados, setOpcionaisSelecionados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [saborRefriSelecionado, setSaborRefriSelecionado] = useState("");

  // Detecta tipo do produto
  const ehHamburguer =
    produto?.nome.toLowerCase().includes("burguer") ||
    produto?.nome.toLowerCase().includes("bacon") ||
    produto?.nome.toLowerCase().includes("salada");

  const ehRefri =
    produto?.nome.toLowerCase().includes("refri") ||
    produto?.nome.toLowerCase().includes("lata");

  const ehBatata = produto?.nome.toLowerCase().includes("batata");

  // Definição de opcionais conforme categoria
  const opcionaisHamburguer = [
    { nome: "Bacon Extra", preco: 3 },
    { nome: "+1 Blend", preco: 5 },
    { nome: "Cheddar Extra", preco: 2 },
  ];

  const opcionaisBatata = [
    { nome: "Cheddar Extra", preco: 2 },
    { nome: "Bacon Extra", preco: 3 },
  ];

  const saboresRefri = [
    "Coca-Cola",
    "Guaraná",
    "Fanta Laranja",
    "Fanta Uva",
    "Soda",
  ];

  const getOpcionais = () => {
    if (ehHamburguer) return opcionaisHamburguer;
    if (ehBatata) return opcionaisBatata;
    return [];
  };

  // Função para adicionar/remover opcionais
  const toggleOpcional = (opcional) => {
    setOpcionaisSelecionados((prev) =>
      prev.includes(opcional)
        ? prev.filter((item) => item !== opcional)
        : [...prev, opcional]
    );
  };

  // Cálculo do preço total dinâmico (base + opcionais) x quantidade
  const calcularPrecoTotal = () => {
    if (!produto) return 0;

    const precoBase = produto.preco;

    const precoOpcionais = getOpcionais()
      .filter((op) => opcionaisSelecionados.includes(op.nome))
      .reduce((acc, op) => acc + op.preco, 0);

    return (precoBase + precoOpcionais) * quantidade;
  };

  // Confirmação do pedido com validações e montagem da observação final
  const handleConfirm = () => {
    if (ehRefri && !saborRefriSelecionado) {
      alert("Por favor, selecione um sabor de refrigerante.");
      return;
    }

    const adicionais = getOpcionais().filter((op) =>
      opcionaisSelecionados.includes(op.nome)
    );

    const observacaoArray = [
      observacao.trim() || null,
      ehHamburguer && pontoBlend ? `ponto: ${pontoBlend}` : null,
      ehRefri && saborRefriSelecionado ? `sabor: ${saborRefriSelecionado}` : null,
      ...adicionais.map((op) => `+ ${op.nome}`),
    ].filter(Boolean);

    const observacaoFinal = observacaoArray.length > 0 ? observacaoArray.join(" | ") : "";

    const valorAdicionais = adicionais.reduce((acc, item) => acc + item.preco, 0);

    const produtoFinal = {
      ...produto,
      observacao: observacaoFinal,
      preco: produto.preco + valorAdicionais,
      quantidade: quantidade,
    };

    onConfirm(produtoFinal);
  };

  // Resetar estado quando o produto mudar (reabrir modal com outro produto)
  useEffect(() => {
    setObservacao("");
    setPontoBlend("");
    setOpcionaisSelecionados([]);
    setQuantidade(1);
    setSaborRefriSelecionado("");
  }, [produto]);

  return (
    <div
      className="modal fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="modal-conteudo bg-gray-900 rounded-lg p-6 max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h3 className="text-xl font-bold text-amber-500">{produto.nome}</h3>
          <div className="text-lg font-bold text-white">
            R$ {calcularPrecoTotal().toFixed(2)}
          </div>
        </div>

        {/* Quantidade */}
        <label className="block mb-4 text-white">
          Quantidade:
          <input
            type="number"
            min={1}
            value={quantidade}
            onChange={(e) =>
              setQuantidade(e.target.value < 1 ? 1 : Number(e.target.value))
            }
            className="ml-2 rounded px-2 py-1 text-black w-20"
          />
        </label>

        {/* Ponto Blend - só hambúrguer */}
        {ehHamburguer && (
          <label className="block mb-4 text-white">
            Ponto do Blend:
            <select
              value={pontoBlend}
              onChange={(e) => setPontoBlend(e.target.value)}
              className="ml-2 rounded px-2 py-1 text-black w-full"
            >
              <option value="">Selecione</option>
              <option value="malpassado">Malpassado</option>
              <option value="ao_ponto">Ao Ponto</option>
              <option value="bem_passado">Bem Passado</option>
            </select>
          </label>
        )}

        {/* Opcionais */}
        {getOpcionais().length > 0 && (
          <fieldset className="mb-4 text-white">
            <legend className="mb-2 font-semibold">Adicionais:</legend>
            {getOpcionais().map((opcional) => (
              <label key={opcional.nome} className="block mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opcionaisSelecionados.includes(opcional.nome)}
                  onChange={() => toggleOpcional(opcional.nome)}
                  className="mr-2"
                />
                {`${opcional.nome} (+R$${opcional.preco.toFixed(2)})`}
              </label>
            ))}
          </fieldset>
        )}

        {/* Sabor Refrigerante */}
        {ehRefri && (
          <label className="block mb-4 text-white">
            Sabor do Refrigerante:
            <select
              value={saborRefriSelecionado}
              onChange={(e) => setSaborRefriSelecionado(e.target.value)}
              className="ml-2 rounded px-2 py-1 text-black w-full"
            >
              <option value="">Selecione</option>
              {saboresRefri.map((sabor) => (
                <option key={sabor} value={sabor}>
                  {sabor}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Observação */}
        <label className="block mb-6 text-white">
          Observação:
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Ex: sem cebola, pouco sal"
            className="w-full mt-1 rounded px-3 py-2 text-black resize-none"
            rows={3}
          />
        </label>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleConfirm}
            className="bg-amber-500 px-5 py-2 rounded font-bold text-black hover:bg-amber-600 transition"
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 px-5 py-2 rounded font-bold text-white hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProdutoModal;
