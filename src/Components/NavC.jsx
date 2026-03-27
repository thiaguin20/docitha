import { Link } from "react-router-dom";

export default function NavC(){
    return(
        <>
    <div className="flex flex-col items-center mt-6 gap-6">
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

        </div>

      </nav>
      </div>
        </>
    
    )
}