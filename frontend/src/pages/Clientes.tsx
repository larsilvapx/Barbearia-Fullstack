import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import Modal from "../components/Modal";

type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  email: string;
};

export default function Clientes() {

  const [clientes, setClientes] = useState<Cliente[]>([]);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);

  // DELETE
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // EDIT
  const [openEdit, setOpenEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    nome: "",
    telefone: "",
    email: ""
  });

  // CARREGAR CLIENTES
  const carregarClientes = async () => {

    try {

      const response = await api.get("clientes/");

      setClientes(response.data);

    } catch (error) {

      console.log(error);

      toast.error("Erro ao carregar clientes");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    carregarClientes();

  }, []);

  // CADASTRAR
  const handleCreate = async () => {

    if (!nome || !telefone || !email) {

      toast.error("Preencha todos os campos");

      return;
    }

    try {

      const response = await api.post("clientes/", {
        nome,
        telefone,
        email
      });

      setClientes(prev => [...prev, response.data]);

      setNome("");
      setTelefone("");
      setEmail("");

      toast.success("Cliente cadastrado!");

    } catch (error) {

      console.log(error);

      toast.error("Erro ao cadastrar cliente");
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

      toast.error("Erro ao excluir cliente");
    }
  };

  // EDITAR
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

    } catch (error) {

      console.log(error);

      toast.error("Erro ao atualizar cliente");
    }
  };

  return (

    <div className="min-h-screen bg-[#020617] text-white p-8">

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Clientes
          </h1>

          <p className="text-gray-400">
            Gerencie os clientes da barbearia
          </p>

        </div>

      </div>

      {/* FORM */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10">

        <h2 className="text-2xl font-bold mb-6">
          Novo Cliente
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl p-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl p-3"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="bg-black/30 border border-white/10 rounded-xl p-3"
          />

          

          <button
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 rounded-xl font-semibold"
          >
            Cadastrar
          </button>

        </div>

      </div>

      {/* LISTA */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Lista de Clientes
        </h2>

        {loading && (

          <div className="text-center py-10">
            Carregando...
          </div>

        )}

        <div className="space-y-4">

          {clientes.map(cliente => (

            <div
              key={cliente.id}
              className="bg-black/30 border border-white/5 rounded-2xl p-5 flex justify-between items-center"
            >

              <div>

                <h3 className="text-xl font-bold">
                  {cliente.nome}
                </h3>

                <p className="text-gray-400">
                  {cliente.telefone}
                </p>

                <p className="text-gray-500 text-sm">
                  {cliente.email}
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => openEditModal(cliente)}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl"
                >
                  Editar
                </button>

                <button
                  onClick={() => openDeleteModal(cliente.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl"
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
          Excluir Cliente
        </h2>

        <p className="text-gray-400 mb-6">
          Deseja realmente excluir?
        </p>

        <div className="flex justify-end gap-4">

          <button
            onClick={() => setOpenDelete(false)}
            className="bg-white/10 px-5 py-2 rounded-xl"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 px-5 py-2 rounded-xl"
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

        <div className="space-y-4">

          <input
            type="text"
            value={editForm.nome}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                nome: e.target.value
              })
            }
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
          />

          <input
            type="text"
            value={editForm.telefone}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                telefone: e.target.value
              })
            }
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
          />

          <input
            type="email"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                email: e.target.value
              })
            }
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3"
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={() => setOpenEdit(false)}
            className="bg-white/10 px-5 py-2 rounded-xl"
          >
            Cancelar
          </button>

          <button
            onClick={handleUpdate}
            className="bg-green-500 px-5 py-2 rounded-xl"
          >
            Salvar
          </button>

        </div>

      </Modal>

    </div>
  );
}