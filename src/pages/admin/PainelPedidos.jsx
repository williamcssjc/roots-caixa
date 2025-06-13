// 📁 PainelPedidos.jsx — com alerta sonoro e visual ao chegar novo pedido

import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../layout.css";

function PainelPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [alertaNovoPedido, setAlertaNovoPedido] = useState(false);
  const audioRef = useRef(null);
  const ultimoPedidoId = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "vendas"), orderBy("data", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const novaLista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      if (pedidos.length > 0 && novaLista.length > pedidos.length) {
        const novo = novaLista[0];

        if (novo.status === "Recebido" && novo.id !== ultimoPedidoId.current) {
          setAlertaNovoPedido(true);
          ultimoPedidoId.current = novo.id;
          if (audioRef.current) audioRef.current.play();
          setTimeout(() => setAlertaNovoPedido(false), 5000);
        }
      }

      setPedidos(novaLista);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, [pedidos]);

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await updateDoc(doc(db, "vendas", id), { status: novoStatus });
    } catch (erro) {
      console.error("Erro ao atualizar status:", erro);
    }
  };

  const corStatus = (status) => {
    switch (status) {
      case "Recebido": return "bg-blue-500";
      case "Em Preparo": return "bg-yellow-500";
      case "Saiu para Entrega": return "bg-purple-500";
      case "Entregue": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="pagina-caixa">
      <audio ref={audioRef} src="/public/Sons/novo-pedido.mp3" preload="auto" />

      {alertaNovoPedido && (
        <div className="fixed top-0 left-0 right-0 bg-green-600 text-white text-center py-2 font-bold z-50 shadow-md animate-pulse">
          🔔 Novo pedido recebido!
        </div>
      )}

      <nav className="menu-navegacao">
        <Link to="/caixa"><button>Caixa</button></Link>
        <Link to="/estoque"><button>Estoque</button></Link>
        <Link to="/relatorios"><button>Relatórios</button></Link>
        <Link to="/admin/pedidos"><button className="ativo">Pedidos</button></Link>
      </nav>

      <header className="cabecalho">
        <img src={logo} alt="Logo Roots Burguer" className="logo" />
      </header>

      <main className="conteudo">
        <h1>PAINEL DE PEDIDOS</h1>

        {carregando ? (
          <p>Carregando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="p-4 rounded-lg bg-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-bold text-amber-500">
                    Pedido #{String(pedido.numeroPedido).padStart(3, "0")}
                  </div>
                  <div className={`px-3 py-1 text-white text-sm rounded-full ${corStatus(pedido.status)}`}>
                    {pedido.status || "Sem status"}
                  </div>
                </div>

                <p className="text-white mb-1">
                  <strong>Cliente:</strong> {pedido.cliente?.nome} | <strong>Pagamento:</strong> {pedido.cliente?.pagamento}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Endereço:</strong> {pedido.cliente?.endereco} | <strong>Telefone:</strong> {pedido.cliente?.telefone}
                </p>

                <ul className="mb-3 text-sm text-gray-300 list-disc list-inside">
                  {pedido.itens?.map((item, idx) => (
                    <li key={idx}>
                      {item.quantidade}× {item.nome} {item.observacao && <em>({item.observacao})</em>}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 flex-wrap">
                  {pedido.status === "Recebido" && (
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded"
                      onClick={() => atualizarStatus(pedido.id, "Em Preparo")}
                    >
                      Aceitar
                    </button>
                  )}
                  {pedido.status === "Em Preparo" && (
                    <button
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded"
                      onClick={() => atualizarStatus(pedido.id, "Saiu para Entrega")}
                    >
                      Saiu para entrega
                    </button>
                  )}
                  {pedido.status === "Saiu para Entrega" && (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded"
                      onClick={() => atualizarStatus(pedido.id, "Entregue")}
                    >
                      Marcar como entregue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PainelPedidos;
