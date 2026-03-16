import { useState, useEffect, useRef } from "react";
import api from "../api/api.js";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/clientes.css";

export default function Clientes() {
  const [servicos, setServicos] = useState([]);
  const [servicoId, setServicoId] = useState("");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [abrirDropdown, setAbrirDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const horarios = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  async function carregarServicos() {
    const res = await api.get("/servicos");
    setServicos(res.data);
  }

  async function carregarAgendamentos() {
    const res = await api.get("/agendamentos");

    setAgendamentos(res.data);
  }

  useEffect(() => {
    const carregar = async () => {
      try {
        await carregarServicos();
        await carregarAgendamentos();
      } catch (error) {
        console.log(error);
      }
    };

    carregar();
  }, []);

  useEffect(() => {
  function handleClickOutside(event) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setAbrirDropdown(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  async function agendar() {
    if (!servicoId || !hora) {
      alert("Selecione serviço e horário");
      return;
    }

    const dataLocal = new Date(data);

    dataLocal.setHours(Number(hora.split(":")[0]));
    dataLocal.setMinutes(Number(hora.split(":")[1]));
    dataLocal.setSeconds(0);

    const dataFormatada = dataLocal;

    const user = JSON.parse(localStorage.getItem("user"));

    await api.post("/agendamentos", {
      data: dataFormatada,
      userId: user.id,
      servicoId: Number(servicoId),
    });

    alert("Agendamento realizado!");

    carregarAgendamentos();
  }

  async function cancelarAgendamento(id) {
    await api.delete(`/agendamentos/${id}`);
    carregarAgendamentos();
  }

 function horarioOcupado(h) {
  const dataSelecionada = data.toISOString().split("T")[0];

  return agendamentos.some((ag) => {
    if (ag.status === "FINALIZADO" || ag.status === "CANCELADO") {
      return false;
    }

    const dataAg = new Date(ag.data);
    const dataAgFormatada = dataAg.toISOString().split("T")[0];
    const horaAg = dataAg.toTimeString().slice(0, 5);

    return dataAgFormatada === dataSelecionada && horaAg === h;
  });
}

  return (
    <div className="clientes-container">
      <img src="/Logo.png" className="logo" />

      <h1 className="titulo">Agendar Horário</h1>

      <div className="card">
        <label>Serviços</label>

  <div className="dropdown-servico" ref={dropdownRef}>
  <div
    className={`dropdown-header ${abrirDropdown ? "ativo" : ""}`}
    onClick={() => setAbrirDropdown(!abrirDropdown)}
  >
    <span>
      {servicoId
        ? servicos.find((s) => s.id == servicoId)?.nome
        : "Selecione um serviço"}
    </span>

    <span className={`seta ${abrirDropdown ? "girar" : ""}`}>⌄</span>
  </div>

  {abrirDropdown && (
    <div className="dropdown-list">
      {servicos.map((s) => (
        <div
          key={s.id}
          className={`dropdown-item ${
            servicoId == s.id ? "selecionado" : ""
          }`}
          onClick={() => {
            setServicoId(s.id);
            setAbrirDropdown(false);
          }}
        >
          <span>{s.nome}</span>
          <span className="preco">R${s.preco}</span>
        </div>
      ))}
    </div>
  )}
</div>

        <label>Data</label>

        <Calendar onChange={setData} value={data} />

        <label>Horário</label>

        <div className="horarios">
          <div className="horarios">
            {horarios.map((h) => {
              const ocupado = horarioOcupado(h);

              return (
                <button
                  key={h}
                  disabled={ocupado}
                  className={
                    ocupado
                      ? "hora ocupado"
                      : hora === h
                        ? "hora ativo"
                        : "hora"
                  }
                  onClick={() => setHora(h)}
                >
                  {ocupado ? `❌ ${h}` : ` ${h}`}
                </button>
              );
            })}

          </div>
        </div>

        <button className="btn-agendar" onClick={agendar}>
          Agendar
        </button>
      </div>

      {/* LISTA DE AGENDAMENTOS */}

      <h2 className="titulo-agendamentos">Meus Agendamentos</h2>

      <div className="lista-agendamentos">
        {agendamentos
          .filter((ag) => {
            const user = JSON.parse(localStorage.getItem("user"));
            return ag.userId === user.id;
          })
          .map((ag) => {
            const servico = servicos.find((s) => s.id === ag.servicoId);

            return (
              <div className="card-agendamento" key={ag.id}>
                <div>
                  <h3>{servico ? servico.nome : "Serviço"}</h3>

                  <p>📅 {new Date(ag.data).toLocaleDateString()}</p>

                  <p>
                    ⏰{" "}
                    {new Date(ag.data).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <p className={`status status-${ag.status?.toLowerCase()}`}>
                    {ag.status === "PENDENTE" && "⏳ Aguardando confirmação"}
                    {ag.status === "APROVADO" && "✅ Confirmado"}
                    {ag.status === "FINALIZADO" && "✔️ Atendimento finalizado"}
                    {ag.status === "CANCELADO" && "❌ Cancelado"}
                  </p>
                </div>

                {ag.status !== "FINALIZADO" && ag.status !== "CANCELADO" && (
                  <button
                    className="btn-cancelar"
                    onClick={() => cancelarAgendamento(ag.id)}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
