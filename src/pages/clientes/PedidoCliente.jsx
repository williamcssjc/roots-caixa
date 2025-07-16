import React, { useState, useEffect, useRef } from "react";
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProdutoModal from "../../components/Pedido/ProdutoModal";
import ResumoPedido from "../../components/Pedido/ResumoPedido";
import FormularioCliente from "../../components/Pedido/FormularioCliente";
import StatusPedido from "../../components/Pedido/StatusPedido";
import ModalConfirmacaoPedido from "../../components/Pedido/ModalConfirmacaoPedido";
import AlertaStatusPedido from "../../components/Pedido/AlertaStatusPedido";
import CardProduto from "../../components/Pedido/CardProduto";
import {
  buscarEnderecoPorCep,
  buscarCoordsPorEndereco,
  calcularDistanciaKm,
} from "../../utils/Geolocalizacao";
import ModalPagamentoPix from "../../components/Pedido/ModalPagamentoPix";



// Dados das promoções
const promocoes = [
  { imagem: "/promo1.jpg", alt: "Promoção 1" },
  { imagem: "/promo2.jpg", alt: "Promoção 2" },
];

// Dados dos produtos
const produtos = [
  {
    id: 1,
    nome: "Roots Burguer",
    preco: 20,
    descricao: "Pão brioche, hambúrguer 120g, cheddar fatiado e maionese da casa.",
    categoria: "burgers",
  },
  {
    id: 2,
    nome: "Roots Bacon",
    preco: 25,
    descricao: "Hambúrguer 120g com queijo cheddar, bacon crocante e baconese.",
    categoria: "burgers",
  },
  {
    id: 3,
    nome: "Roots Salada",
    preco: 22,
    descricao: "Hambúrguer, queijo, alface, tomate e molho verde.",
    categoria: "burgers",
  },
  { id: 4, nome: "Batata", preco: 10, descricao: "Porção de batatas fritas", categoria: "batatas" },
  { id: 5, nome: "Refri Lata", preco: 8, descricao: "Refrigerante em lata", categoria: "bebidas" },
  { id: 6, nome: "Combo Roots Burguer", preco: 28, descricao: "Roots buger + batata + refri", categoria: "hamburguer" },
  { id: 7, nome: "Combo Roots Bacon", preco:35, descricao: "Roots Bacon + batata + refri", categoria: "hamburguer" },
  { id: 8, nome: "Combo Roots Salada", preco:30, descricao: "Roots Salada + batata + refri", categoria: "hamburguer" },
];

