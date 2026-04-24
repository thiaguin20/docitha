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
  const [error, setError] = useState(null);

  // 🔄 função reutilizável
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const catResponse = await fetch(`${API_URL}/categorias`);
      const catData = await catResponse.json();
      setCategorias(catData || []);

      if (catData.length > 0) {
        setCategoria((prev) => prev || catData[0].id);
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
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar o cardápio 😢");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const categoriaNome =
    categorias.find((c) => c.id === categoria)?.nome || "Cardápio";

  const categoriaProdutos = produtos.filter(
    (p) => p.categoriaId === categoria
  );

  return (
    <section className="w-full pb-12">

      {/* 🔄 botão refresh */}
      <div className="flex justify-end px-4 mt-4">
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-[#5b9bd5] text-white hover:bg-[#4a86c5] transition shadow-md"
        >
          🔄 Atualizar
        </button>
      </div>

      {/* ❌ erro */}
      {error && (
        <div className="text-center mt-10 text-red-500 font-semibold">
          {error}
          <br />
          <button
            onClick={fetchData}
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* ── Tabs */}
      {!loading && !error && (
        <div className="flex justify-center px-4 mt-6">
          <div className="flex flex-wrap gap-2 bg-[#f8e9f0] p-2 rounded-2xl shadow-inner w-full max-w-2xl justify-center">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={`
                  py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold
                  transition-all duration-200
                  ${
                    categoria === cat.id
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
      )}

      {/* ── Título */}
      {!loading && !error && (
        <div className="flex flex-col items-center mt-5 mb-1 px-4 gap-1">
          <h2 className="text-3xl md:text-4xl text-[#d94f87] font-[Alex_Brush]">
            {categoriaNome}
          </h2>
        </div>
      )}

      {/* ⏳ Loading skeleton */}
      {loading && (
        <div className="w-full max-w-[1100px] mx-auto px-4 mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-2xl p-4 h-[200px] shadow"
            >
              <div className="bg-gray-200 h-24 rounded-lg mb-3"></div>
              <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* 🧁 Cards */}
      {!loading && !error && (
        <div className="w-full max-w-[1100px] mx-auto px-4 mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {categoriaProdutos.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border shadow hover:shadow-lg transition"
            >
              <div className="h-[130px] flex items-center justify-center bg-gray-50">
                <img
                  src={
                    item.imagem?.startsWith("http")
                      ? item.imagem
                      : "https://via.placeholder.com/150"
                  }
                  alt={item.nome}
                  className="max-h-[100px] object-contain"
                />
              </div>

              <div className="p-3">
                <h3 className="font-bold text-sm">{item.nome}</h3>

                <div className="mt-2">
                  {item.precos.map((p) => (
                    <div
                      key={p.label}
                      className="flex justify-between text-xs"
                    >
                      <span>{p.label}</span>
                      <span className="font-bold text-pink-600">
                        {formatarValor(p.valor)}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://api.whatsapp.com/send?phone=5518997409697"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 text-center bg-pink-500 text-white py-2 rounded-lg text-xs hover:bg-pink-600"
                >
                  Encomendar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}