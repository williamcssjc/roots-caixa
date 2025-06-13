import React, { useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  query,
  getDoc,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import "../../layout.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import receitas from "../../data/receitas"; // importa o mapa de receitas

function Caixa() {
  const [pedido, setPedido] = useState([]);

  const produtos = [
    { nome: "Chesse Burguer", preco: 20 },
    { nome: "Chesse Bacon", preco: 25 },
    { nome: "Chesse Salada", preco: 22 },
    { nome: "Batata", preco: 10 },
    { nome: "Refri Lata", preco: 8 },
  ];

  const adicionarProduto = (produto) => {
    setPedido([...pedido, produto]);
  };

  const total = pedido.reduce((acc, item) => acc + item.preco, 0);

  // 👉 Função para descontar ingredientes do estoque
  const descontarIngredientes = async (itensVendidos) => {
    const resumo = {};

    // Conta quantos de cada produto foi vendido
    for (const item of itensVendidos) {
      resumo[item.nome] = (resumo[item.nome] || 0) + 1;
    }

    // Percorre os produtos e desconta os ingredientes no estoque
    for (const nomeProduto in resumo) {
      const quantidadeVendida = resumo[nomeProduto];
      const receita = receitas[nomeProduto];

      if (receita) {
        for (const ingrediente in receita) {
          const quantidadeUsada = receita[ingrediente] * quantidadeVendida;
          const refEstoque = doc(db, "estoque", ingrediente);
          const snap = await getDoc(refEstoque);

          if (snap.exists()) {
            const atual = snap.data().quantidade || 0;
            const novaQuantidade = atual - quantidadeUsada;

            await updateDoc(refEstoque, {
              quantidade: novaQuantidade,
            });
          }
        }
      }
    }
  };

  const finalizarVenda = async () => {
    try {
      if (pedido.length === 0) {
        alert("Adicione produtos ao pedido antes de finalizar.");
        return;
      }

      // Passo 1: Obter o último número de pedido
      const vendasRef = collection(db, "vendas");
      const q = query(vendasRef, orderBy("numeroPedido", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let novoNumeroPedido = 1;
      if (!querySnapshot.empty) {
        const ultimaVenda = querySnapshot.docs[0].data();
        novoNumeroPedido = ultimaVenda.numeroPedido + 1;
      }

      // Monta os dados da venda
      const dadosVenda = {
        data: new Date().toISOString(),
        itens: pedido,
        total: total,
        numeroPedido: novoNumeroPedido,
      };

      // Salva no Firestore
      await addDoc(vendasRef, dadosVenda);

      // Desconta ingredientes do estoque
      await descontarIngredientes(pedido);

      console.log("Venda registrada com sucesso!");

      alert(`Pedido #${String(novoNumeroPedido).padStart(3, "0")} registrado com sucesso!`);

      // Limpar pedido após salvar
      setPedido([]);

    } catch (erro) {
      console.error("Erro ao registrar venda:", erro);
      alert("Erro ao registrar venda. Veja o console para detalhes.");
    }
  };

  return (
    <div className="pagina-caixa">
      <nav className="menu-navegacao">
        <Link to="/caixa"><button>Caixa</button></Link>
        <Link to="/estoque"><button>Estoque</button></Link>
        <Link to="/relatorios"><button>Relatórios</button></Link>
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
