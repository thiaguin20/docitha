import { useEffect, useState } from "react";
import { API_URL } from "../api";

export default function CardC() {
  function formatarValor(valor) {
    if (typeof valor === "number") {
      return "R$ " + valor.toFixed(2).replace(".", ",");
    }
    return valor;
  }

  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categoria, setCategoria] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const catResponse = await fetch(`${API_URL}/categorias`);
        const catData = await catResponse.json();
        setCategorias(catData || []);

        if (catData.length > 0) {
          setCategoria(catData[0].id);
        }

        const prodResponse = await fetch(`${API_URL}/produtos`);
        const prodData = await prodResponse.json();

        const produtosPorCateg = Object.values(prodData).flatMap((cat) =>
          (cat?.produtos || []).map((item) => ({
            ...item,
            categoriaId: item.categoriaId || item.categoria,
          }))
        );

        setProdutos(produtosPorCateg);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoriaNome =
    categorias.find((c) => c.id === categoria)?.nome || "Cardápio";

  const categoriaProdutos = produtos.filter(
    (p) => p.categoriaId === categoria
  );

  return (
    <section className="w-full pb-12">

      {/* ── Tabs de categoria  */}
      <div className="flex justify-center px-4 mt-6">
        <div className="flex flex-wrap gap-2 bg-[#f8e9f0] p-2 rounded-2xl shadow-inner w-full max-w-2xl justify-center">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoria(cat.id)}
              className={`
                py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap
                ${categoria === cat.id
                  ? "bg-[#E8719D] text-white shadow-md scale-[1.03]"
                  : "text-[#b05480] hover:bg-[#f3cfe0]"
                }
              `}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {/* ── Título */}
      <div className="flex flex-col items-center mt-5 mb-1 px-4 gap-1">
        <h2 className="text-3xl md:text-4xl text-[#d94f87] font-[Alex_Brush] leading-tight">
          {categoriaNome}
        </h2>
      </div>

      {/* ── Grid */}
      <div className="w-full max-w-[1100px] mx-auto px-4 mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">

        {/* LOADING  */}
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#f3d3df] p-3 animate-pulse"
              >
                <div className="h-[120px] bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))

          : categoriaProdutos.map((item) => (
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
                <div className="relative w-full h-[120px] md:h-[155px] flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      item.imagem?.startsWith("http")
                        ? item.imagem
                        : "https://via.placeholder.com/150"
                    }
                    alt={item.nome}
                    className="max-h-[100px] md:max-h-[135px] object-contain"
                  />
                </div>

                <div className="flex flex-col flex-1 p-3 gap-2">
                  <h3 className="font-bold text-sm md:text-base">
                    {item.nome}
                  </h3>

                  <div className="flex flex-col gap-1">
                    {item.precos.map((p) => (
                      <div
                        key={`${item.id}-${p.label}`}
                        className="flex justify-between text-xs"
                      >
                        <span>{p.label}</span>
                        <span className="font-bold text-[#c2185b]">
                          {formatarValor(p.valor)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}