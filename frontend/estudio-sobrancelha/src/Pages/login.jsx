import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import "../styles/login.css"

export default function Login(){

  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [senha,setSenha] = useState("")
  const [loading,setLoading] = useState(false)

  async function handleLogin(e){

    e.preventDefault()

    setLoading(true)

    try{

      const res = await api.post("/auth/login",{
        email,
        senha
      })

      const user = res.data.user

      localStorage.setItem("token",res.data.token)
      localStorage.setItem("user",JSON.stringify(user))

      // REDIRECIONA DEPENDENDO DO ROLE
      if(user.role === "ADMIN"){
        navigate("/dashboard")
      }else{
        navigate("/clientes")
      }

    }catch(error){

      console.log(error)
      alert("Email ou senha inválidos")

    }

    setLoading(false)

  }

  return(

    <div className="login-container">

      <div className="login-card">

        <h1 className="logo">Studio Brow</h1>

        <p className="subtitle">
          Agendamento de Sobrancelhas
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e=>setSenha(e.target.value)}
            required
          />

          <button type="submit">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="link-register">
            Não tem conta?
            <span onClick={()=>navigate("/register")}>
              Criar conta
            </span>
          </p>

        </form>

      </div>

    </div>

  )

}