import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig"; // seu arquivo de configuração
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "../layout.css";
import logo from "../assets/logo.png";

function Caixa() {
  const [pedido, setPedido] = useState([]);

  // Produtos disponíveis
  const produtos = [
    { nome: "Chesse Burguer", preco: 20 },
    { nome: "Chesse Bacon", preco: 25 },
    { nome: "Chesse Salada", preco: 22 },
    { nome: "Batata", preco: 10 },
    { nome: "Refri Lata", preco: 8 },
  ];

  // Adiciona produto ao pedido
  const adicionarProduto = (produto) => {
    setPedido([...pedido, produto]);
  };

  // Soma total da venda
  const total = pedido.reduce((acc, item) => acc + item.preco, 0);

  // Finaliza e salva no Firestore
  const finalizarVenda = async () => {
    if (pedido.length === 0) {
      alert("Adicione pelo menos um item!");
      return;
    }

    try {
      await addDoc(collection(db, "vendas"), {
        itens: pedido,
        total,
        data: Timestamp.now()
      });
      alert("Venda registrada com sucesso!");
      setPedido([]); // limpa a venda após salvar
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Erro ao registrar venda.");
    }
  };

  return (
    <div className="pagina-caixa">
      <nav className="menu-navegacao">
        <button>Caixa</button>
        <button>Estoque</button>
        <button>Relatórios</button>
      </nav>

      <header className="cabecalho">
        <img src={logo} alt="Logo Roots Burguer" className="logo" />
      </header>

      <main className="conteudo">
        <h1>REGISTRAR VENDA</h1>

        {produtos.map((produto, index) => (
          <button
            key={index}
            className="btn-venda"
            onClick={() => adicionarProduto(produto)}
          >
            {produto.nome} – R$ {produto.preco}
          </button>
        ))}

        {pedido.length > 0 && (
          <div className="lista-pedido">
            <h3>Pedido Atual:</h3>
            <ul>
              {pedido.map((item, i) => (
                <li key={i}>
                  {item.nome} – R$ {item.preco}
                </li>
              ))}
            </ul>
            <strong>Total: R$ {total}</strong>
          </div>
        )}

        <button className="btn-venda" onClick={finalizarVenda}>
          Finalizar Venda
        </button>
      </main>
    </div>
  );
}

export default Caixa;
