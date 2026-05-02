import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Agendamento } from "../types";
import { Link } from "react-router-dom";

export default function Home() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Agendamento[]>("agendamentos/")
      .then(res => setAgendamentos(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Agendamentos
            </h1>
            <p className="text-gray-500 text-sm">
              Gerencie os horários da barbearia
            </p>
          </div>

          <Link to="/novo">
            <button className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition">
              + Novo
            </button>
          </Link>
        </div>

        {/* LOADING BONITO */}
        {loading && (
          <div className="flex justify-center mt-10">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* VAZIO */}
        {!loading && agendamentos.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            Nenhum agendamento encontrado 😢
          </div>
        )}

        {/* LISTA */}
        <div className="space-y-4">
          {agendamentos.map(a => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition p-4 border-l-4 border-green-500"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-xl text-gray-900">
                    {a.cliente_nome}
                  </p>
                  <p className="text-gray-600">
                    {a.servico_nome}
                  </p>
                  <p className="text-sm text-gray-500">
                    com {a.barbeiro_nome}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(a.dataHora).toLocaleDateString()}
                  </p>
                  <p className="text-green-600 font-bold">
                    {new Date(a.dataHora).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
              {/* AÇÕES */}
              <div className="flex justify-end mt-4 gap-2">
                <button className="text-blue-600 hover:underline text-sm">
                  editar
                </button>
                <button className="text-red-600 hover:underline text-sm">
                  excluir
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}