import { useEffect, useState } from "react"
import "../styles/cliente.css"
import api from "../api/api"

export default function Cliente() {

  const [data, setData] = useState("")
  const [agendamentos, setAgendamentos] = useState([])

  const token = localStorage.getItem("token")

  async function carregarAgendamentos() {
    try {

      const res = await api.get("/agendamentos/meus", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAgendamentos(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  async function agendar(e) {
    e.preventDefault()

    try {

      await api.post("/agendamentos", 
        { data },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setData("")
      carregarAgendamentos()

    } catch (err) {
      console.log(err)
    }
  }

  async function cancelar(id) {

    try {

      await api.put(`/agendamentos/cancelar/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      carregarAgendamentos()

    } catch (err) {
      console.log(err)
    }
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

    <div className="cliente-container">

      <h1 className="cliente-title">
        Agendar Horário
      </h1>

      <form className="agendamento-form" onSubmit={agendar}>

        <input
          type="datetime-local"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />

        <button type="submit">
          Agendar
        </button>

      </form>

      <h2 className="cliente-subtitle">
        Meus Agendamentos
      </h2>

      <div className="agendamentos-list">

        {agendamentos.map((ag) => (

          <div className="agendamento-card" key={ag.id}>

            <p><strong>Nome:</strong> {ag.user?.nome}</p>

            <p>
              <strong>Data:</strong>
              {new Date(ag.data).toLocaleDateString()}
            </p>

            <p>
              <strong>Hora:</strong>
              {new Date(ag.data).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            </p>

            <button
              className="btn-cancelar"
              onClick={() => cancelar(ag.id)}
            >
              Cancelar
            </button>

          </div>

        ))}

      </div>

    </div>

  )
}