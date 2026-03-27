import { useState } from "react";
import { cadastrar, login } from "../auth";

export default function LoginModal({ fechar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modoCadastro, setModoCadastro] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (modoCadastro) {
        await cadastrar(email, senha);
        alert("Conta criada!");
      } else {
        await login(email, senha);
        alert("Login feito!");
      }
      fechar();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* FUNDO ESCURO */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={fechar}
      />

      {/* POPUP */}
      <div className="relative bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-[350px] z-10">

        {/* FECHAR */}
        <button
          onClick={fechar}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-3">
          {modoCadastro ? "Cadastro" : "Login"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="border p-2 rounded"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button className="bg-pink-500 text-white p-2 rounded">
            {modoCadastro ? "Cadastrar" : "Entrar"}
          </button>
        </form>

        <p
          className="text-sm text-center mt-2 cursor-pointer text-blue-500"
          onClick={() => setModoCadastro(!modoCadastro)}
        >
          {modoCadastro
            ? "Já tem conta? Entrar"
            : "Não tem conta? Criar"}
        </p>

      </div>
    </div>
  );
}