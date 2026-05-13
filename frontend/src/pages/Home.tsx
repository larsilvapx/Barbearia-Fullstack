import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Agendamento } from "../types";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../components/Modal";

export default function Home() {

  const navigate = useNavigate();

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    cliente_nome: "",
    barbeiro_nome: "",
    servico_nome: "",
    dataHora: ""
  });

  useEffect(() => {

    api.get<Agendamento[]>("agendamentos/")
      .then(res => setAgendamentos(res.data))
      .catch(err => console.log(err))
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
      className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
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
      className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
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
      className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
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
      className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
    />

  </div>

  <div className="flex justify-end gap-4 mt-8">

    <button
      onClick={() => setOpenEdit(false)}
      className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl"
    >
      Cancelar
    </button>

    <button
      onClick={handleUpdate}
      className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl"
    >
      Salvar
    </button>

  </div>

</Modal>

  const openEditModal = (a: Agendamento) => {

  setEditForm({
    id: a.id,
    cliente_nome: a.cliente_nome,
    barbeiro_nome: a.barbeiro_nome,
    servico_nome: a.servico_nome,
    dataHora: a.dataHora
  });

  setOpenEdit(true);
};

const handleUpdate = async () => {

  try {

    await api.put(
      `agendamentos/${editForm.id}/`,
      editForm
    );

    setAgendamentos(prev =>
      prev.map(a =>
        a.id === editForm.id
          ? editForm
          : a
      )
    );

    toast.success("Agendamento atualizado!");

    setOpenEdit(false);

  } catch {

    toast.error("Erro ao atualizar!");
  }
};

  // FILTROS
  const agendamentosHoje = agendamentos.filter(a => {

    const hoje = new Date().toDateString();

    return new Date(a.dataHora).toDateString() === hoje;

  });

  const proximos = agendamentos.filter(a =>
    new Date(a.dataHora) > new Date()
  );

  return (
    <>

      <div className="min-h-screen bg-[#020617] text-white flex">

        {/* SIDEBAR */}
        <aside className="w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 hidden md:flex flex-col justify-between">

          <div>

            <h1 className="text-3xl font-extrabold mb-10">
              💈 BarberPro
            </h1>

            <nav className="space-y-3">

              <button className="w-full bg-green-500/20 border border-green-500/20 text-green-400 p-3 rounded-xl text-left">
                📊 Dashboard
              </button>

              <button className="w-full hover:bg-white/5 p-3 rounded-xl text-left transition">
                📅 Agendamentos
              </button>

              <button className="w-full hover:bg-white/5 p-3 rounded-xl text-left transition">
                👥 Clientes
              </button>

              <button className="w-full hover:bg-white/5 p-3 rounded-xl text-left transition">
                ✂️ Serviços
              </button>

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
        <main className="flex-1 p-8">

          {/* TOPO */}
          <div className="flex justify-between items-center mb-10">

            <div>

              <h2 className="text-4xl font-bold">
                Dashboard
              </h2>

              <p className="text-gray-400">
                Controle completo da barbearia
              </p>

            </div>

            <Link to="/novo">

              <button className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-xl font-semibold shadow-2xl hover:scale-105 transition-all duration-300">
                + Novo Agendamento
              </button>

            </Link>

          </div>

          {/* CARDS */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">

              <p className="text-gray-400 mb-2">
                Total
              </p>

              <h3 className="text-4xl font-extrabold">
                {agendamentos.length}
              </h3>

            </div>

            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-3xl backdrop-blur-xl">

              <p className="text-green-300 mb-2">
                Hoje
              </p>

              <h3 className="text-4xl font-extrabold text-green-400">
                {agendamentosHoje.length}
              </h3>

            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl backdrop-blur-xl">

              <p className="text-blue-300 mb-2">
                Próximos
              </p>

              <h3 className="text-4xl font-extrabold text-blue-400">
                {proximos.length}
              </h3>

            </div>

          </div>

          {/* LISTA */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-2xl font-bold">
                Agendamentos
              </h3>

            </div>

            {/* LOADING */}
            {loading && (

              <div className="flex justify-center py-10">

                <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>

              </div>

            )}

            {/* VAZIO */}
            {!loading && agendamentos.length === 0 && (

              <div className="text-center text-gray-400 py-10">
                Nenhum agendamento encontrado
              </div>

            )}

            {/* ITENS */}
            <div className="space-y-4">

              {agendamentos.map(a => (

                <div
                  key={a.id}
                  className="bg-black/30 border border-white/5 rounded-2xl p-5 hover:border-green-500/30 transition-all duration-300"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h4 className="text-xl font-bold">
                        {a.cliente_nome}
                      </h4>

                      <p className="text-gray-400">
                        {a.servico_nome}
                      </p>

                      <p className="text-sm text-gray-500">
                        com {a.barbeiro_nome}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-gray-400">
                        {new Date(a.dataHora).toLocaleDateString()}
                      </p>

                      <p className="text-green-400 font-bold text-lg">
                        {new Date(a.dataHora).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>

                    </div>

                  </div>

                  {/* AÇÕES */}
                  <div className="flex justify-end gap-3 mt-5">

                    <button
                      onClick={() => navigate(`/editar/${a.id}`)}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => openDeleteModal(a.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl transition"
                    >
                      Excluir
                    </button>

                  </div>

                </div>

              ))}

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
            onClick={() => setOpenDelete(false)}
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

    </>
  );
}