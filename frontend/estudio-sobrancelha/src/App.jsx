import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./Pages/login"
import Dashboard from "./Pages/Dashboard"
import Admin from "./Pages/Admin"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin" element={<Admin />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App