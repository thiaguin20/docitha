import React from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-slate-100 to-[#f0f5f6] px-4">
      <div className="w-full max-w-md rounded-[30px] bg-white/90 p-8 shadow-xl shadow-slate-300/20 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-[#376d75] mb-6 text-center">Cadastro desativado</h1>
        <p className="text-sm text-slate-600 mb-6">
          O cadastro de novos usuários foi removido. Use apenas o login do administrador fixo.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full rounded-2xl bg-[#76A5AF] py-3 text-sm font-semibold text-white transition hover:bg-[#5c8f99]"
        >
          Voltar para a Home
        </button>
      </div>
    </section>
  );
}