function PedidoCliente() {
  const [pedido, setPedido] = useState([]);
  const [cliente, setCliente] = useState({
    nome: "",
    endereco: "",
    telefone: "",
    pagamento: "",
    cep: "",
  });
  const [errosCliente, setErrosCliente] = useState({});
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [statusPedido, setStatusPedido] = useState("");
  const statusAtualRef = useRef("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");

// CORRETO — localização exata da Roots Burguer
const rootsLat = -23.1947927;
const rootsLon = -45.8643073;

  const [valorFrete, setValorFrete] = useState(0);
    const [valorFinal, setValorFinal] = useState(0);
  const [modalPix, setModalPix] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState({ mensagem: "", tipo: "" });
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [statusAnterior, setStatusAnterior] = useState("");
  const [mostrarAlertaStatus, setMostrarAlertaStatus] = useState(false);
  const [mostrarDrawerPedido, setMostrarDrawerPedido] = useState(false);
  
  // Função para tocar som de sucesso
  const tocarSomSucesso = () => {
    try {
      const audio = new Audio();
      audio.volume = 0.3;
      audio.play();
    } catch (error) {
      console.log("Som não pôde ser reproduzido:", error);
    }
  };

  // Função para fazer scroll até o resumo do pedido
  const scrollParaResumo = () => {
    const resumoElement = document.getElementById("resumo-pedido");
    if (resumoElement) {
      resumoElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  

  // Função para verificar área de entrega e calcular frete
  const verificarAreaEntrega = async () => {
    const apiKey = import.meta.env.VITE_REACT_APP_OPENCAGE_KEY;
    const enderecoData = await buscarEnderecoPorCep(cliente.cep);

    if (!enderecoData || !enderecoData.cidade || !enderecoData.estado) {
      console.warn("❌ Endereço incompleto");
      return { dentroDoRaio: false, frete: 0 };
    }
    
    const enderecoCompleto = `${cliente.endereco}, ${enderecoData.bairro}, ${enderecoData.cidade}, ${enderecoData.estado}, Brasil`;
    
    const coords = await buscarCoordsPorEndereco(enderecoCompleto, apiKey);

    console.log("📍 Coordenadas encontradas para o cliente:");
    console.log("LAT:", coords.lat);
    console.log("LON:", coords.lon);
        
    if (!coords) {
      console.warn("❌ Coordenadas não encontradas para o endereço");
      return { dentroDoRaio: false, frete: 0 };
    }
  
    let distancia = calcularDistanciaKm(rootsLat, rootsLon, coords.lat, coords.lon);
  console.log("📏 Distância em linha reta:", distancia.toFixed(2), "km");

  distancia *= 1; // Aplica correção para se aproximar da rota real
  console.log("🧠 Distância ajustada com fator 1.4x:", distancia.toFixed(2), "km");

  if (distancia <= 6) {
    const frete = Math.ceil(distancia); // R$1 por km, arredondado pra cima
    return { dentroDoRaio: true, frete };
  }

  return { dentroDoRaio: false, frete: 0 };
};
useEffect(() => {
  const calcularFreteAoDigitar = async () => {
    if (cliente.cep.length === 8 && cliente.endereco.length > 5) {
      const { dentroDoRaio, frete } = await verificarAreaEntrega();
      if (dentroDoRaio) {
        setValorFrete(frete);
      } else {
        setValorFrete(0);
      }
    }
  };

  calcularFreteAoDigitar();
}, [cliente.cep, cliente.endereco]);

  // Manter status atualizado na referência
  useEffect(() => {
    statusAtualRef.current = statusPedido;
  }, [statusPedido]);

  // Buscar pedido salvo localmente e escutar atualizações em tempo real
  useEffect(() => {
    const numeroSalvo = localStorage.getItem("pedidoClienteRoots");
    if (numeroSalvo && !numeroPedido) {
      buscarPedidoAtivo(parseInt(numeroSalvo));
    }
  }, []);

  // Limpar notificações automaticamente
  useEffect(() => {
    if (notificacao.mensagem) {
      const timer = setTimeout(() => setNotificacao({ mensagem: "", tipo: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [notificacao]);

  // Fechar alerta de status após 4 segundos
  useEffect(() => {
    if (mostrarAlertaStatus) {
      const timer = setTimeout(() => setMostrarAlertaStatus(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [mostrarAlertaStatus]);

  // Função para buscar pedido ativo e escutar mudanças de status
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
        statusAtualRef.current = data.status;

        onSnapshot(ref, (doc) => {
          if (doc.exists()) {
            const novoStatus = doc.data().status;
            if (novoStatus !== statusAtualRef.current) {
              setStatusAnterior(statusAtualRef.current);
              setStatusPedido(novoStatus);
              statusAtualRef.current = novoStatus;
              setMostrarAlertaStatus(true);
            }
          }
        });
      }
    } catch (error) {
      console.error("Erro ao buscar pedido salvo:", error);
    }
  };

  // Manipuladores para abrir e fechar modal de produto
  const abrirModal = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };
  const fecharModal = () => {
    setProdutoSelecionado(null);
    setModalAberto(false);
  };

  // Adicionar produto ao pedido
  const adicionarProduto = (produto) => {
    setPedido((prevPedido) => {
      const itemExistente = prevPedido.find(
        (item) => item.nome === produto.nome && item.observacao === produto.observacao
      );
      if (itemExistente) {
        return prevPedido.map((item) =>
          item.nome === produto.nome && item.observacao === produto.observacao
            ? { ...item, quantidade: item.quantidade + produto.quantidade }
            : item
        );
      }
      const novoPedido = [...prevPedido, produto];
      if (novoPedido.length === 1) {
        setMostrarDrawerPedido(true);
      }
      return novoPedido;
    });

    setNotificacao({
      mensagem: `${produto.quantidade}× ${produto.nome} adicionado ao pedido!`,
      tipo: "sucesso",
    });

    fecharModal();
  };

  // Alterar quantidade de produto no pedido
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

  // Total do pedido
  const total = pedido.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  // Filtrar produtos por categoria
  const produtosFiltrados = categoriaAtiva === "todos" 
    ? produtos 
    : produtos.filter(produto => produto.categoria === categoriaAtiva);

  // Categorias disponíveis
  const categorias = [
    { id: "todos", nome: "Todos", emoji: "🍽️" },
    { id: "burgers", nome: "Hambúrguers", emoji: "🍔" },
    { id: "hamburguer", nome: "Combos", emoji: "🍟" },
    { id: "batatas", nome: "Batatas", emoji: "🍟" },
    { id: "bebidas", nome: "Bebidas", emoji: "🥤" },
  ];

  // 👇 Mapeamento dos ingredientes por produto
const receitas = {
  "Roots Burguer": {
    "Pão Brioche": 1,
    "Hambúrguer 120g": 1,
    "Cheddar Fatiado": 1,
    "Maionese da Casa": 1,
  },
  "Roots Bacon": {
    "Pão Brioche": 1,
    "Hambúrguer 120g": 1,
    "Cheddar Fatiado": 1,
    "Bacon Crocante": 1,
    "Baconese": 1,
  },
  "Roots Salada": {
    "Pão Brioche": 1,
    "Hambúrguer 120g": 1,
    "Queijo": 1,
    "Alface": 1,
    "Tomate": 1,
    "Molho Verde": 1,
  },
  "Combo Roots Burguer": {
    "Pão Brioche": 1,
    "Hambúrguer 120g": 1,
    "Cheddar Fatiado": 1,
    "Maionese da Casa": 1,
    "Batata": 1,
    "Refri Lata": 1,
  },
  "Combo Roots Bacon": {
    "Pão Brioche": 1,
    "Hambúrguer 120g": 1,
    "Cheddar Fatiado": 1,
    "Bacon Crocante": 1,
    "Baconese": 1,
    "Batata": 1,
    "Refri Lata": 1,
  },
  "Combo Roots Salada": {
    "Pão Brioche": 1,
    "Hambúrguer 120g": 1,
    "Queijo": 1,
    "Alface": 1,
    "Tomate": 1,
    "Molho Verde": 1,
    "Batata": 1,
    "Refri Lata": 1,
  }
};



  // Descontar ingredientes do estoque conforme receitas
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

    if (!cliente.nome.trim()) erros.nome = "Nome é obrigatório";
    if (!cliente.cep.trim()) erros.cep = "CEP é obrigatório";
    else if (cliente.cep.length < 8) erros.cep = "CEP inválido";
    if (!cliente.endereco.trim()) erros.endereco = "Endereço é obrigatório";
    if (!cliente.telefone.trim()) erros.telefone = "Telefone é obrigatório";
    else if (cliente.telefone.length < 10) erros.telefone = "Telefone inválido";
    if (!cliente.pagamento) erros.pagamento = "Forma de pagamento é obrigatória";

    setErrosCliente(erros);
    return Object.keys(erros).length === 0;
  };

  // Abrir modal de confirmação de pedido
  const abrirConfirmacao = async () => {
    if (pedido.length === 0) {
      setNotificacao({ mensagem: "Adicione produtos ao pedido antes de finalizar.", tipo: "erro" });
      return;
    }

    if (!validarFormulario()) {
      setNotificacao({ mensagem: "Preencha todos os campos obrigatórios.", tipo: "erro" });
      return;
    }

    const { dentroDoRaio, frete } = await verificarAreaEntrega();

    if (!dentroDoRaio) {
      setNotificacao({ mensagem: "Desculpe, sua região está fora da área de entrega.", tipo: "erro" });
      return;
    }

    setValorFrete(frete);
    setValorFinal(total + frete);
    setModalConfirmacao(true);
  };

  // Finalizar pedido e salvar no Firestore
  const finalizarPedido = async () => {
    try {
      setCarregando(true);

      const tipoPagamento = cliente.pagamento;
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
      console.log("📦 Enviando para o Firestore:", {
        pedido,
        cliente,
        total,
        valorFrete,
        data: new Date().toISOString(),
      });
      pedido.forEach((item, i) => {
        console.log(`🛠️ Item ${i}:`, item);
      });
      
      const pedidoTratado = pedido.map(item => {
        return {
          ...item,
          sabor: item.sabor || "", // garante string vazia em vez de undefined
          observacao: item.observacao || "",
          adicionais: item.adicionais || [],
        };
      });
      
// Gera novo número de pedido
const vendasSnapshot = await getDocs(collection(db, "vendas"));
const novoIdPedido = String(vendasSnapshot.size + 1).padStart(3, "0");

// Cria o documento já com todos os dados
const docRef = await addDoc(collection(db, "vendas"), {
  idPedido: novoIdPedido,              // Para exibir com 3 dígitos
  numeroPedido: novoNumeroPedido,     // Para controle interno
  status: "Recebido",
  pedido: pedidoTratado,
  cliente,
  total,
  valorFrete,
  data: new Date().toISOString(),
});


      

      localStorage.setItem("pedidoClienteRoots", novoNumeroPedido);

      setNumeroPedido(novoNumeroPedido);
      setPedido([]);
      setCliente({
        nome: "",
        endereco: "",
        telefone: "",
        pagamento: "",
        cep: "",
      });
      setModalConfirmacao(false);

      setNotificacao({
        mensagem: `Pedido #${String(novoNumeroPedido).padStart(3, "0")} registrado com sucesso!`,
        tipo: "sucesso",
      });

      // Tocar som de sucesso
      tocarSomSucesso();

      if (tipoPagamento === "Pix") {
        setModalPix(true);
      }

      await descontarIngredientes(pedido);
      localStorage.setItem("pedidoClienteRoots", novoNumeroPedido);
      setNumeroPedido(novoNumeroPedido);
      
      // Escuta direta e imediata no doc criado
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const novoStatus = doc.data().status;
          if (novoStatus !== statusAtualRef.current) {
            setStatusAnterior(statusAtualRef.current);
            setStatusPedido(novoStatus);
            statusAtualRef.current = novoStatus;
           setMostrarAlertaStatus(true); 
          }
        }
      });
      
// limpa formulário etc...

    } catch (erro) {
      console.error("Erro ao registrar pedido:", erro);
      setNotificacao({ mensagem: "Erro ao registrar pedido. Tente novamente.", tipo: "erro" });
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
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black animate-pulse-slow text-white font-barlow relative">
      
      {/* Botão Ver Pedido fixo no topo */}
      {pedido.length > 0 && numeroPedido !== null && numeroPedido !== 0 && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={scrollParaResumo} 
            className="bg-yellow-500 text-zinc-900 font-bold px-4 py-2 rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300 ease-in-out flex items-center space-x-2"
          >
            <span>🛒</span>
            <span className="bg-zinc-900 text-yellow-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {pedido.length}
            </span>
          </button>
        </div>
      )}

      {/* Notificações */}
      {notificacao.mensagem && (
        <div
          className={`fixed top-4 right-4 z-50 p-3 rounded-md shadow-lg max-w-xs animate-fade-in ${
            notificacao.tipo === "sucesso" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <p className="text-white text-sm">{notificacao.mensagem}</p>
        </div>
      )}

      {/* Landing Page Inicial */}
      {!numeroPedido && (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black animate-pulse opacity-30"></div>
          <div className="relative z-10">
          <img src={logo} alt="Logo Roots Burguer" className="w-24 h-auto mb-1 max-h-16 object-contain" />
          <h1 className="text-3xl font-bold mb-4 text-yellow-500">Roots Burguer</h1>
            <p className="text-xl font-semibold mb-8 text-gray-300 max-w-md">
              Escolha seu combo favorito e receba em casa rapidinho 🍔⚡
            </p>
            <button
              className="bg-yellow-500 text-zinc-900 font-bold py-4 px-10 rounded-full text-xl shadow-lg hover:bg-yellow-400 hover:scale-105 transition-all duration-300 ease-in-out transform"
              onClick={() => setNumeroPedido(0)}
            >
              Fazer Pedido
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal do Pedido (após passar a landing) */}
      {numeroPedido !== null && (
        <div className="container mx-auto p-3 pb-20">
          <header className="flex flex-col items-center justify-center py-2">
<img
  src={logo}
  alt="Logo Roots Burguer"
  className="w-28 h-auto max-h-20 object-contain"
  style={{ maxWidth: "120px", height: "auto" }}
/>
            <h1 className="text-sm font-bold text-yellow-500">Cardápio</h1>
          </header>

          {/* Navegação de Categorias Fixa */}
          <div className="sticky top-0 z-30 bg-zinc-900 py-2">
            <div className="flex overflow-x-auto space-x-3 p-2 scrollbar-hide">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaAtiva(categoria.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-full font-semibold text-sm transition-all duration-300 ease-in-out ${
                    categoriaAtiva === categoria.id
                      ? "bg-yellow-500 text-zinc-900"
                      : "bg-zinc-800 text-white hover:bg-zinc-600 hover:text-yellow-300"
                  }`}
                >
                  <span className="text-base">{categoria.emoji}</span>
                  <span className="whitespace-nowrap">{categoria.nome}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Carrossel de Promoções */}
          <div className="carrossel-promocoes mb-4 rounded-lg overflow-hidden shadow-lg mt-4">
            <Slider {...settings}>
              {promocoes.map((promo, index) => (
                <div key={index}>
                  <img src={promo.imagem} alt={promo.alt} className="w-full h-40 object-cover" loading="lazy" />
                </div>
              ))}
            </Slider>
          </div>

          <main className="flex flex-col">
            <div>
              {/* Grid de Produtos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {produtosFiltrados.map((produto) => (
                  <CardProduto key={produto.id} produto={produto} onClick={abrirModal} />
                ))}
              </div>
            </div>

            {/* Adicionando um badge de 'Novo' ou 'Promoção' ao CardProduto. Isso deve ser implementado dentro do componente CardProduto. */}
            {/* Reduzindo a descrição visível no card para 1 linha e exibindo completa no modal. Isso deve ser implementado dentro do componente CardProduto. */}

            <div id="resumo-pedido" className="w-full mt-4 p-4 bg-zinc-800 rounded-lg shadow-lg">
             

            <div id="formulario-cliente">
  <FormularioCliente cliente={cliente} setCliente={setCliente} erros={errosCliente} />
</div>

<div id="resumo-pedido">
  <ResumoPedido pedido={pedido} total={total} valorFrete={valorFrete} onAjustarQuantidade={alterarQuantidade} />
</div>


              <button
                className={`btn-venda w-full py-4 text-lg bg-yellow-500 text-zinc-900 font-bold rounded-md shadow-lg hover:bg-yellow-400 transition-all duration-300 ease-in-out ${carregando ? "opacity-70 cursor-not-allowed" : ""}`}
                onClick={abrirConfirmacao}
                disabled={carregando}
              >
                {carregando ? "Processando..." : "Confirmar Pedido"}
              </button>
              
              {numeroPedido && <StatusPedido numeroPedido={numeroPedido} status={statusPedido} />}
            </div>
          </main>
        </div>
      )}

      {/* Botão flutuante Ver Pedido para mobile */}
      {pedido.length > 0 && numeroPedido !== null && numeroPedido !== 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 p-4 shadow-lg md:hidden z-40">
          <button
            className="w-full bg-yellow-500 text-zinc-900 font-bold py-3 rounded-md text-lg shadow-lg hover:bg-yellow-600 transition-all duration-300 ease-in-out flex items-center justify-between"
            onClick={() => setMostrarDrawerPedido(true)}
          >
            <span>Ver Pedido ({pedido.length} {pedido.length === 1 ? 'item' : 'itens'})</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>
      )}

      {/* Drawer do Pedido para Mobile */}
      {mostrarDrawerPedido && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 rounded-t-lg max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-yellow-500">Seu Pedido</h2>
              <button
                onClick={() => setMostrarDrawerPedido(false)}
                className="text-white hover:text-yellow-500 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <ResumoPedido pedido={pedido} total={total} valorFrete={valorFrete} onAjustarQuantidade={alterarQuantidade} />
              <FormularioCliente cliente={cliente} setCliente={setCliente} erros={errosCliente} />
              <button
                className={`w-full py-3 text-lg bg-yellow-500 text-zinc-900 font-bold rounded-md shadow-lg hover:bg-yellow-600 transition-all duration-300 ease-in-out mt-4 ${carregando ? "opacity-70 cursor-not-allowed" : ""}`}
                onClick={() => {
                  setMostrarDrawerPedido(false);
                  abrirConfirmacao();
                }}
                disabled={carregando}
              >
                {carregando ? "Processando..." : "Confirmar Pedido"}
              </button>
            </div>
          </div>
        </div>
      )}


      {modalAberto && produtoSelecionado && (
        <ProdutoModal produto={produtoSelecionado} onClose={fecharModal} onConfirm={adicionarProduto} />
      )}

      {modalConfirmacao && (
        <ModalConfirmacaoPedido
          pedido={pedido}
          cliente={cliente}
          total={total}
          valorFrete={valorFrete}
          onFechar={() => setModalConfirmacao(false)}
          onConfirmar={finalizarPedido}
          carregando={carregando}
        />
      )}

      {modalPix && (
        <ModalPagamentoPix
          total={valorFinal}
          onFechar={() => setModalPix(false)}
        />
      )}

    </div>
  );
}

export default PedidoCliente;




/* Estilos CSS customizados para melhorar a UX */
<style jsx>{`
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 3s infinite;
  }
  
  @keyframes bounce-slow {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s ease-in-out infinite;
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
`}</style>

