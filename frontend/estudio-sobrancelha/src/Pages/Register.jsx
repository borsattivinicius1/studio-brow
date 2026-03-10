import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import "../styles/login.css"

export default function Register(){

  const navigate = useNavigate()

  const [nome,setNome] = useState("")
  const [email,setEmail] = useState("")
  const [senha,setSenha] = useState("")

  async function cadastrar(e){

    e.preventDefault()

    try{

      await api.post("/users",{
        nome,
        email,
        senha
      })

      alert("Conta criada com sucesso!")

      navigate("/")

   }catch(err){

  console.log(err)

  alert(err.response?.data?.error || "Erro ao criar conta")

}

  }

  return(

    <div className="login-container">

      <h1>Criar Conta</h1>

      <form onSubmit={cadastrar}>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={e=>setNome(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e=>setSenha(e.target.value)}
        />

        <button type="submit">
          Criar Conta
        </button>

        <p className="link-register">
            Já tem conta?
        <span onClick={()=>navigate("/")}>
            Entrar
        </span>
        </p>

      </form>

    </div>

  )

}