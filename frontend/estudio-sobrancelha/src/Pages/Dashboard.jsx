import { useEffect, useState } from "react";
import api from "../api/api";
import "../styles/dashboard.css";

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  return (
    <div className="dashboard-container">
      <img src="/Logo.png" className="logo" />

      <h1>Painel de Agendamentos</h1>

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
