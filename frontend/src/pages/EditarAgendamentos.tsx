import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function EditarAgendamento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cliente_nome: "",
    servico_nome: "",
    barbeiro_nome: "",
    dataHora: ""
  });

  useEffect(() => {
    api.get(`agendamentos/${id}/`)
    .then(res => setForm({
      cliente_nome: res.data.cliente_nome || "",
      servico_nome: res.data.servico_nome || "",
      barbeiro_nome: res.data.barbeiro_nome || "",
      dataHora: res.data.dataHora
        ? res.data.dataHora.slice(0, 16)
        : ""
    }))
    .catch(err => console.log(err))
  },
   [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.put(`agendamentos/${id}/`, form);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-xl font-bold mb-4">
          Editar Agendamento
        </h1>

        <form onSubmit={handleUpdate} className="space-y-3">

          <input
            className="w-full p-2 border rounded"
            value={form.cliente_nome}
            onChange={(e) => setForm({...form, cliente_nome: e.target.value})}
            placeholder="Cliente"
          />

          <input
            className="w-full p-2 border rounded"
            value={form.servico_nome}
            onChange={(e) => setForm({...form, servico_nome: e.target.value})}
            placeholder="Serviço"
          />

          <input
            className="w-full p-2 border rounded"
            value={form.barbeiro_nome}
            onChange={(e) => setForm({...form, barbeiro_nome: e.target.value})}
            placeholder="Barbeiro"
          />

          <input
            type="datetime-local"
            className="w-full p-2 border rounded"
            value={form.dataHora}
            onChange={(e) => setForm({...form, dataHora: e.target.value})}
          />

          <button className="bg-green-600 text-white w-full p-2 rounded">
            Salvar
          </button>

        </form>
      </div>
    </div>
  );
}