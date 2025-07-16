import "../../Styles/cards.css"; // ⚠️ Certifique-se que esse path esteja correto

const CardProduto = ({ produto, onClick }) => {
  return (
    <div className="card-produto" onClick={() => onClick(produto)}>
      <img src={produto.imagem || "/img/padrao.png"} alt={produto.nome} />
      <h3>{produto.nome}</h3>
      <p>{produto.descricao}</p>
      <div className="preco">R$ {produto.preco.toFixed(2)}</div>
    </div>
  );
};

export default CardProduto;
