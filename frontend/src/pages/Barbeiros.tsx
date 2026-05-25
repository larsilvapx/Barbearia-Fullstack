import { useEffect, useState } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import Modal from "../components/Modal";

type Barbeiro = {
  id: number;
  nome: string;
  percentual_comissao: number;
};

export default function Barbeiros() {

  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);

  const [nome, setNome] = useState("");

  const [percentualComissao, setPercentualComissao] = useState(40);

  const [loading, setLoading] = useState(true);

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [openEdit, setOpenEdit] = useState(false);

  const [editForm, setEditForm] = useState({
    id: 0,
    nome: "",
    percentual_comissao: 40
  });

  const carregarBarbeiros = async () => {

    try {

      const response = await api.get("barbeiros/");

      setBarbeiros(response.data);

    } catch {

      toast.error("Erro ao carregar barbeiros");

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    carregarBarbeiros();

  }, []);

  const handleCreate = async () => {

    if (!nome) {

      toast.error("Digite o nome");

      return;
    }

    try {

      const response = await api.post("barbeiros/", {
        nome,
        percentual_comissao: percentualComissao
      });

      setBarbeiros(prev => [...prev, response.data]);

      setNome("");

      setPercentualComissao(40);

      toast.success("Barbeiro cadastrado!");

    } catch {

      toast.error("Erro ao cadastrar");
    }
  };

  const openDeleteModal = (id: number) => {

    setSelectedId(id);

    setOpenDelete(true);
  };

  const handleDelete = async () => {

    if (!selectedId) return;

    try {

      await api.delete(`barbeiros/${selectedId}/`);

      setBarbeiros(prev =>
        prev.filter(b => b.id !== selectedId)
      );

      toast.success("Barbeiro excluído!");

      setOpenDelete(false);

    } catch {

      toast.error("Erro ao excluir");
    }
  };

  const openEditModal = (barbeiro: Barbeiro) => {

    setEditForm(barbeiro);

    setOpenEdit(true);
  };

  const handleUpdate = async () => {

    try {

      const response = await api.put(
        `barbeiros/${editForm.id}/`,
        editForm
      );

      setBarbeiros(prev =>
        prev.map(b =>
          b.id === editForm.id
            ? response.data
            : b
        )
      );

      toast.success("Barbeiro atualizado!");

      setOpenEdit(false);

    } catch {

      toast.error("Erro ao atualizar");
    }
  };

  return (

    <div className="min-h-screen bg-[#020617] text-white p-3 md:p-8">

      <div className="mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">
          👨‍💼 Barbeiros
        </h1>

        <p className="text-gray-400 mt-2">
          Gerencie os profissionais da barbearia
        </p>

      </div>

      {/* FORM */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6 mb-10">

        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Novo Barbeiro
        </h2>

        <div className="flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="Nome do barbeiro"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="flex-1 bg-black/30 border border-white/10 rounded-xl p-3"
          />

          <input
            type="number"
            placeholder="% comissão"
            value={percentualComissao}
            onChange={(e) =>
              setPercentualComissao(Number(e.target.value))
            }
            className="w-full md:w-40 bg-black/30 border border-white/10 rounded-xl p-3"
          />

          <button
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
          >
            Cadastrar
          </button>

        </div>

      </div>

      {/* LISTA */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-6">

        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Lista de Barbeiros
        </h2>

        {loading && (

          <div className="text-center py-10">
            Carregando...
          </div>

        )}

        <div className="space-y-4">

          {barbeiros.map(barbeiro => (

            <div
              key={barbeiro.id}
              className="bg-black/30 border border-white/5 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            >

              <div>

                <h3 className="text-lg md:text-xl font-bold">
                  {barbeiro.nome}
                </h3>

                <p className="text-green-400 text-sm">
                  Comissão: {barbeiro.percentual_comissao}%
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => openEditModal(barbeiro)}
                  className="flex-1 md:flex-none bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl"
                >
                  Editar
                </button>

                <button
                  onClick={() => openDeleteModal(barbeiro.id)}
                  className="flex-1 md:flex-none bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl"
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
          Excluir barbeiro
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
          Editar Barbeiro
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
            type="number"
            value={editForm.percentual_comissao}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                percentual_comissao: Number(e.target.value)
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