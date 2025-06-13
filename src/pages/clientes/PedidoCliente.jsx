import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  getDoc,
  getDocs,
  orderBy,
  limit,
  where,       
  onSnapshot,
} from "firebase/firestore";
import "../../layout.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import receitas from "../../data/receitas";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProdutoModal from "../../components/Pedido/ProdutoModal";
import ResumoPedido from "../../components/Pedido/ResumoPedido";
import FormularioCliente from "../../components/Pedido/FormularioCliente";
import StatusPedido from "../../components/Pedido/StatusPedido";
import ModalConfirmacaoPedido from "../../components/Pedido/ModalConfirmacaoPedido";
import AlertaStatusPedido from "../../components/Pedido/AlertaStatusPedido";
import { useRef } from "react"; // ✅ NOVO: para status atualizado no snapshot


// Componente principal
function PedidoCliente() {
  const [pedido, setPedido] = useState([]);
  const [cliente, setCliente] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    pagamento: "",
  });
  const [errosCliente, setErrosCliente] = useState({});
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [statusPedido, setStatusPedido] = useState("");
  const statusAtualRef = useRef(""); // ✅ NOVO

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState({ mensagem: "", tipo: "" });
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [statusAnterior, setStatusAnterior] = useState("");
const [mostrarAlertaStatus, setMostrarAlertaStatus] = useState(false);
  

  // Dados dos produtos
  const produtos = [
    { id: 1, nome: "Chesse Burguer", preco: 20, descricao: "Hambúrguer com queijo cheddar" },
    { id: 2, nome: "Chesse Bacon", preco: 25, descricao: "Hambúrguer com queijo e bacon crocante" },
    { id: 3, nome: "Chesse Salada", preco: 22, descricao: "Hambúrguer com queijo, alface e tomate" },
    { id: 4, nome: "Batata", preco: 10, descricao: "Porção de batatas fritas" },
    { id: 5, nome: "Refri Lata", preco: 8, descricao: "Refrigerante em lata" },
  ];

  // Dados das promoções
  const promocoes = [
    { imagem: "/promo1.jpg", alt: "Promoção 1" },
    { imagem: "/promo2.jpg", alt: "Promoção 2" },
  ];

  useEffect(() => {
    statusAtualRef.current = statusPedido; // ✅ NOVO: mantém sempre o valor atual do status
  }, [statusPedido]);
  
  useEffect(() => {
    const numeroSalvo = localStorage.getItem("pedidoClienteRoots");
    if (numeroSalvo && !numeroPedido) {
      buscarPedidoAtivo(parseInt(numeroSalvo));
    }
  }, []);
  
  // Limpar notificação após 3 segundos
  useEffect(() => {
    if (notificacao.mensagem) {
      const timer = setTimeout(() => {
        setNotificacao({ mensagem: "", tipo: "" });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notificacao]);
  useEffect(() => {
    if (mostrarAlertaStatus) {
      const timer = setTimeout(() => {
        setMostrarAlertaStatus(false);
      }, 4000); // Fecha automaticamente após 4 segundos
  
      return () => clearTimeout(timer);
    }
  }, [mostrarAlertaStatus]);
  
  const buscarPedidoAtivo = async (numero) => {
    try {
      const vendasRef = collection(db, "vendas");
      const q = query(vendasRef, where("numeroPedido", "==", numero));
      const snap = await getDocs(q);
  
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        const ref = docSnap.ref;
        const data = docSnap.data();
  
        setNumeroPedido(numero);
        setStatusPedido(data.status);
        statusAtualRef.current = data.status; // ✅ sincroniza o valor logo no início
  
        onSnapshot(ref, (doc) => {
          if (doc.exists()) {
            const novoStatus = doc.data().status;
            if (novoStatus !== statusAtualRef.current) {
              setStatusAnterior(statusAtualRef.current);
              setStatusPedido(novoStatus);
              statusAtualRef.current = novoStatus; // ✅ atualiza corretamente a referência
              setMostrarAlertaStatus(true);
            }
          }
        });
      }
    } catch (error) {
      console.error("Erro ao buscar pedido salvo:", error);
    }
  };
  

  // Abrir modal de produto
  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };

  // Fechar modal de produto
  const fecharModal = () => {
    setProdutoSelecionado(null);
    setModalAberto(false);
  };

  // Adicionar produto ao pedido
  const adicionarProduto = (produto) => {
    setPedido((prevPedido) => {
      // Verificar se o produto já existe com a mesma observação
      const itemExistente = prevPedido.find(
        (item) => 
          item.nome === produto.nome && 
          item.observacao === produto.observacao
      );
      
      if (itemExistente) {
        // Atualizar quantidade se já existe
        return prevPedido.map((item) =>
          item.nome === produto.nome && item.observacao === produto.observacao
            ? { ...item, quantidade: item.quantidade + produto.quantidade }
            : item
        );
      } else {
        // Adicionar novo item
        return [...prevPedido, produto];
      }
    });
    
    // Mostrar notificação
    setNotificacao({
      mensagem: `${produto.quantidade}× ${produto.nome} adicionado ao pedido!`,
      tipo: "sucesso"
    });
    
    // Fechar modal
    fecharModal();
  };

  // Ajustar quantidade de um item no pedido
  const alterarQuantidade = (nome, delta, observacao) => {
    setPedido((pedidoAtual) =>
      pedidoAtual
        .map((item) =>
          item.nome === nome && item.observacao === observacao
            ? { ...item, quantidade: item.quantidade + delta }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  };

  // Calcular total do pedido
  const total = pedido.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  // Descontar ingredientes do estoque
  const descontarIngredientes = async (itensVendidos) => {
    const resumo = {};
    for (const item of itensVendidos) {
      resumo[item.nome] = (resumo[item.nome] || 0) + item.quantidade;
    }

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

  // Validar formulário do cliente
  const validarFormulario = () => {
    const erros = {};
    
    if (!cliente.nome.trim()) {
      erros.nome = "Nome é obrigatório";
    }
    
    if (!cliente.endereco.trim()) {
      erros.endereco = "Endereço é obrigatório";
    }
    
    if (!cliente.telefone.trim()) {
      erros.telefone = "Telefone é obrigatório";
    } else if (cliente.telefone.length < 10) {
      erros.telefone = "Telefone inválido";
    }
    
    if (!cliente.pagamento) {
      erros.pagamento = "Forma de pagamento é obrigatória";
    }
    
    setErrosCliente(erros);
    return Object.keys(erros).length === 0;
  };

  // Abrir modal de confirmação
  const abrirConfirmacao = () => {
    if (pedido.length === 0) {
      setNotificacao({
        mensagem: "Adicione produtos ao pedido antes de finalizar.",
        tipo: "erro"
      });
      return;
    }
    
    if (!validarFormulario()) {
      setNotificacao({
        mensagem: "Preencha todos os campos obrigatórios.",
        tipo: "erro"
      });
      return;
    }
    
    setModalConfirmacao(true);
  };

  // Finalizar pedido
  const finalizarPedido = async () => {
    try {
      setCarregando(true);
      
      const vendasRef = collection(db, "vendas");
      const q = query(vendasRef, orderBy("numeroPedido", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      let novoNumeroPedido = 1;
      if (!querySnapshot.empty) {
        const ultimaVenda = querySnapshot.docs[0].data();
        novoNumeroPedido = ultimaVenda.numeroPedido + 1;
      }

      const dadosVenda = {
        data: new Date().toISOString(),
        itens: pedido,
        total: total,
        numeroPedido: novoNumeroPedido,
        cliente: cliente,
        status: "Recebido",
      };

      const docRef = await addDoc(vendasRef, dadosVenda);
      await descontarIngredientes(pedido);

      localStorage.setItem("pedidoClienteRoots", novoNumeroPedido);

      setNumeroPedido(novoNumeroPedido);
      setPedido([]);
      setCliente({
        nome: "",
        endereco: "",
        telefone: "",
        pagamento: "",
      });
      setModalConfirmacao(false);
      
      setNotificacao({
        mensagem: `Pedido #${String(novoNumeroPedido).padStart(3, "0")} registrado com sucesso!`,
        tipo: "sucesso"
      });

      // Listener para status do pedido
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setStatusPedido(doc.data().status);
        }
      });
    } catch (erro) {
      console.error("Erro ao registrar pedido:", erro);
      setNotificacao({
        mensagem: "Erro ao registrar pedido. Tente novamente.",
        tipo: "erro"
      });
    } finally {
      setCarregando(false);
    }
  };

  // Configurações do carrossel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="pagina-caixa">
      {/* Navegação */}
      <header className="header-cliente">
  <p className="boas-vindas"> Bem-vindo ao Roots Burguer</p>
</header>


      {/* Cabeçalho */}
      <header className="cabecalho">
        <img src={logo} alt="Logo Roots Burguer" className="logo" />
      </header>

      {/* Conteúdo principal */}
      <main className="conteudo">
        {/* Notificação */}
        {notificacao.mensagem && (
          <div 
            className={`fixed top-20 right-4 z-50 p-3 rounded-md shadow-lg max-w-xs animate-fade-in ${
              notificacao.tipo === 'sucesso' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <p className="text-white">{notificacao.mensagem}</p>
          </div>
        )}
        
        {/* Carrossel de promoções */}
        <div className="carrossel-promocoes">
          <Slider {...settings}>
            {promocoes.map((promo, index) => (
              <div key={index}>
                <img
                  src={promo.imagem}
                  alt={promo.alt}
                  className="imagem-promocao"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Título */}
        <h1>Fazer Pedido</h1>

        {/* Layout em duas colunas para telas maiores */}
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Coluna de produtos */}
          <div className="md:w-2/3">
            {/* Grid de produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {produtos.map((produto) => (
                <button
                  key={produto.id}
                  className="btn-venda flex flex-col items-center justify-center h-24 text-center"
                  onClick={() => abrirModal(produto)}
                >
                  <div className="font-bold">{produto.nome}</div>
                  <div className="text-sm mt-1">R$ {produto.preco.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Coluna do pedido */}
          <div className="md:w-1/3">
            {/* Resumo do pedido */}
            <ResumoPedido 
              pedido={pedido} 
              total={total} 
              onAjustarQuantidade={alterarQuantidade} 
            />
            
            {/* Formulário do cliente */}
            <FormularioCliente 
              cliente={cliente} 
              setCliente={setCliente} 
              erros={errosCliente} 
            />
            
            {/* Botão finalizar */}
            <button 
              className={`btn-venda w-full py-3 text-lg ${carregando ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={abrirConfirmacao}
              disabled={carregando}
            >
              {carregando ? 'Processando...' : 'Finalizar Pedido'}
            </button>
            
            {/* Status do pedido */}
            {numeroPedido && (
              <StatusPedido numeroPedido={numeroPedido} status={statusPedido} />
            )}
          </div>
        </div>
      </main>
      <AlertaStatusPedido
  status={statusPedido}
  visivel={mostrarAlertaStatus}
  onFechar={() => setMostrarAlertaStatus(false)}
/>

      {/* Modal de personalização */}
      {modalAberto && produtoSelecionado && (
        <ProdutoModal 
          produto={produtoSelecionado}
          onClose={fecharModal}
          onConfirm={adicionarProduto}
        />
      )}
      {modalConfirmacao && (
        <ModalConfirmacaoPedido
          pedido={pedido}
          cliente={cliente}
          total={total}
          onFechar={() => setModalConfirmacao(false)}
          onConfirmar={finalizarPedido}
          carregando={carregando}
        />
      )}

    </div>
  );
}

export default PedidoCliente;
