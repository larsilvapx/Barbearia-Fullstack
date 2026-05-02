import { useNavigate } from "react-router-dom";


export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">

      {/* HEADER */}
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-2xl">
          💈 Barber Francis Farmer
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Entrar
        </button>
      </header>

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">

        <h2 className="text-5xl font-extrabold leading-tight mb-6">
          Gerencie sua barbearia <br />
          <span className="text-green-400">com estilo e eficiência</span>
        </h2>

        <p className="text-gray-200 max-w-xl mb-8">
          Controle agendamentos, clientes e serviços em um único lugar.
          Simples, rápido e profissional.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="border border-gray-600 px-6 py-3 rounded-lg text-lg hover:bg-green-700 transition shadow-2x1 hover:scale-105"
          >
            Começar agora
          </button>

          <button
            className="border border-gray-400 px-6 py-3 rounded-lg text-lg hover:bg-white/10 transition"
          >
            Ver demo
          </button>
        </div>

      </main>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 p-6">

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl hover:scale-105 hover:bg-white/20 transition">
          <h3 className="text-xl font-bold mb-2">📅 Agendamentos</h3>
          <p className="text-gray-400 text-sm">
            Organize horários com facilidade e evite conflitos.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">👥 Clientes</h3>
          <p className="text-gray-400 text-sm">
            Gerencie seus clientes e histórico de atendimentos.
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">✂️ Serviços</h3>
          <p className="text-gray-400 text-sm">
            Controle serviços e preços de forma simples.
          </p>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm pb-6">
        © 2026 Francis Farmer — Sistema de agendamento
      </footer>

    </div>
  );
}