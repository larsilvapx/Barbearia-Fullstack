import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NovoAgendamento from "./pages/NovoAgendamento";
import EditarAgendamentos from "./pages/EditarAgendamentos";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute";


import Clientes from "./pages/Clientes";
import Servicos from "./pages/Servicos";
import Barbeiros from "./pages/Barbeiros";
import Calendario from "./pages/Calendario";

export default function App() {

  return (

    <div className="min-h-screen bg-gray-100">

      <div className="max-w-4xl mx-auto p-4">

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/"
            element={<Inicio />}
          />

          <Route
            path="/calendario"
            element={
              <PrivateRoute>
                <Calendario />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
           path="/barbeiros" element={<Barbeiros />

           }
            />

          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            }
          />

          <Route
            path="/servicos"
            element={
              <PrivateRoute>
                <Servicos />
              </PrivateRoute>
            }
          />

          <Route
            path="/novo"
            element={
              <PrivateRoute>
                <NovoAgendamento />
              </PrivateRoute>
            }
          />

          <Route
            path="/editar/:id"
            element={
              <PrivateRoute>
                <EditarAgendamentos />
              </PrivateRoute>
            }
          />

        </Routes>

      </div>

    </div>

  );
}