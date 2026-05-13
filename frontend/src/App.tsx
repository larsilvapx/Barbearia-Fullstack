import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NovoAgendamento from "./pages/NovoAgendamento";
import EditarAgendamentos from "./pages/EditarAgendamentos";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute";


export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Inicio />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />          
          <Route path="/novo" element={<NovoAgendamento />} />
          <Route path="/editar/:id" element={<EditarAgendamentos />}/> 
        </Routes>
      </div>
    </div>
  );
}