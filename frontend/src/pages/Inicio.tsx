import { useNavigate } from "react-router-dom";

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl"></div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">

        <div className="flex justify-between items-center p-6 max-w-7xl mx-auto">

          <h1 className="text-3xl font-black tracking-wide">
            💈 Barber Francis Farmer
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-2xl font-semibold"
          >
            Entrar
          </button>

        </div>

      </header>

      {/* HERO */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-28">

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 max-w-5xl shadow-2xl">

          <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold border border-green-500/20">
            Sistema profissional para barbearias
          </span>

          <h2 className="text-6xl md:text-7xl font-extrabold leading-tight mt-8 mb-8">

            Transforme sua <br />

            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              gestão de agendamentos
            </span>

          </h2>

          <p className="text-gray-300 text-xl leading-relaxed max-w-3xl mx-auto mb-10">

            Controle clientes, serviços e horários com uma plataforma moderna,
            rápida e elegante desenvolvida para barbearias profissionais.

          </p>

          {/* BUTTONS */}
          <div className="flex flex-wrap justify-center gap-5">

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Começar agora
            </button>

            <button className="border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all duration-300">
              Ver demonstração
            </button>

          </div>

        </div>

      </main>

      {/* FEATURES */}
      <section className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-3 gap-8 px-6 pb-24">

        {/* CARD 1 */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-2xl">

          <div className="text-5xl mb-5">📅</div>

          <h3 className="text-2xl font-bold mb-4">
            Agendamentos
          </h3>

          <p className="text-gray-400 leading-relaxed">
            Organize horários, reduza conflitos e acompanhe sua agenda em tempo real.
          </p>

        </div>

        {/* CARD 2 */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-2xl">

          <div className="text-5xl mb-5">👥</div>

          <h3 className="text-2xl font-bold mb-4">
            Clientes
          </h3>

          <p className="text-gray-400 leading-relaxed">
            Tenha acesso rápido ao histórico de clientes e atendimentos.
          </p>

        </div>

        {/* CARD 3 */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-2xl">

          <div className="text-5xl mb-5">✂️</div>

          <h3 className="text-2xl font-bold mb-4">
            Serviços
          </h3>

          <p className="text-gray-400 leading-relaxed">
            Gerencie serviços, preços e produtividade de forma moderna.
          </p>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 text-center text-gray-500 text-sm pb-8">

        © 2026 Barber Francis Farmer — Sistema premium de agendamento

      </footer>

    </div>
  );
}