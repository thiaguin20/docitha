
export default function Main() {
  return (
    <main className="flex-1 pt-6 ">

      <section className="
  bg-gradient-to-br from-[#5F8F99] to-[#afe2ed]
  rounded-l-[25px]

  p-6 md:p-12

  w-[92%] max-w-[1300px]
  ml-auto
  
  
  flex flex-col items-center text-center
  gap-3 md:gap-6
  
">

  {/* TEXTO */}
  <h1 className="
    text-white
    text-3xl md:text-6xl
    font-[Alex_Brush]
  ">
    Docitha
  </h1>

  <p className="
    text-white font-semibold
    text-sm md:text-lg
  ">
    Confeitaria gourmet
  </p>

  {/* BOTÕES */}
  <div className="
    flex flex-col md:flex-row
    gap-2 md:gap-4
    mt-2 md:mt-4

    
  ">

    <button className="
      border border-white text-white
      px-4 py-2 rounded-md
      text-sm md:text-base
      hover:bg-white hover:text-[#76A5AF]

      transition duration-300
             hover:scale-105
             hover:-translate-y-2

             active:scale-95 active:translate-y-1
    ">
      Faça seu pedido
    </button>

    <button className="
      border border-white text-white
      px-4 py-2 rounded-md
      text-sm md:text-base
      hover:bg-white hover:text-[#76A5AF]

      transition duration-300
             hover:scale-105
             hover:-translate-y-2

             active:scale-95 active:translate-y-1
    ">
      Ver cardápio
    </button>

  </div>

</section>
    </main>
  );
}