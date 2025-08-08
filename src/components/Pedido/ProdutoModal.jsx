// 📁 src/components/Pedido/ProdutoModal.jsx — versão fiel ao original

import React, { useState } from "react";
import "../../Styles/cards.css"; 

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

  const saboresRefri = ["Coca-Cola", "Coca-0", "Guaraná Antartica", "Guaraná-0", "Fanta Laranja", "Sprite"];

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
      ...adicionais.map((op) => `+ ${op.nome}`)
    ].filter(Boolean);

    const observacaoFinal = observacaoArray.length > 0 ? observacaoArray.join(" | ") : "";

    const valorAdicionais = adicionais.reduce((acc, item) => acc + item.preco, 0);

    const produtoFinal = {
      ...produto,
      observacao: observacaoFinal,
      preco: produto.preco + valorAdicionais,
      quantidade: quantidade,
      sabor: ehRefri ? saborRefriSelecionado : undefined
    };
    

    onConfirm(produtoFinal);
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-conteudo estilo-roots" onClick={(e) => e.stopPropagation()}>
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

        
{ehRefri && saborRefriSelecionado && (
  <div className="text-sm text-gray-300 mt-2">
    Sabor selecionado: <span className="text-yellow-400">{saborRefriSelecionado}</span>
  </div>
)}

{ehRefri && (
  <div className="mb-4">
    <label className="block text-white font-medium mb-2">Sabor:</label>
    <div className="grid grid-cols-1 gap-2">
      {saboresRefri.map((sabor) => (
        <button
          key={sabor}
          className={`btn-seletor ${saborRefriSelecionado === sabor ? "ativo" : ""}`}
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

        

        <div className="flex gap-3 mt-2">
          <button
            className=""
            onClick={onClose}
          >Cancelar</button>
          <button
            className=""
            onClick={handleConfirm}
          >Adicionar ao Pedido</button>
        </div>
      </div>
    </div>
  );
};

export default ProdutoModal;