// components/Pedido/CardProduto.jsx
import React from "react";
import "./CardProduto.css";

const CardProduto = ({ produto, onClick }) => {
  return (
    <button className="card-produto-dark" onClick={() => onClick(produto)}>
      <div className="imagem-produto">
        <img src={produto.imagem || "/img/padrao.png"} alt={produto.nome} />
      </div>
      <div className="info-produto">
        <p className="descricao-produto">{produto.descricao}</p> {/* <-- aqui! */}
        <span className="preco-produto">R$ {produto.preco.toFixed(2)}</span>
      </div>
    </button>
  );
};

export default CardProduto;
