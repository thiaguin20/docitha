import Beijinho from "../assets/Docinhos_Tradicionais/beijinho.png";
import Brigadeiro from "../assets/Docinhos_Tradicionais/brigadeiro.png";
import DoisAmores from "../assets/Docinhos_Tradicionais/DoisAmores.png";
import Prestigio from "../assets/Docinhos_Tradicionais/prestigio.png";

import NinhoN from "../assets/Docinhos_Gourmet/NinhoNutella.png";
import Ferrero from "../assets/Docinhos_Gourmet/ferrero.png";
import Churros from "../assets/Docinhos_Gourmet/churros.png";
import Limao from "../assets/Docinhos_Gourmet/limao.png";

import BombomA from "../assets/Docinhos_Especiais/bombomA.png";
import taca from "../assets/Docinhos_Especiais/taca.png";

import { useState } from "react";

export default function CardC() {
  function formatarValor(valor) {
    if (typeof valor === "number") {
      return "R$ " + valor.toFixed(2).replace(".", ",");
    }
    return valor;
  }

  const [categoria, setCategoria] = useState("tradicionais");

  const dados = {
    tradicionais: {
      titulo: "Docinhos Tradicionais",
      produtos: [
        {
          id: "brigadeiro",
          nome: "Brigadeiro",
          imagem: Brigadeiro,
          precos: [
            { label: "Unidade", valor: 2.20 },
            { label: "50 Un", valor: 104.50 },
            { label: "100 Un", valor: 198.00 },
          ],
        },
        {
          id: "beijinho",
          nome: "Beijinho",
          imagem: Beijinho,
          precos: [
            { label: "Unidade", valor: 2.20 },
            { label: "50 Un", valor: 104.50 },
            { label: "100 Un", valor: 198.00 },
          ],
        },
        {
          id: "dois-amores",
          nome: "Dois Amores",
          imagem: DoisAmores,
          precos: [
            { label: "Unidade", valor: 2.20 },
            { label: "50 Un", valor: 104.50 },
            { label: "100 Un", valor: 198.00 },
          ],
        },
        {
          id: "prestigio",
          nome: "Prestígio",
          imagem: Prestigio,
          precos: [
            { label: "Unidade", valor: 2.20 },
            { label: "50 Un", valor: 104.50 },
            { label: "100 Un", valor: 198.00 },
          ],
        },
      ],
    },

    gourmet: {
      titulo: "Docinhos Gourmet",
      
      produtos: [
        {
          id: "ninho-nutella",
          nome: "Ninho com Nutella",
          imagem: NinhoN,
          precos: [
            { label: "Unidade", valor: 2.60 },
            { label: "50 Un", valor: 123.50 },
          ],
        },
        {
          id: "ferrero",
          nome: "Ferrero Rocher",
          imagem: Ferrero,
          precos: [
            { label: "Unidade", valor: 2.60 },
            { label: "50 Un", valor: 123.50 },
          ],
        },
        {
          id: "churros",
          nome: "Churros",
          imagem: Churros,
          precos: [
            { label: "Unidade", valor: 2.60 },
            { label: "50 Un", valor: 123.50 },
          ],
        },
        {
          id: "limao",
          nome: "Limão",
          imagem: Limao,
          precos: [
            { label: "Unidade", valor: 2.60 },
            { label: "50 Un", valor: 123.50 },
          ],
        },
      ],
    },

    especiais: {
      titulo: "Especiais",
      
      produtos: [
        {
          id: "taca-docitha",
          nome: "Taça Tentação Docitha",
          imagem: taca,
          precos: [
            { label: "Unidade", valor: 20.00 },
            { label: "Sabores", valor: "Uva e morango" },
          ],
        },
        {
          id: "bombom-aberto",
          nome: "Bombom Aberto",
          imagem: BombomA,
          precos: [
            { label: "Unidade", valor: 16.00 },
            { label: "Sabores", valor: "Uva e morango" },
          ],
        },
      ],
    },
  };

  const categoriaAtual = dados[categoria];

  return (
    <section className="w-full pb-12">

      {/* ── Tabs de categoria  */}
      <div className="flex justify-center px-4 mt-6">
        <div className="flex gap-1 bg-[#f8e9f0] p-1.5 rounded-2xl shadow-inner w-full max-w-sm">
          {Object.entries(dados).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setCategoria(key)}
              className={`
                flex-1 py-2 px-1 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200
                ${categoria === key
                  ? "bg-[#E8719D] text-white shadow-md scale-[1.03]"
                  : "text-[#b05480] hover:bg-[#f3cfe0]"
                }
              `}
            >
              <span className="block text-base leading-none mb-0.5">{val.emoji}</span>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Título da seção */}
      <div className="flex flex-col items-center mt-5 mb-1 px-4 gap-1">
        {/* linha decorativa */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E8719D] to-[#E8719D]" />
          <span className="text-[#E8719D] text-lg">✦</span>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent via-[#E8719D] to-[#E8719D]" />
        </div>

        <h2 className="text-3xl md:text-4xl text-[#d94f87] font-[Alex_Brush] leading-tight">
          {categoriaAtual.titulo}
        </h2>

        <div className="flex items-center gap-3 w-full max-w-xs">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[#5b9bd5] to-[#5b9bd5]" />
          <span className="text-[#5b9bd5] text-lg">✦</span>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent via-[#5b9bd5] to-[#5b9bd5]" />
        </div>
      </div>

      {/* ── Grid de cards */}
      <div className="
        w-full max-w-[1100px] mx-auto px-4 mt-4
        grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        gap-3 md:gap-5
      ">
        {categoriaAtual.produtos.map((item) => (
          <div
            key={item.id}
            className="
              group relative flex flex-col
              bg-white rounded-2xl overflow-hidden
              border border-[#f3d3df]
              shadow-[0_4px_18px_rgba(232,113,157,0.13)]
              hover:shadow-[0_12px_36px_rgba(232,113,157,0.28)]
              hover:-translate-y-1 hover:scale-[1.02]
              transition-all duration-300
            "
          >
            {/* Badge de destaque sutil no canto — rosa/azul alterna */}
            <span className="
              absolute top-2 right-2 z-10
              w-2 h-2 rounded-full
              bg-[#5b9bd5] opacity-70
            " />

            {/* Área da imagem */}
            <div className="
              relative w-full h-[120px] md:h-[155px]
              bg-gradient-to-br from-[#fff5f9] to-[#e8f2fc]
              flex items-center justify-center overflow-hidden
            ">
              {/* círculo decorativo atrás */}
              <div className="
                absolute w-24 h-24 md:w-32 md:h-32 rounded-full
                bg-gradient-to-br from-[#fce4ef] to-[#dbeeff]
                opacity-60
              " />
              <img
                src={item.imagem}
                alt={item.nome}
                className="relative max-h-[100px] md:max-h-[135px] object-contain drop-shadow-md
                           group-hover:scale-105 transition-transform duration-300"
                onError={(e) => (e.target.src = Brigadeiro)}
              />
            </div>

            {/* Conteúdo */}
            <div className="flex flex-col flex-1 p-3 gap-2">

              {/* Nome */}
              <h3 className="
                font-bold text-[#2d3a5a] text-sm md:text-base leading-snug
                min-h-[36px] md:min-h-[44px]
              ">
                {item.nome}
              </h3>

              {/* Divisor pontilhado */}
              <div className="border-t border-dashed border-[#f0d0dd]" />

              {/* Preços */}
              <div className="flex flex-col gap-1">
                {item.precos.map((p) => (
                  <div
                    key={`${item.id}-${p.label}`}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[10px] md:text-xs text-[#9ca3af] font-medium uppercase tracking-wide">
                      {p.label}
                    </span>
                    <span className="text-[11px] md:text-sm text-[#c2185b] font-extrabold tracking-wide">
                      {formatarValor(p.valor)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Botão */}
              <a
                href="https://api.whatsapp.com/send?phone=5518997409697"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-auto
                  flex items-center justify-center gap-1.5
                  bg-gradient-to-r from-[#E8719D] to-[#d95c8a]
                  text-white text-xs md:text-sm font-semibold
                  py-2 rounded-xl
                  shadow-[0_3px_12px_rgba(232,113,157,0.35)]
                  hover:shadow-[0_5px_18px_rgba(232,113,157,0.5)]
                  hover:from-[#d95c8a] hover:to-[#c44d7b]
                  active:scale-95 transition-all duration-200
                "
              >
                {/* ícone whatsapp inline svg pequeno */}
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Encomendar
              </a>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
