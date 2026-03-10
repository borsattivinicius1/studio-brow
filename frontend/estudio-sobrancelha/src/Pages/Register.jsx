import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import "../styles/register.css"

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

    <div className="register-container">

      <div className="register-card">

        <img 
          src="/Logo.png" 
          className="logo"
          alt="Studio Brow"
        />

        <h1>Criar Conta</h1>

        <form onSubmit={cadastrar}>

          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={e=>setNome(e.target.value)}
          />

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={e=>setSenha(e.target.value)}
          />

          <button type="submit">
            Criar Conta
          </button>

          <p className="link-login">
            Já tem conta?
            <span onClick={()=>navigate("/")}>
              Entrar
            </span>
          </p>

        </form>

      </div>

    </div>

  )

}