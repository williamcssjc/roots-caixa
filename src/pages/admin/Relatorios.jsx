import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../layout.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Relatorios() {
  const [vendas, setVendas] = useState([]);
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [loading, setLoading] = useState(false);

  // Cores para gráfico de pizza
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#3366AA"];

  // Buscar vendas com filtro de datas
  const carregarVendas = async () => {
    setLoading(true);
    try {
      const vendasRef = collection(db, "vendas");
      let q;

      if (dataInicial && dataFinal) {
        // Ajustar datas para timestamp
        const dtIni = new Date(dataInicial);
        dtIni.setHours(0, 0, 0, 0);
        const dtFim = new Date(dataFinal);
        dtFim.setHours(23, 59, 59, 999);

        q = query(
          vendasRef,
          where("data", ">=", dtIni.toISOString()),
          where("data", "<=", dtFim.toISOString()),
          orderBy("data", "desc")
        );
      } else {
        // Sem filtro de data, pega as últimas 50 vendas
        q = query(vendasRef, orderBy("data", "desc"), limit(50));
      }

      const snapshot = await getDocs(q);
      const listaVendas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVendas(listaVendas);
    } catch (erro) {
      console.error("Erro ao carregar vendas:", erro);
    } finally {
      setLoading(false);
    }
  };

  // Recarregar vendas ao mudar o filtro
  useEffect(() => {
    carregarVendas();
  }, [dataInicial, dataFinal]);

  // Resumo geral
  const totalVendido = vendas.reduce((acc, v) => acc + Number(v.total), 0);
  const totalPedidos = vendas.length;
  const totalItens = vendas.reduce(
    (acc, v) => acc + (v.itens ? v.itens.length : 0),
    0
  );

  // Dados para gráfico: vendas por dia
  const vendasPorDia = {};
  vendas.forEach(v => {
    const dia = new Date(v.data).toLocaleDateString();
    vendasPorDia[dia] = (vendasPorDia[dia] || 0) + Number(v.total);
  });
  const dataGraficoVendas = Object.entries(vendasPorDia).map(([dia, total]) => ({
    dia,
    total,
  }));

  // Dados para gráfico: produtos mais vendidos
  const produtosContagem = {};
  vendas.forEach(v => {
    if (v.itens) {
      v.itens.forEach(item => {
        produtosContagem[item.nome] = (produtosContagem[item.nome] || 0) + 1;
      });
    }
  });
  const dataGraficoProdutos = Object.entries(produtosContagem).map(
    ([nome, quantidade]) => ({ name: nome, value: quantidade })
  );

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
        <h1>RELATÓRIOS</h1>

        <section style={{ marginBottom: 20 }}>
          <h2>Filtrar por data</h2>
          <label>
            Data Inicial:{" "}
            <input
              type="date"
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
            />
          </label>
          <label style={{ marginLeft: 20 }}>
            Data Final:{" "}
            <input
              type="date"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
            />
          </label>
          <button onClick={carregarVendas} style={{ marginLeft: 20 }}>
            Atualizar
          </button>
        </section>

        <section>
          <h2>Resumo Geral</h2>
          <p><strong>Total Vendido:</strong> R$ {totalVendido.toFixed(2)}</p>
          <p><strong>Total de Pedidos:</strong> {totalPedidos}</p>
          <p><strong>Total de Itens Vendidos:</strong> {totalItens}</p>
        </section>

        <section style={{ marginTop: 20 }}>
          <h2>Vendas Detalhadas</h2>
          {loading ? (
            <p>Carregando vendas...</p>
          ) : vendas.length === 0 ? (
            <p>Nenhuma venda encontrada para o período selecionado.</p>
          ) : (
            <table border="1" cellPadding="5" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
              <thead>
                <tr>
                  <th>Número Pedido</th>
                  <th>Data</th>
                  <th>Total (R$)</th>
                  <th>Quantidade Itens</th>
                  <th>Itens</th>
                </tr>
              </thead>
              <tbody>
                {vendas.map((v) => (
                  <tr key={v.id}>
                    <td>#{String(v.numeroPedido).padStart(3, "0")}</td>
                    <td>{new Date(v.data).toLocaleString()}</td>
                    <td>{Number(v.total).toFixed(2)}</td>
                    <td>{v.itens ? v.itens.length : 0}</td>
                    <td>
                      {v.itens ? (
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {v.itens.map((item, i) => (
                            <li key={i}>{item.nome}</li>
                          ))}
                        </ul>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section style={{ marginTop: 40 }}>
          <h2>Gráfico: Vendas por Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dataGraficoVendas}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total Vendido (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section style={{ marginTop: 40 }}>
          <h2>Gráfico: Produtos Mais Vendidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataGraficoProdutos}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={(entry) => entry.name}
              >
                {dataGraficoProdutos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}

export default Relatorios;
