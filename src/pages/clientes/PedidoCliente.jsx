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
    nome: "Chesse Burguer",
    preco: 20,
    descricao: "Pão brioche, hambúrguer 120g, cheddar fatiado e molho da casa.",
    categoria: "burgers",
  },
  {
    id: 2,
    nome: "Chesse Bacon",
    preco: 25,
    descricao: "Hambúrguer 120g com queijo cheddar, bacon crocante e molho especial.",
    categoria: "burgers",
  },
  {
    id: 3,
    nome: "Chesse Salada",
    preco: 22,
    descricao: "Hambúrguer, queijo, alface, tomate e molho caseiro refrescante.",
    categoria: "burgers",
  },
  { id: 4, nome: "Batata", preco: 10, descricao: "Porção de batatas fritas", categoria: "batatas" },
  { id: 5, nome: "Refri Lata", preco: 8, descricao: "Refrigerante em lata", categoria: "bebidas" },
  { id: 6, nome: "Combo Roots", preco: 28, descricao: "...", categoria: "combos" },
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
  const rootsLat = -23.2234; // Localização Roots
  const rootsLon = -45.9001;
  const [valorFrete, setValorFrete] = useState(0);
  const [modalPix, setModalPix] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState({ mensagem: "", tipo: "" });
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [statusAnterior, setStatusAnterior] = useState("");
  const [mostrarAlertaStatus, setMostrarAlertaStatus] = useState(false);

  // Função para verificar área de entrega e calcular frete
  const verificarAreaEntrega = async () => {
    const apiKey = import.meta.env.VITE_REACT_APP_OPENCAGE_KEY;
    const endereco = await buscarEnderecoPorCep(cliente.cep);

    if (!endereco) {
      console.warn("❌ Endereço não encontrado pelo CEP");
      return { dentroDoRaio: false, frete: 0 };
    }

    const coords = await buscarCoordsPorEndereco(endereco, apiKey);

    if (!coords) {
      console.warn("❌ Coordenadas não encontradas pelo endereço");
      return { dentroDoRaio: false, frete: 0 };
    }

    const distancia = calcularDistanciaKm(rootsLat, rootsLon, coords.lat, coords.lon);
    console.log("📏 Distância calculada:", distancia.toFixed(2), "km");

    if (distancia <= 3) return { dentroDoRaio: true, frete: 5 };
    if (distancia <= 6) return { dentroDoRaio: true, frete: 7 };

    return { dentroDoRaio: false, frete: 0 };
  };

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
      return [...prevPedido, produto];
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
        cep: "",
      });
      setModalConfirmacao(false);

      setNotificacao({
        mensagem: `Pedido #${String(novoNumeroPedido).padStart(3, "0")} registrado com sucesso!`,
        tipo: "sucesso",
      });

      if (tipoPagamento === "Pix") {
        setModalPix(true);
      }

      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setStatusPedido(doc.data().status);
        }
      });
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
    <div className="pagina-caixa">
      

      <header className="header-cliente">
        <p className="boas-vindas">Bem-vindo ao Roots Burguer</p>
      </header>

      <header className="cabecalho">
        <img src={logo} alt="Logo Roots Burguer" className="logo" />
      </header>

      {notificacao.mensagem && (
        <div
          className={`fixed top-20 right-4 z-50 p-3 rounded-md shadow-lg max-w-xs animate-fade-in ${
            notificacao.tipo === "sucesso" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <p className="text-white">{notificacao.mensagem}</p>
        </div>
      )}

      <div className="carrossel-promocoes">
        <Slider {...settings}>
          {promocoes.map((promo, index) => (
            <div key={index}>
              <img src={promo.imagem} alt={promo.alt} className="imagem-promocao" />
            </div>
          ))}
        </Slider>
      </div>

      <main className="conteudo">
        <h1>Fazer Pedido</h1>

        <div className="flex flex-col md:flex-row md:gap-6">
          <div className="md:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {produtos.map((produto) => (
                <CardProduto key={produto.id} produto={produto} onClick={abrirModal} />
              ))}
            </div>
          </div>

          <div className="md:w-1/3">
            <ResumoPedido pedido={pedido} total={total} valorFrete={valorFrete} onAjustarQuantidade={alterarQuantidade} />

            <FormularioCliente cliente={cliente} setCliente={setCliente} erros={errosCliente} />

            <button
              className={`btn-venda w-full py-3 text-lg ${carregando ? "opacity-70 cursor-not-allowed" : ""}`}
              onClick={abrirConfirmacao}
              disabled={carregando}
            >
              {carregando ? "Processando..." : "Confirmar Pedido"}
            </button>

            {numeroPedido && <StatusPedido numeroPedido={numeroPedido} status={statusPedido} />}
          </div>
        </div>
      </main>

      <AlertaStatusPedido status={statusPedido} visivel={mostrarAlertaStatus} onFechar={() => setMostrarAlertaStatus(false)} />

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

      {modalPix && <ModalPagamentoPix total={total + valorFrete} onFechar={() => setModalPix(false)} />}
    </div>
  );
}

export default PedidoCliente;
