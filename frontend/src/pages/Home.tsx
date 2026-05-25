import { useEffect, useMemo, useState } from "react";

import { api } from "../services/api";

import type { Agendamento } from "../types";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import Modal from "../components/Modal";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  Menu,
  X
} from "lucide-react";

export default function Home() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const [loading, setLoading] = useState(true);

  // FILTROS
  const [search, setSearch] = useState("");

  const [filtro, setFiltro] = useState("todos");

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] =
    useState<number | null>(null);

  // EDIT
  const [openEdit, setOpenEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    cliente_nome: "",
    barbeiro_nome: "",
    servico_nome: "",
    dataHora: ""
  });

  // CARREGAR AGENDAMENTOS
  useEffect(() => {

    api.get<Agendamento[]>("agendamentos/")

      .then(res => setAgendamentos(res.data))

      .catch(() =>
        toast.error("Erro ao carregar agendamentos")
      )

      .finally(() => setLoading(false));

  }, []);

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    toast.success("Logout realizado!");

    navigate("/login");
  };

  // DELETE
  const openDeleteModal = (id: number) => {

    setSelectedId(id);

    setOpenDelete(true);
  };

  const handleDelete = async () => {

    if (!selectedId) return;

    try {

      await api.delete(`agendamentos/${selectedId}/`);

      setAgendamentos(prev =>
        prev.filter(a => a.id !== selectedId)
      );

      toast.success("Agendamento excluído!");

      setOpenDelete(false);

    } catch {

      toast.error("Erro ao excluir!");
    }
  };

  // EDITAR
  const openEditModal = (a: Agendamento) => {

    setEditForm({
      id: a.id,
      cliente_nome: a.cliente_nome,
      barbeiro_nome: a.barbeiro_nome,
      servico_nome: a.servico_nome,
      dataHora: a.dataHora
        ? a.dataHora.slice(0, 16)
        : ""
    });

    setOpenEdit(true);
  };

  const handleUpdate = async () => {

    try {

      const response = await api.put(
        `agendamentos/${editForm.id}/`,
        editForm
      );

      setAgendamentos(prev =>
        prev.map(a =>
          a.id === editForm.id
            ? response.data
            : a
        )
      );

      toast.success("Agendamento atualizado!");

      setOpenEdit(false);

    } catch {

      toast.error("Erro ao atualizar!");
    }
  };

  // ESTATÍSTICAS
  const agendamentosHoje = agendamentos.filter(a => {

    if (!a.dataHora) return false;

    const hoje = new Date().toDateString();

    return (
      new Date(a.dataHora).toDateString() === hoje
    );

  });

  const proximos = agendamentos.filter(a =>
    a.dataHora &&
    new Date(a.dataHora) > new Date()
  );

  // FATURAMENTO TOTAL
  const faturamentoTotal = agendamentos.reduce(
    (total, item) =>
      total + Number(item.servico_preco || 0),
    0
  );

  // COMISSÕES
  const totalComissoes = agendamentos.reduce(

    (total, item) => {

      const preco =
        Number(item.servico_preco || 0);

      const percentual =
        Number(item.barbeiro_comissao || 0);

      return total + (preco * percentual) / 100;

    },

    0
  );

  // GRÁFICO
  const faturamentoPorServico =
    agendamentos.reduce((acc, item) => {

      const existente = acc.find(
        s => s.nome === item.servico_nome
      );

      if (existente) {

        existente.valor += Number(
          item.servico_preco || 0
        );

      } else {

        acc.push({
          nome: item.servico_nome,
          valor: Number(item.servico_preco || 0)
        });
      }

      return acc;

    }, [] as { nome: string; valor: number }[]);

  // FILTRAGEM
  const agendamentosFiltrados = useMemo(() => {

    return agendamentos

      .filter(a => {

        const texto =
          search.toLowerCase();

        const matchSearch =
          a.cliente_nome
            .toLowerCase()
            .includes(texto) ||

          a.barbeiro_nome
            .toLowerCase()
            .includes(texto) ||

          a.servico_nome
            .toLowerCase()
            .includes(texto);

        if (filtro === "hoje") {

          return (
            matchSearch &&
            a.dataHora &&
            new Date(a.dataHora).toDateString() ===
              new Date().toDateString()
          );
        }

        if (filtro === "proximos") {

          return (
            matchSearch &&
            a.dataHora &&
            new Date(a.dataHora) > new Date()
          );
        }

        return matchSearch;

      })

      .sort(
        (a, b) =>
          new Date(a.dataHora).getTime() -
          new Date(b.dataHora).getTime()
      );

  }, [agendamentos, search, filtro]);

  return (

    <>

      <div className="min-h-screen bg-[#020617] text-white flex">

        {/* OVERLAY */}
        {menuOpen && (

          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />

        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:relative z-50 top-0 left-0 h-full w-72
            bg-[#0f172a]
            border-r border-white/10
            p-6
            flex flex-col justify-between
            transform transition-transform duration-300
            ${menuOpen
              ? "translate-x-0"
              : "-translate-x-full"}
            md:translate-x-0
          `}
        >

          <div>

            {/* MOBILE HEADER */}
            <div className="flex justify-between items-center mb-10 md:hidden">

              <h1 className="text-2xl font-bold">
                Menu
              </h1>

              <button
                onClick={() =>
                  setMenuOpen(false)
                }
                className="bg-white/10 p-2 rounded-xl"
              >
                <X size={22} />
              </button>

            </div>

            <h1 className="text-3xl font-extrabold mb-10 hidden md:block">
              💈 BarberPro
            </h1>

            <nav className="space-y-3">

              <Link
                to="/dashboard"
                onClick={() =>
                  setMenuOpen(false)
                }
              >

                <button className="w-full bg-green-500/20 border border-green-500/20 text-green-400 p-3 rounded-xl text-left">

                  📊 Dashboard

                </button>

              </Link>

              <Link
                to="/calendario"
                onClick={() =>
                  setMenuOpen(false)
                }
              >

                <button className="w-full hover:bg-white/5 p-3 rounded-xl text-left transition">

                  📅 Calendário

                </button>

              </Link>

              <Link
                to="/barbeiros"
                onClick={() =>
                  setMenuOpen(false)
                }
              >

                <button className="w-full hover:bg-white/5 p-3 rounded-xl text-left transition">

                  👨‍💼 Barbeiros

                </button>

              </Link>

              <Link
                to="/clientes"
                onClick={() =>
                  setMenuOpen(false)
                }
              >

                <button className="w-full hover:bg-white/5 p-3 rounded-xl text-left transition">

                  👥 Clientes

                </button>

              </Link>

              <Link
                to="/servicos"
                onClick={() =>
                  setMenuOpen(false)
                }
              >

                <button className="w-full hover:bg-white/5 p-3 rounded-xl text-left transition">

                  ✂️ Serviços

                </button>

              </Link>

            </nav>

          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition p-3 rounded-xl"
          >
            Sair
          </button>

        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1 p-4 md:p-8">

          {/* MOBILE HEADER */}
          <div className="md:hidden flex items-center justify-between mb-6">

            <h1 className="text-2xl font-bold">
              💈 BarberPro
            </h1>

            <button
              onClick={() =>
                setMenuOpen(true)
              }
              className="bg-white/10 p-3 rounded-xl"
            >
              <Menu size={24} />
            </button>

          </div>

          {/* TOPO */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

            <div>

              <h2 className="text-3xl md:text-4xl font-bold">
                Dashboard
              </h2>

              <p className="text-sm md:text-base text-gray-400">

                Controle completo da barbearia

              </p>

            </div>

            <Link to="/novo">

              <button className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-2xl hover:scale-105 transition-all duration-300">

                + Novo Agendamento

              </button>

            </Link>

          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">

              <p className="text-gray-400 mb-2">
                Total
              </p>

              <h3 className="text-3xl md:text-4xl font-extrabold">

                {agendamentos.length}

              </h3>

            </div>

            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl backdrop-blur-xl">

              <p className="text-green-300 mb-2">
                Hoje
              </p>

              <h3 className="text-3xl md:text-4xl font-extrabold text-green-400">

                {agendamentosHoje.length}

              </h3>

            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl backdrop-blur-xl">

              <p className="text-blue-300 mb-2">
                Próximos
              </p>

              <h3 className="text-3xl md:text-4xl font-extrabold text-blue-400">

                {proximos.length}

              </h3>

            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-3xl backdrop-blur-xl">

              <p className="text-yellow-300 mb-2">
                Faturamento
              </p>

              <h3 className="text-3xl md:text-4xl font-extrabold text-yellow-400">

                R$ {faturamentoTotal.toFixed(2)}

              </h3>

            </div>

          </div>

          {/* FILTROS */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <input
              type="text"
              placeholder="🔍 Buscar cliente, barbeiro ou serviço..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-green-500"
            />

            <select
              value={filtro}
              onChange={(e) =>
                setFiltro(e.target.value)
              }
              className="bg-white/5 border border-white/10 rounded-2xl p-4 outline-none"
            >

              <option value="todos" className="text-black">
                Todos
              </option>

              <option value="hoje" className="text-black">
                Hoje
              </option>

              <option value="proximos" className="text-black">
                Próximos
              </option>

            </select>

          </div>

          {/* GRÁFICOS */}
          <div className="grid lg:grid-cols-2 gap-6 mt-10 mb-10">

            {/* BAR */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-3 md:p-6 backdrop-blur-xl overflow-x-auto">

              <h2 className="text-2xl font-bold mb-6">

                Faturamento por Serviço

              </h2>

              <div className="h-[350px] min-w-[300px]">

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart data={faturamentoPorServico}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#333"
                    />

                    <XAxis
                      dataKey="nome"
                      stroke="#999"
                    />

                    <YAxis stroke="#999" />

                    <Tooltip />

                    <Bar
                      dataKey="valor"
                      radius={[10, 10, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* PIE */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-3 md:p-6 backdrop-blur-xl overflow-x-auto">

              <h2 className="text-2xl font-bold mb-6">

                Serviços Mais Vendidos

              </h2>

              <div className="h-[350px] min-w-[300px]">

                <ResponsiveContainer width="100%" height="100%">

                  <PieChart>

                    <Pie
                      data={faturamentoPorServico}
                      dataKey="valor"
                      nameKey="nome"
                      outerRadius={120}
                      label
                    >

                      {faturamentoPorServico.map((_, index) => (

                        <Cell key={index} />

                      ))}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

        </main>

      </div>

      {/* MODAL DELETE */}
      <Modal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >

        <h2 className="text-2xl font-bold text-white mb-4">

          Excluir agendamento

        </h2>

        <p className="text-gray-400 mb-8">

          Tem certeza que deseja excluir este agendamento?

        </p>

        <div className="flex justify-end gap-4">

          <button
            onClick={() =>
              setOpenDelete(false)
            }
            className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl transition"
          >
            Excluir
          </button>

        </div>

      </Modal>

      {/* MODAL EDIT */}
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
      >

        <h2 className="text-2xl font-bold mb-6">

          Editar Agendamento

        </h2>

        <div className="space-y-4">

          <input
            type="text"
            value={editForm.cliente_nome}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                cliente_nome: e.target.value
              })
            }
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white"
            placeholder="Cliente"
          />

          <input
            type="text"
            value={editForm.barbeiro_nome}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                barbeiro_nome: e.target.value
              })
            }
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white"
            placeholder="Barbeiro"
          />

          <input
            type="text"
            value={editForm.servico_nome}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                servico_nome: e.target.value
              })
            }
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white"
            placeholder="Serviço"
          />

          <input
            type="datetime-local"
            value={editForm.dataHora}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                dataHora: e.target.value
              })
            }
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white"
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={() =>
              setOpenEdit(false)
            }
            className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleUpdate}
            className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl transition"
          >
            Salvar
          </button>

        </div>

      </Modal>

    </>

  );
}