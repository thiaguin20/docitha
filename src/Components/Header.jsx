import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import LoginModal from "../Components/LoginModal";
import { useState } from "react";

export default function Header() {

  const [abrirLogin, setAbrirLogin] = useState(false);

  return (
    <>
      <header className="
        flex flex-col items-center  gap-3 py-4
        bg-white/80
        backdrop-blur-md
        shadow-sm
        border-b border-white/20
      ">

        {/* LOGO */}
        <img
          src={Logo}
          alt="Docitha"
          className="w-[120px] md:w-[220px]"
        />

        {/* NAV */}
        <nav className="
          bg-white/70 backdrop-blur-md
          rounded-[20px]
          px-6 py-3
          w-[92%] max-w-[1300px]
          shadow-md
        ">

          <div className="
            flex justify-around items-center
            text-[#76A5AF] font-semibold
            text-[14px] md:text-[20px]
          ">

            <Link to="/" className="transition md:hover:scale-105 md:hover:-translate-y-1 active:scale-95">
              Home
            </Link>

            <Link to="/cardapio" className="transition md:hover:scale-105 md:hover:-translate-y-1 active:scale-95">
              Cardápio
            </Link>

            <a href="#footer" className="transition md:hover:scale-105 md:hover:-translate-y-1 active:scale-95">
              Contato
            </a>

            <button className="rounded-[10px] bg-[#76A5AF] text-[white] py-2 px-2" onClick={() => setAbrirLogin(true)}>
              Login
            </button>

          </div>

        </nav>

      </header>

      {/* MODAL */}
      {abrirLogin && (
        <LoginModal fechar={() => setAbrirLogin(false)} />
      )}
    </>
  );
}