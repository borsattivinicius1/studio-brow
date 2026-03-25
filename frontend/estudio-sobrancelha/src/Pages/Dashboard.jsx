import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [agendamentos, setAgendamentos] = useState([]);
  const token = localStorage.getItem("token");

  async function carregarAgendamentos() {
    try {
      const res = await api.get("/agendamentos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ordenados = res.data.sort((a, b) => {
        return new Date(a.data) - new Date(b.data);
      });

      setAgendamentos(ordenados);
    } catch (err) {
      console.log(err);
    }
  }

  async function aprovar(id) {
    try {
      await api.put(
        `/agendamentos/aprovar/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      carregarAgendamentos();
    } catch (err) {
      console.log(err);
    }
  }

  async function cancelar(id) {
    try {
      await api.put(
        `/agendamentos/cancelar/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      carregarAgendamentos();
    } catch (err) {
      console.log(err);
    }
  }

  async function finalizar(id) {
    try {
      await api.patch(
        `/agendamentos/finalizar/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      carregarAgendamentos();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const carregar = async () => {
      try {
        await carregarAgendamentos();
      } catch (error) {
        console.log(error);
      }
    };
    carregar();
  }, []);

  /* ===== MÉTRICAS ===== */

  const total = agendamentos.length;

  const finalizados = agendamentos.filter(
    (a) => a.status === "FINALIZADO",
  ).length;

  const cancelados = agendamentos.filter(
    (a) => a.status === "CANCELADO",
  ).length;

  const pendentes = agendamentos.filter((a) => a.status === "PENDENTE").length;

  const faturamento = agendamentos
    .filter((a) => a.status === "FINALIZADO")
    .reduce((total, ag) => {
      return total + (ag.servico?.preco || 0);
    }, 0);

  /* ===== DADOS DO GRÁFICO (SÓ FINALIZADOS) ===== */

  const dadosGrafico = agendamentos
    .filter((a) => a.status === "FINALIZADO")
    .map((ag) => {
      const data = new Date(ag.data).toLocaleDateString();
      return {
        data,
        valor: ag.servico?.preco || 0,
      };
    });

  return (
    <div className="dashboard-container">
      <img src="/Logo.png" className="logo" />

      <h1>Painel de Agendamentos</h1>

      {/* CARDS */}
      <div className="dashboard-cards">
        <div className="card-dashboard">
          <h3>Serviços</h3>
          <p>{total}</p>
        </div>

        <div className="card-dashboard">
          <h3>Pendentes</h3>
          <p>{pendentes}</p>
        </div>

        <div className="card-dashboard">
          <h3>Finalizados</h3>
          <p>{finalizados}</p>
        </div>

        <div className="card-dashboard">
          <h3>Cancelados</h3>
          <p>{cancelados}</p>
        </div>

        <div className="card-dashboard">
          <h3>Total</h3>
          <p>R$ {faturamento}</p>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="grafico">
        <h2>Faturamento por Dia</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosGrafico}>
            <defs>
              <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <XAxis dataKey="data" stroke="#888" tick={{ fill: "#bbb" }} />

            <YAxis stroke="#888" tick={{ fill: "#bbb" }} />

            <Tooltip
              cursor={{ fill: "rgba(168,85,247,0.15)" }}
              contentStyle={{
                backgroundColor: "#0f0f14",
                border: "1px solid #2a2a35",
                borderRadius: "10px",
                color: "#fff",
              }}
              labelStyle={{ color: "#a855f7" }}
            />

            <Bar dataKey="valor" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* LISTA */}

      {agendamentos.length === 0 && (
        <p className="nenhum">Nenhum agendamento encontrado</p>
      )}

      {agendamentos.map((ag) => {
        const data = new Date(ag.data);

        return (
          <div className="agendamento-card" key={ag.id}>
            <div className="info">
              <p>
                <strong>Cliente:</strong> {ag.user?.nome}
              </p>

              <p>
                <strong>Serviço:</strong> {ag.servico?.nome}
              </p>

              <p>
                <strong>Data:</strong> {data.toLocaleDateString()}
              </p>

              <p>
                <strong>Hora:</strong>{" "}
                {data.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className={`status status-${ag.status.toLowerCase()}`}>
                {ag.status}
              </p>
            </div>

            {ag.status === "PENDENTE" && (
              <div className="botoes">
                <button className="btn-aprovar" onClick={() => aprovar(ag.id)}>
                  Aprovar
                </button>

                <button
                  className="btn-cancelar"
                  onClick={() => cancelar(ag.id)}
                >
                  Cancelar
                </button>
              </div>
            )}

            {ag.status === "APROVADO" && (
              <div className="botoes">
                <button
                  className="btn-finalizar"
                  onClick={() => finalizar(ag.id)}
                >
                  Finalizar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
