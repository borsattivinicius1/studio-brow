import { useEffect, useState } from "react"
import "../styles/dashboard.css"
import api from "../api/api"


export default function Dashboard() {

  const [agendamentos, setAgendamentos] = useState([])

  async function carregarAgendamentos() {
    try {

      const token = localStorage.getItem("token")

      const res = await api.get("/agendamentos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAgendamentos(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  async function aprovar(id) {

    const token = localStorage.getItem("token")

    await api.put(`/agendamentos/aprovar/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })

    carregarAgendamentos()
  }

  async function cancelar(id) {

    const token = localStorage.getItem("token")

    await api.put(`/agendamentos/cancelar/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })

    carregarAgendamentos()
  }
  

 useEffect(() => {
  async function carregar() {
    try {

      const token = localStorage.getItem("token")

      const res = await api.get("/agendamentos", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAgendamentos(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  carregar()
}, [])

  return (

    <div className="dashboard-container">

      <h1 className="dashboard-title">
        Painel de Agendamentos
      </h1>

      <div className="agendamentos-list">

        {agendamentos.length === 0 && (
          <p className="sem-agendamento">
            Nenhum agendamento encontrado
          </p>
        )}

        {agendamentos.map((ag) => (

          <div className="agendamento-card" key={ag.id}>

            <div className="agendamento-info">

              <p><strong>Cliente:</strong> {ag.user?.nome}</p>
              <p><strong>Data:</strong> {new Date(ag.data).toLocaleString()}</p>
              <p className={`status ${ag.status}`}>
                {ag.status}
              </p>

            </div>

            <div className="botoes">

              <button
                className="btn-aprovar"
                onClick={() => aprovar(ag.id)}
              >
                Aprovar
              </button>

              <button
                className="btn-cancelar"
                onClick={() => cancelar(ag.id)}
              >
                Cancelar
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}