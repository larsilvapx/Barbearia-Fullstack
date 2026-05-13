import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Login() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await api.post("token/", form);

      localStorage.setItem("token", response.data.access);

      toast.success("Login realizado!");

      navigate("/dashboard");

    } catch {

      toast.error("Usuário ou senha inválidos");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6 overflow-hidden relative">

      {/* GLOW ESQUERDA */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]"></div>

      {/* GLOW DIREITA */}
      <div className="absolute w-[400px] h-[400px] bg-emerald-400/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]"></div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-md">

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl">

          {/* LOGO */}
          <div className="text-center mb-8">

            <h1 className="text-5xl font-extrabold text-white mb-2">
              💈 BarberPro
            </h1>

            <p className="text-gray-400">
              Acesse o painel da barbearia
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* USERNAME */}
            <div>

              <label className="text-gray-300 text-sm">
                Usuário
              </label>

              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value
                  })
                }
                className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Digite seu usuário"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="text-gray-300 text-sm">
                Senha
              </label>

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value
                  })
                }
                className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Digite sua senha"
              />

            </div>

            {/* BOTÃO */}
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 py-4 rounded-xl text-white font-semibold hover:scale-[1.02] transition-all duration-300 shadow-2xl disabled:opacity-50"
            >

              {loading ? "Entrando..." : "Entrar"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}