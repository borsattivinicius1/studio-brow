import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./Pages/login"
import Clientes from "./Pages/clientes"
import Register from "./Pages/Register"
import Dashboard from "./Pages/Dashboard"
import PrivateRoute from "./routes/PrivateRoute"

function App() {
  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Clientes />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  )
}

export default App