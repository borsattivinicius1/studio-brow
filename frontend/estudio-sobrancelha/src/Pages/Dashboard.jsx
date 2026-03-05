import "../styles/dashboard.css"

export default function Dashboard(){

  return(

    <div className="dashboard-container">

      <h1>Agendar Sobrancelha</h1>

      <div className="agenda-box">

        <label>Data</label>
        <input type="date"/>

        <label>Horário</label>
        <input type="time"/>

        <button>
          Agendar
        </button>

      </div>

      <div className="meus-agendamentos">

        <h2>Meus Agendamentos</h2>

        <div className="agendamento">

          <span>12/03 - 14:00</span>

          <button className="cancelar">
            Cancelar
          </button>

        </div>

      </div>

    </div>

  )

}