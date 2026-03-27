export default function Sobre() {
  return (
    <section className="
      w-full
      mt-6
      relative
      bg-[#fff5f8]
      overflow-hidden
      
    ">

      {/* CURVA TOPO */}
      <div className="absolute top-0 left-0 w-full flex justify-center overflow-hidden leading-none  px-6">
        <svg viewBox="0 0 1440 120" className="w-full max-w-[720px] h-[60px]">
          <path
            d="M0,40 C240,100 480,0 720,40 C960,80 1200,20 1440,40 L1440,0 L0,0 Z"
            fill="#f8d7e3"
          />
        </svg>
      </div>

      {/* CURVA EMBAIXO */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center overflow-hidden leading-none px-6">
        <svg viewBox="0 0 1440 120" className="w-full max-w-[720px] h-[60px] rotate-180">
          <path
            d="M0,40 C240,100 480,0 720,40 C960,80 1200,20 1440,40 L1440,0 L0,0 Z"
            fill="#f8d7e3"
          />
        </svg>
      </div>

      {/* CONTAINER */}
      <div className="
        relative
        w-full max-w-[720px]
        mx-auto

        px-6
        pt-28
        pb-28

        flex flex-col items-center
        gap-14
      ">

        

        {/* TÍTULO */}
        <div className="text-center relative z-10">
          <h2 className="
            text-[#d94f87]
            text-4xl md:text-5xl
            font-[Alex_Brush]
          ">
            Sobre nós
          </h2>

          <div className="w-12 h-[2px] bg-[#E8719D] mx-auto mt-3" />
        </div>

        {/* TEXTO */}
        <div className="
          w-full max-w-[600px]
          text-center
          text-gray-700
          text-base md:text-lg
          leading-relaxed

          bg-white/60
          backdrop-blur-sm

          px-6 py-6 md:px-8 md:py-8

          rounded-[20px]

          shadow-[0_8px_25px_rgba(0,0,0,0.05)]

          border border-[#f3d3df]

          relative z-10
        ">

          <p>
            A <span className="text-[#d94f87] font-semibold">Docitha</span> nasceu em 2010 com o propósito de transformar doces em experiências únicas.
          </p>

          <p className="mt-6">
            Cada detalhe é pensado com cuidado, desde a escolha dos ingredientes até a apresentação, para tornar cada momento ainda mais especial.
          </p>

        </div>

        {/* PILARES */}
        <div className="
          flex flex-col md:flex-row
          gap-12 md:gap-20
          text-center
          relative z-10
        ">

          <div>
            <p className="text-[#d94f87] font-semibold tracking-wide">
              QUALIDADE
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Ingredientes selecionados
            </p>
          </div>

          <div>
            <p className="text-[#d94f87] font-semibold tracking-wide">
              CARINHO
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Produção artesanal
            </p>
          </div>

          <div>
            <p className="text-[#d94f87] font-semibold tracking-wide">
              EXPERIÊNCIA
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Momentos inesquecíveis
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}