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
  onSnapshot,
} from "firebase/firestore";
import "../../layout.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import receitas from "../../data/receitas";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Componente para o modal de personalização do produto
const ProdutoModal = ({ produto, onClose, onConfirm }) => {
  const [observacao, setObservacao] = useState("");
  const [pontoBlend, setPontoBlend] = useState("");
  const [opcionaisSelecionados, setOpcionaisSelecionados] = useState([]);
  const [quantidade, setQuantidade] = useState(1);
  const [saborRefriSelecionado, setSaborRefriSelecionado] = useState("");
  
  // Determinando o tipo de produto
  const ehHamburguer = produto?.nome.toLowerCase().includes("burguer") || 
                       produto?.nome.toLowerCase().includes("bacon") || 
                       produto?.nome.toLowerCase().includes("salada");
  
  const ehRefri = produto?.nome.toLowerCase().includes("refri") || 
                 produto?.nome.toLowerCase().includes("lata");
  
  const ehBatata = produto?.nome.toLowerCase().includes("batata");
  
  // Opcionais específicos por tipo de produto
  const opcionaisHamburguer = [
    { nome: "Bacon Extra", preco: 3 },
    { nome: "+1 Blend", preco: 5 },
    { nome: "Cheddar Extra", preco: 2 },
  ];
  
  const opcionaisBatata = [
    { nome: "Cheddar Extra", preco: 2 },
    { nome: "Bacon Extra", preco: 3 },
  ];
  
  // Sabores de refrigerante
  const saboresRefri = [
    "Coca-Cola",
    "Guaraná",
    "Fanta Laranja",
    "Fanta Uva",
    "Soda"
  ];
  
  // Determina quais opcionais mostrar com base no tipo de produto
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
      .filter(op => opcionaisSelecionados.includes(op.nome))
      .reduce((acc, op) => acc + op.preco, 0);
    
    return (precoBase + precoOpcionais) * quantidade;
  };
  
  const handleConfirm = () => {
    // Validar seleção de sabor para refrigerantes
    if (ehRefri && !saborRefriSelecionado) {
      alert("Por favor, selecione um sabor de refrigerante.");
      return;
    }
    
    const adicionais = getOpcionais().filter((op) =>
      opcionaisSelecionados.includes(op.nome)
    );
    
    // Gera observação padronizada
    const observacaoArray = [
      observacao.trim() ? observacao.trim() : null,
      ehHamburguer && pontoBlend ? `ponto: ${pontoBlend}` : null,
      ehRefri && saborRefriSelecionado ? `sabor: ${saborRefriSelecionado}` : null,
      ...adicionais.map((op) => `+ ${op.nome}`)
    ].filter(Boolean);
    
    const observacaoFinal = observacaoArray.length > 0 
      ? observacaoArray.join(" | ") 
      : "";
    
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
              >
                -
              </button>
              <span className="px-4 py-1 text-white">{quantidade}</span>
              <button 
                className="px-3 py-1 text-white hover:bg-gray-700 rounded-r-md"
                onClick={() => setQuantidade(quantidade + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        {/* Opções específicas para hambúrgueres */}
        {ehHamburguer && (
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Ponto do Blend:</label>
            <div className="grid grid-cols-3 gap-2">
              {["Mal passado", "Ao ponto", "Bem passado"].map((ponto) => (
                <button
                  key={ponto}
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    pontoBlend === ponto 
                      ? "bg-amber-500 text-black" 
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => setPontoBlend(ponto)}
                >
                  {ponto}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Opções específicas para refrigerantes */}
        {ehRefri && (
          <div className="mb-4">
            <label className="block text-white font-medium mb-2">Sabor:</label>
            <div className="grid grid-cols-1 gap-2">
              {saboresRefri.map((sabor) => (
                <button
                  key={sabor}
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    saborRefriSelecionado === sabor 
                      ? "bg-amber-500 text-black" 
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  }`}
                  onClick={() => setSaborRefriSelecionado(sabor)}
                >
                  {sabor}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Opcionais apenas se houver para o produto */}
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
          >
            Cancelar
          </button>
          <button 
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md transition-colors"
            onClick={handleConfirm}
          >
            Adicionar ao Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para o item do pedido
const ItemPedido = ({ item, onAjustarQuantidade }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-3 mb-3">
      <div className="flex justify-between items-center mb-1">
        <div className="font-bold text-white">{item.nome}</div>
        <div className="text-amber-500 font-bold">R$ {(item.preco * item.quantidade).toFixed(2)}</div>
      </div>
      
      {item.observacao && (
        <div className="text-sm text-gray-400 mb-2 italic">
          {item.observacao}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-300">
          R$ {item.preco.toFixed(2)} × {item.quantidade}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            onClick={() => onAjustarQuantidade(item.nome, -1, item.observacao)}
          >
            -
          </button>
          <span className="text-white w-6 text-center">{item.quantidade}</span>
          <button 
            className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            onClick={() => onAjustarQuantidade(item.nome, 1, item.observacao)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para o resumo do pedido (layout novo conforme imagem 3)
const ResumoPedido = ({ pedido, total, onAjustarQuantidade }) => {
  if (pedido.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 mb-6 text-center">
        <p className="text-gray-400">Seu pedido está vazio</p>
        <p className="text-sm text-gray-500 mt-2">Selecione produtos para adicionar</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 mb-6">
      <h3 className="text-xl font-bold text-amber-500 mb-4">Seu Pedido:</h3>
      
      <div className="max-h-80 overflow-y-auto mb-4">
        {pedido.map((item, i) => (
          <div key={i} className="mb-4 border-b border-gray-800 pb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-lg font-bold text-amber-500">{item.nome}</div>
              <div className="text-lg font-bold text-white">R$ {(item.preco * item.quantidade).toFixed(2)}</div>
            </div>
            
            {item.observacao && (
              <div className="text-sm text-gray-400 mb-2">
                {item.observacao}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-300">
                R$ {item.preco.toFixed(2)} × {item.quantidade}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                  onClick={() => onAjustarQuantidade(item.nome, -1, item.observacao)}
                >
                  -
                </button>
                <span className="text-white w-6 text-center">{item.quantidade}</span>
                <button 
                  className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                  onClick={() => onAjustarQuantidade(item.nome, 1, item.observacao)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-700">
        <span className="text-lg font-bold text-white">Total:</span>
        <span className="text-xl font-bold text-amber-500">R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
};

// Componente para o formulário do cliente
const FormularioCliente = ({ cliente, setCliente, erros }) => {
  return (
    <div className="formulario-cliente">
      <h3>Dados do Cliente:</h3>
      
      <div className="mb-3">
        <input
          type="text"
          placeholder="Nome completo *"
          value={cliente.nome}
          onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
          className={erros.nome ? "border-red-500" : ""}
        />
        {erros.nome && <div className="text-red-500 text-sm mt-1">{erros.nome}</div>}
      </div>
      
      <div className="mb-3">
        <input
          type="text"
          placeholder="Endereço completo *"
          value={cliente.endereco}
          onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
          className={erros.endereco ? "border-red-500" : ""}
        />
        {erros.endereco && <div className="text-red-500 text-sm mt-1">{erros.endereco}</div>}
      </div>
      
      <div className="mb-3">
        <input
          type="text"
          placeholder="Telefone *"
          value={cliente.telefone}
          onChange={(e) => {
            // Máscara simples para telefone: apenas números
            const value = e.target.value.replace(/\D/g, '');
            setCliente({ ...cliente, telefone: value });
          }}
          className={erros.telefone ? "border-red-500" : ""}
        />
        {erros.telefone && <div className="text-red-500 text-sm mt-1">{erros.telefone}</div>}
      </div>
      
      <div className="mb-3">
        <select
          value={cliente.pagamento}
          onChange={(e) => setCliente({ ...cliente, pagamento: e.target.value })}
          className={erros.pagamento ? "border-red-500" : ""}
        >
          <option value="">Forma de Pagamento *</option>
          <option value="Pix">Pix</option>
          <option value="Cartão">Cartão</option>
          <option value="Dinheiro">Dinheiro</option>
        </select>
        {erros.pagamento && <div className="text-red-500 text-sm mt-1">{erros.pagamento}</div>}
      </div>
      
      <div className="text-sm text-gray-400 mt-2">* Campos obrigatórios</div>
    </div>
  );
};

// Componente para o status do pedido
const StatusPedido = ({ numeroPedido, status }) => {
  if (!numeroPedido) return null;
  
  const getStatusColor = () => {
    switch (status) {
      case "Recebido": return "bg-blue-500";
      case "Em Preparo": return "bg-yellow-500";
      case "Saiu para Entrega": return "bg-purple-500";
      case "Entregue": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-bold text-amber-500 mb-2">
        Pedido #{String(numeroPedido).padStart(3, "0")}
      </h3>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`}></div>
        <p className="text-white">{status || "Aguardando atualização..."}</p>
      </div>
    </div>
  );
};

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
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [notificacao, setNotificacao] = useState({ mensagem: "", tipo: "" });
  const [modalConfirmacao, setModalConfirmacao] = useState(false);

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

  // Limpar notificação após 3 segundos
  useEffect(() => {
    if (notificacao.mensagem) {
      const timer = setTimeout(() => {
        setNotificacao({ mensagem: "", tipo: "" });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notificacao]);

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
      <nav className="menu-navegacao">
        <Link to="/cliente/pedido"><button>Pedido</button></Link>
        <Link to="/cliente/cadastro"><button>Cadastro</button></Link>
        <Link to="/cliente/carrinho"><button>Carrinho</button></Link>
        <Link to="/cliente/promocoes"><button>Promoções</button></Link>
      </nav>

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

      {/* Modal de personalização */}
      {modalAberto && produtoSelecionado && (
        <ProdutoModal 
          produto={produtoSelecionado}
          onClose={fecharModal}
          onConfirm={adicionarProduto}
        />
      )}
      
      {/* Modal de confirmação */}
      {modalConfirmacao && (
        <div className="modal" onClick={() => setModalConfirmacao(false)}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-amber-500 mb-4">Confirmar Pedido</h3>
            
            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <h4 className="font-bold text-white mb-2">Itens do Pedido:</h4>
              <ul className="space-y-1 mb-3">
                {pedido.map((item, i) => (
                  <li key={i} className="text-gray-300">
                    {item.quantidade}× {item.nome}
                    {item.observacao && <span className="text-sm text-gray-400"> ({item.observacao})</span>}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between border-t border-gray-600 pt-2">
                <span className="font-bold text-white">Total:</span>
                <span className="font-bold text-amber-500">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-3 mb-4">
              <h4 className="font-bold text-white mb-2">Dados de Entrega:</h4>
              <p className="text-gray-300"><span className="text-gray-400">Nome:</span> {cliente.nome}</p>
              <p className="text-gray-300"><span className="text-gray-400">Endereço:</span> {cliente.endereco}</p>
              <p className="text-gray-300"><span className="text-gray-400">Telefone:</span> {cliente.telefone}</p>
              <p className="text-gray-300"><span className="text-gray-400">Pagamento:</span> {cliente.pagamento}</p>
            </div>
            
            <div className="flex gap-3">
              <button 
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md"
                onClick={() => setModalConfirmacao(false)}
              >
                Voltar
              </button>
              <button 
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-md"
                onClick={finalizarPedido}
                disabled={carregando}
              >
                {carregando ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PedidoCliente;
