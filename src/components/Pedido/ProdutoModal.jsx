// 📁 src/components/Pedido/ProdutoModal.jsx — versão fiel ao original

import React, { useState } from "react";

const ProdutoModal = ({ produto, onClose, onConfirm }) => {
  const [observacao, setObservacao] = useState("");
  const [pontoBlend, setPontoBlend] = useState("");
  const [opcionaisSelecionados, setOpcionaisSelecionados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [saborRefriSelecionado, setSaborRefriSelecionado] = useState("");

  const ehHamburguer = produto?.nome.toLowerCase().includes("burguer") ||
    produto?.nome.toLowerCase().includes("bacon") ||
    produto?.nome.toLowerCase().includes("salada");

  const ehRefri = produto?.nome.toLowerCase().includes("refri") ||
    produto?.nome.toLowerCase().includes("lata");

  const ehBatata = produto?.nome.toLowerCase().includes("batata");

  const opcionaisHamburguer = [
    { nome: "Bacon Extra", preco: 3 },
    { nome: "+1 Blend", preco: 5 },
    { nome: "Cheddar Extra", preco: 2 },
  ];

  const opcionaisBatata = [
    { nome: "Cheddar Extra", preco: 2 },
    { nome: "Bacon Extra", preco: 3 },
  ];

  const saboresRefri = ["Coca-Cola", "Guaraná", "Fanta Laranja", "Fanta Uva", "Soda"];

  const getOpcionais = () => {
    if (ehHamburguer) return opcionaisHamburguer;
    if (ehBatata) return opcionaisBatata;
    return [];
  };

  const toggleOpcional = (opcional) => {
    setOpcionaisSelecionados((prev) => {
      if (prev.includes(opcional)) {
        return prev.filter((item) => item !== opcional);
      } else {
        return [...prev, opcional];
      }
    });
  };

  const calcularPrecoTotal = () => {
    if (!produto) return 0;
    const precoBase = produto.preco;
    const precoOpcionais = getOpcionais()
      .filter((op) => opcionaisSelecionados.includes(op.nome))
      .reduce((acc, op) => acc + op.preco, 0);
    return (precoBase + precoOpcionais) * quantidade;
  };

  const handleConfirm = () => {
    if (ehRefri && !saborRefriSelecionado) {
      alert("Por favor, selecione um sabor de refrigerante.");
      return;
    }

    const adicionais = getOpcionais().filter((op) =>
      opcionaisSelecionados.includes(op.nome)
    );

    const observacaoArray = [
      observacao.trim() ? observacao.trim() : null,
      ehHamburguer && pontoBlend ? `ponto: ${pontoBlend}` : null,
      ehRefri && saborRefriSelecionado ? `sabor: ${saborRefriSelecionado}` : null,
      ...adicionais.map((op) => `+ ${op.nome}`)
    ].filter(Boolean);

    const observacaoFinal = observacaoArray.length > 0 ? observacaoArray.join(" | ") : "";

    const valorAdicionais = adicionais.reduce((acc, item) => acc + item.preco, 0);

    const produtoFinal = {
      ...produto,
      observacao: observacaoFinal,
      preco: produto.preco + valorAdicionais,
      quantidade: quantidade
    };

    onConfirm(produtoFinal);
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-2">
          <h3 className="text-xl font-bold text-amber-500">{produto.nome}</h3>
          <div className="text-lg font-bold text-white">
            R$ {calcularPrecoTotal().toFixed(2)}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-white font-medium">Quantidade:</label>
            <div className="flex items-center bg-gray-800 rounded-md">
              <button
                className="px-3 py-1 text-white hover:bg-gray-700 rounded-l-md"
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              >-</button>
              <span className="px-4 py-1 text-white">{quantidade}</span>
              <button
                className="px-3 py-1 text-white hover:bg-gray-700 rounded-r-md"
                onClick={() => setQuantidade(quantidade + 1)}
              >+</button>
            </div>
          </div>
        </div>

        {ehHamburguer && (
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Ponto do Blend:</label>
            <div className="grid grid-cols-3 gap-2">
              {["Mal passado", "Ao ponto", "Bem passado"].map((ponto) => (
                <button
                  key={ponto}
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    pontoBlend === ponto ? "bg-amber-500 text-black" : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => setPontoBlend(ponto)}
                >
                  {ponto}
                </button>
              ))}
            </div>
          </div>
        )}

        {ehRefri && (
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Sabor:</label>
            <div className="grid grid-cols-1 gap-2">
              {saboresRefri.map((sabor) => (
                <button
                  key={sabor}
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    saborRefriSelecionado === sabor ? "bg-amber-500 text-black" : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => setSaborRefriSelecionado(sabor)}
                >
                  {sabor}
                </button>
              ))}
            </div>
          </div>
        )}

        {getOpcionais().length > 0 && (
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Opcionais:</label>
            <div className="space-y-2">
              {getOpcionais().map((op, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                    opcionaisSelecionados.includes(op.nome)
                      ? "bg-amber-500/20 border border-amber-500"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => toggleOpcional(op.nome)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 accent-amber-500"
                      checked={opcionaisSelecionados.includes(op.nome)}
                      onChange={() => {}}
                    />
                    <span className="text-white">{op.nome}</span>
                  </div>
                  <span className="text-amber-500 font-medium">+R$ {op.preco}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-white font-medium mb-2">Observações:</label>
          <textarea
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-amber-500 focus:outline-none"
            placeholder="Ex: sem cebola, no ponto certo..."
            rows="2"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          ></textarea>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition-colors"
            onClick={onClose}
          >Cancelar</button>
          <button
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md transition-colors"
            onClick={handleConfirm}
          >Adicionar ao Pedido</button>
        </div>
      </div>
    </div>
  );
};

export default ProdutoModal;
