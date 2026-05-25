import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import Modal from "../components/Modal";

type Cliente = {
  id: number;
  nome: string;
};

export default function Clientes() {

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [nome, setNome] = useState("");

  const [loading, setLoading] = useState(true);

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // EDIT
  const [openEdit, setOpenEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    nome: ""
  });

  // CARREGAR
  const carregarClientes = async () => {

    try {

      const response = await api.get("clientes/");

      setClientes(response.data);

    } catch {

      toast.error("Erro ao carregar clientes");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    carregarClientes();

  }, []);

  // CREATE
  const handleCreate = async () => {

    if (!nome) {

      toast.error("Digite o nome");

      return;
    }

    try {

      const response = await api.post("clientes/", {
        nome
      });

      setClientes(prev => [...prev, response.data]);

      setNome("");

      toast.success("Cliente cadastrado!");

    } catch {

      toast.error("Erro ao cadastrar");
    }
  };

  // DELETE
  const openDeleteModal = (id: number) => {

    setSelectedId(id);

    setOpenDelete(true);
  };

  const handleDelete = async () => {

    if (!selectedId) return;

    try {

      await api.delete(`clientes/${selectedId}/`);

      setClientes(prev =>
        prev.filter(c => c.id !== selectedId)
      );

      toast.success("Cliente excluído!");

      setOpenDelete(false);

    } catch {

      toast.error("Erro ao excluir");
    }
  };

  // EDIT
  const openEditModal = (cliente: Cliente) => {

    setEditForm(cliente);

    setOpenEdit(true);
  };

  const handleUpdate = async () => {

    try {

      const response = await api.put(
        `clientes/${editForm.id}/`,
        editForm
      );

      setClientes(prev =>
        prev.map(c =>
          c.id === editForm.id
            ? response.data
            : c
        )
      );

      toast.success("Cliente atualizado!");

      setOpenEdit(false);

    } catch {

      toast.error("Erro ao atualizar");
    }
  };

  return (

    <div className="min-h-screen bg-[#020617] text-white p-3 md:p-8">

      {/* HEADER */}
      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">
          👥 Clientes
        </h1>

        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Gerencie os clientes da barbearia
        </p>

      </div>

      {/* FORM */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 mb-10 backdrop-blur-xl">

        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Novo Cliente
        </h2>

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Nome do cliente"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="flex-1 bg-black/30 border border-white/10 rounded-xl p-3 outline-none focus:border-green-500 transition"
          />

          <button
            onClick={handleCreate}
            className="w-full md:w-auto bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            Cadastrar
          </button>

        </div>

      </div>

      {/* LISTA */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 backdrop-blur-xl">

        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Lista de Clientes
        </h2>

        {/* LOADING */}
        {loading && (

          <div className="flex justify-center py-10">

            <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></div>

          </div>

        )}

        {/* VAZIO */}
        {!loading && clientes.length === 0 && (

          <div className="text-center text-gray-400 py-10">
            Nenhum cliente cadastrado
          </div>

        )}

        {/* ITENS */}
        <div className="space-y-4">

          {clientes.map(cliente => (

            <div
              key={cliente.id}
              className="bg-black/30 border border-white/5 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:border-green-500/40 hover:scale-[1.01] transition-all duration-300"
            >

              <div>

                <h3 className="text-lg md:text-xl font-bold">
                  {cliente.nome}
                </h3>

                <p className="text-gray-400 text-sm">
                  Cliente cadastrado no sistema
                </p>

              </div>

              <div className="flex gap-3 w-full md:w-auto">

                <button
                  onClick={() => openEditModal(cliente)}
                  className="flex-1 md:flex-none bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl transition"
                >
                  Editar
                </button>

                <button
                  onClick={() => openDeleteModal(cliente.id)}
                  className="flex-1 md:flex-none bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl transition"
                >
                  Excluir
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* MODAL DELETE */}
      <Modal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >

        <h2 className="text-2xl font-bold mb-4">
          Excluir cliente
        </h2>

        <p className="text-gray-400 mb-6">
          Deseja realmente excluir este cliente?
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

      {/* MODAL EDIT */}
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
      >

        <h2 className="text-2xl font-bold mb-6">
          Editar Cliente
        </h2>

        <input
          type="text"
          value={editForm.nome}
          onChange={(e) =>
            setEditForm({
              ...editForm,
              nome: e.target.value
            })
          }
          className="w-full bg-black/30 border border-white/10 rounded-xl p-3 outline-none focus:border-green-500 transition"
        />

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={() => setOpenEdit(false)}
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

    </div>
  );
}