import { useState, useEffect } from "react"
import api from "../api/api.js"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "../styles/clientes.css"

export default function Clientes(){

  const [servicos,setServicos] = useState([])
  const [servicoId,setServicoId] = useState("")
  const [data,setData] = useState(new Date())
  const [hora,setHora] = useState("")
  const [agendamentos,setAgendamentos] = useState([])

  const horarios = [
    "09:00","10:00","11:00",
    "13:00","14:00","15:00",
    "16:00","17:00"
  ]

  async function carregarServicos(){
    const res = await api.get("/servicos")
    setServicos(res.data)
  }

  async function carregarAgendamentos(){
    const user = JSON.parse(localStorage.getItem("user"))

    const res = await api.get("/agendamentos")

    const meus = res.data.filter(a => a.userId === user.id)

    setAgendamentos(meus)
  }

  useEffect(() => {
    const carregar = async () => {
      try{
        await carregarServicos()
        await carregarAgendamentos()
      }catch(error){
        console.log(error)
      }
    }

    carregar()
  }, [])

  async function agendar(){

    if(!servicoId || !hora){
      alert("Selecione serviço e horário")
      return
    }

    const dataFormatada =
      data.toISOString().split("T")[0] + "T" + hora + ":00"

    const user = JSON.parse(localStorage.getItem("user"))

    await api.post("/agendamentos",{
      data:dataFormatada,
      userId:user.id,
      servicoId:Number(servicoId)
    })

    alert("Agendamento realizado!")

    carregarAgendamentos()
  }

  async function cancelarAgendamento(id){
    await api.delete(`/agendamentos/${id}`)
    carregarAgendamentos()
  }

  return(

    <div className="clientes-container">

      <h1 className="titulo">
           Agendar Horário
       </h1>

      <div className="card">

        <label>Serviços</label>

        <select
          value={servicoId}
          onChange={e=>setServicoId(e.target.value)}
        >
         <option value="">
             Selecione um serviço
         </option>

          {servicos.map(s=>(
            <option key={s.id} value={s.id}>
              {s.nome} - R${s.preco}
            </option>
          ))}

        </select>

        <label>Date</label>

        <Calendar
          onChange={setData}
          value={data}
        />

        <label>Horário</label>

        <div className="horarios">

          {horarios.map(h=>(
            <button
              key={h}
              className={
                hora === h
                ? "hora ativo"
                : "hora"
              }
              onClick={()=>setHora(h)}
            >
              {h}
            </button>
          ))}

        </div>

        <button
          className="btn-agendar"
          onClick={agendar}
        >
          Agendar
        </button>

      </div>

      {/* LISTA DE AGENDAMENTOS */}

      <h2 className="titulo-agendamentos">
        Meus Agendamentos
      </h2>

      <div className="lista-agendamentos">

        {agendamentos.map(ag => {

          const servico = servicos.find(s => s.id === ag.servicoId)

          return(
            <div className="card-agendamento" key={ag.id}>

              <div>

                <h3>
                  {servico ? servico.nome : "Serviço"}
                </h3>

                <p>
                  📅 {new Date(ag.data).toLocaleDateString()}
                </p>

                <p>
                  ⏰ {new Date(ag.data).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </p>

              </div>

              <button
                className="btn-cancelar"
                onClick={()=>cancelarAgendamento(ag.id)}
              >
                Cancelar
              </button>

            </div>
          )

        })}

      </div>

    </div>

  )
}