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
  X,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Scissors
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
  // METAS MENSAIS

  const metaMensal = 5000;

  const percentualMeta =
    (faturamentoTotal / metaMensal) * 100;

  const dataAtual = new Date().toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
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

    //RELATÓRIO PDF
  const gerarPDF = async () => {

      try {

        const response = await api.get(
          "relatorios/pdf/",
          {
            responseType: "blob"
          }
        );

        const url =
          window.URL.createObjectURL(
            new Blob([response.data])
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.setAttribute(
          "download",
          "relatorio.pdf"
        );

        document.body.appendChild(link);

        link.click();

        link.remove();

      } catch {

        toast.error(
          "Erro ao gerar PDF"
        );

      }

    };

  const COLORS = [
    "#22c55e",
     "#3b82f6",
     "#f59e0b",
     "#ec4899",
     "#8b5cf6",
     "#14b8a6"
     ];        

    

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
          {/* HERO SECTION */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] rounded-3xl p-8 mb-10 border border-white/10">

            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">

              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            
              </h1>

              <h3 className="text-lg text-gray-400">
                Controle completo da sua barbearia.
              </h3>

              <p className="text-sm text-gray-400 mt-2">
                {dataAtual}
              </p>

              <div className="flex flex-wrap gap-4 mt-6">

                <div className="bg-white/10 px-4 py-2 rounded-xl">
                  📅 {agendamentosHoje.length} atendimentos hoje
                </div>

                <div className="bg-white/10 px-4 py-2 rounded-xl">
                  💰 R$ {faturamentoTotal.toFixed(2)}
                </div>

                <div className="bg-white/10 px-4 py-2 rounded-xl">
                  ✂️ {faturamentoPorServico.length} serviços
                </div>

              </div>

              <div className="flex gap-4 mt-6">

              <Link to="/novo">

                <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition">

                  + Novo Agendamento

                </button>

              </Link>

              <button
                onClick={gerarPDF}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold transition"
              >

                📄 Exportar PDF

              </button>

            </div>

            </div>

          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-400">
                  Total
                </p>

                <h3 className="text-4xl font-bold">
                  {agendamentos.length}
                </h3>

              </div>

              <Users
                size={40}
                className="text-green-400"
              />

            </div>

          </div>

          <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-green-300">
                  Hoje
                </p>

                <h3 className="text-4xl font-bold text-green-400">
                  {agendamentosHoje.length}
                </h3>

              </div>

              <Calendar
                size={40}
                className="text-green-400"
              />

            </div>

          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-blue-300">
                  Próximos
                </p>

                <h3 className="text-4xl font-bold text-blue-400">
                  {proximos.length}
                </h3>

              </div>

              <Clock
                size={40}
                className="text-blue-400"
              />

            </div>

          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-yellow-300">
                  Receita
                </p>

                <h3 className="text-4xl font-bold text-yellow-400">
                  R$ {faturamentoTotal.toFixed(2)}
                </h3>

              </div>

              <DollarSign
                size={40}
                className="text-yellow-400"
              />

            </div>

          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-3xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-purple-300">
                  Comissões
                </p>

                <h3 className="text-4xl font-bold text-purple-400">
                  R$ {totalComissoes.toFixed(2)}
                </h3>

              </div>

              <Scissors
                size={40}
                className="text-purple-400"
              />

            </div>

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

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">

          <div className="flex justify-between mb-4">

            <span className="font-semibold">
              Meta Mensal
            </span>

            <span>

              R$ {faturamentoTotal.toFixed(2)}
              / R$ {metaMensal}

            </span>

          </div>

          <div className="w-full h-4 bg-black/30 rounded-full overflow-hidden">

            <div
              className="h-full bg-green-500"
              style={{
                width: `${Math.min(percentualMeta, 100)}%`
              }}
            />

          </div>

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
                      fill="#22c55e"
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
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />

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

      

      

      {/* PRÓXIMOS ATENDIMENTOS */}
<div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">

  <h2 className="text-2xl font-bold mb-6">
    Próximos Atendimentos
  </h2>

  <div className="space-y-4">

    {proximos
      .sort(
        (a, b) =>
          new Date(a.dataHora).getTime() -
          new Date(b.dataHora).getTime()
      )
      .slice(0, 5)
      .map(item => (

        <div
          key={item.id}
          className="flex justify-between items-center border-b border-white/10 pb-3"
        >

          <div>

            <p className="font-semibold">
              {item.cliente_nome}
            </p>

            <p className="text-sm text-gray-400">
              {item.servico_nome}
            </p>

          </div>

          <span className="text-green-400">
            {new Date(item.dataHora)
              .toLocaleString("pt-BR")}
          </span>

        </div>

      ))}

  </div>

</div>

{/* ÚLTIMOS AGENDAMENTOS */}
<div className="bg-white/5 border border-white/10 rounded-3xl p-6">

  <h2 className="text-2xl font-bold mb-6">
    Últimos Agendamentos
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full">

      <thead>

        <tr className="border-b border-white/10">

          <th className="text-left py-3">
            Cliente
          </th>

          <th className="text-left py-3">
            Serviço
          </th>

          <th className="text-left py-3">
            Barbeiro
          </th>

          <th className="text-left py-3">
            Data
          </th>

        </tr>

      </thead>

      <tbody>

        {agendamentosFiltrados
          .slice(0, 10)
          .map(item => (

            <tr
              key={item.id}
              className="border-b border-white/5"
            >

              <td className="py-3">
                {item.cliente_nome}
              </td>

              <td className="py-3">
                {item.servico_nome}
              </td>

              <td className="py-3">
                {item.barbeiro_nome}
              </td>

              <td className="py-3">
                {new Date(item.dataHora)
                  .toLocaleString("pt-BR")}
              </td>

            </tr>

          ))}

      </tbody>

    </table>

  </div>

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