import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { Cliente, Barbeiro, Servico } from "../types";
import { useNavigate } from "react-router-dom";

export default function NovoAgendamento() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [horarios, setHorarios] = useState<string[]>([]) 

  const [form, setForm] = useState({
    cliente: "",
    barbeiro: "",
    servico: "",
    data: "",
    dataHora: "",
    status: "pendente"
  });

  const navigate = useNavigate();

  useEffect(() => {
  api.get<Cliente[]>("clientes/")
    .then(res => setClientes(res.data))
    .catch(err => console.error("Erro clientes:", err));

  api.get<Barbeiro[]>("barbeiros/")
    .then(res => setBarbeiros(res.data))
    .catch(err => console.error("Erro barbeiros:", err));

  api.get<Servico[]>("servicos/")
    .then(res => setServicos(res.data))
    .catch(err => console.error("Erro servicos:", err));
}, []);


useEffect(() => {
  if (form.barbeiro && form.data) {
    api.get(`agendamentos/horarios_disponiveis/?barbeiro=${form.barbeiro}&data=${form.data}`)
      .then(res => setHorarios(res.data))
      .catch(err => console.error("Erro horários:", err));
  }
}, [form.barbeiro, form.data]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    api.post("agendamentos/", form)
      .then(() => {
        alert("Agendado com sucesso!");
        navigate("/");
      })
      .catch(err => {
        alert(err.response?.data?.detail || "Erro ao agendar");
      });
  };

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Novo Agendamento
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Cliente */}
        <div>
          <label className="text-sm font-medium text-gray-700">Cliente</label>
          <select
            className="w-full border rounded-lg p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={e => setForm({...form, cliente: e.target.value})}
          >
            <option>Selecione</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        {/* Barbeiro */}
        <div>
          <label className="text-sm text-gray-600">Barbeiro</label>
          <select
            className="w-full border rounded p-2 mt-1"
            onChange={e => setForm({...form, barbeiro: e.target.value})}
          >
            <option>Selecione</option>
            {barbeiros.map(b => (
              <option key={b.id} value={b.id}>{b.nome}</option>
            ))}
          </select>
        </div>

        {/* Serviço */}
        <div>
          <label className="text-sm text-gray-600">Serviço</label>
          <select
            className="w-full border rounded p-2 mt-1"
            onChange={e => setForm({...form, servico: e.target.value})}
          >
            <option>Selecione</option>
            {servicos.map(s => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div>
          <label className="text-sm text-gray-600">Data</label>
          <input
            type="date"
            className="w-full border rounded p-2 mt-1"
            onChange={e => setForm({ ...form, data: e.target.value })}
          />
        </div>

        {/* Horários */}
        <div>
          <label className="text-sm text-gray-600">Horário</label>
          <select
            className="w-full border rounded p-2 mt-1"
            onChange={e => {
              const hora = e.target.value;
              setForm({
                ...form,
                dataHora: `${form.data}T${hora}:00`
              });
            }}
          >
            <option value="">Selecione um horário</option>

            {horarios.map((h, i) => (
              <option key={i} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        {/* Botão */}
        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Salvar Agendamento
        </button>

      </form>
    </div>
  </div>
);
}