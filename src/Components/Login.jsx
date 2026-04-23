import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMensagem("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensagem(data.message || "Erro no login. Verifique seus dados.");
      } else {
        localStorage.setItem("token", data.token);
        setMensagem(`Login realizado! Bem-vindo ${data.user.nome}`);
        navigate("/admin");
      }
    } catch (error) {
      setMensagem("Não foi possível conectar ao servidor. Verifique se o backend está ligado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-100 to-[#f0f5f6] px-4">
      <div className="w-full max-w-md rounded-[30px] bg-white/90 p-8 shadow-xl shadow-slate-300/20 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-[#376d75] mb-6 text-center">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
              required
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-[#76A5AF] py-3 text-sm font-semibold text-white transition hover:bg-[#5c8f99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-sm text-slate-600">
          <button
            type="button"
            onClick={logout}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Voltar para a home
          </button>
        </div>

        {mensagem && (
          <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {mensagem}
          </p>
        )}
      </div>
    </section>
  );
}
