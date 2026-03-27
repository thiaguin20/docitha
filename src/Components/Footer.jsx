export default function Footer() {
  
  return (
<>
<div className="mt-6" alt="footer" id="footer">
    
    <footer className="
      bg-[#76A5AF]
      rounded-t-[25px]
      px-6 py-4 w-full mt-auto
      flex
      items-center
      justify-around

      gap-2
      text-white
      text-sm md:text-base
    ">
      <div className="">
      {/* COPYRIGHT */}
      <p>
        © 2025 Docitha — Todos os direitos reservados
      </p>
      </div>
      {/* CONTATOS */}
      <div className="flex gap-4 flex-wrap">

        <a
          href=""
          className="
            border border-white
            px-3 py-1 rounded-md

            hover:bg-white hover:text-[#76A5AF]
            active:scale-95
            transition
          "
        >
          WhatsApp
        </a>

        <a
          href="https://www.instagram.com/docitha.pp/"
          className="
            border border-white
            px-3 py-1 rounded-md

            hover:bg-white hover:text-[#76A5AF]
            active:scale-95
            transition
          "
        >
          Instagram
        </a>

      </div>

    </footer>
    </div>
    </>
  );
}