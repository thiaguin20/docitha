import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

const initialForm = {
  id: "",
  nome: "",
  categoria: "",
  imagem: "",
  precos: [{ label: "", valor: "" }],
  infos: [],
};

export default function Admin() {
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [novaCat, setNovaCat] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatNome, setEditingCatNome] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchCategorias();
    fetchProdutos();
  }, [token, navigate]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  function handleFetchError(response) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      navigate("/login");
      return true;
    }
    return false;
  }

  async function fetchCategorias() {
    try {
      const response = await fetch(`${API_URL}/categorias`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleFetchError(response)) return;

      if (!response.ok) throw new Error("Falha ao carregar categorias");
      const data = await response.json();
      setCategorias(data || []);
      
      if (data.length > 0 && !form.categoria) {
        setForm((prev) => ({ ...prev, categoria: data[0].id }));
      }
    } catch (error) {
      setMensagem("Erro ao carregar categorias.");
      setTipoMensagem("erro");
    }
  }

  async function fetchProdutos() {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/produtos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleFetchError(response)) return;

      if (!response.ok) throw new Error("Falha ao carregar produtos");
      const data = await response.json();
      
      const lista = Object.values(data).flatMap((cat) =>
        (cat?.produtos || []).map((item) => ({
          ...item,
          categoria: item.categoriaId,
        }))
      );
      setProdutos(lista);
    } catch (error) {
      setMensagem("Não foi possível carregar produtos.");
      setTipoMensagem("erro");
    } finally {
      setIsLoading(false);
    }
  }

  function setCampo(chave, valor) {
    setForm((prev) => ({ ...prev, [chave]: valor }));
  }

  function handlePrecoChange(index, chave, valor) {
    setForm((prev) => {
      const novoPrecos = [...prev.precos];
      novoPrecos[index] = { ...novoPrecos[index], [chave]: valor };
      return { ...prev, precos: novoPrecos };
    });
  }

  function handleInfoChange(index, chave, valor) {
    setForm((prev) => {
      const novasInfos = [...prev.infos];
      novasInfos[index] = { ...novasInfos[index], [chave]: valor };
      return { ...prev, infos: novasInfos };
    });
  }

  function adicionarPreco() {
    setForm((prev) => ({
      ...prev,
      precos: [...prev.precos, { label: "", valor: "" }],
    }));
  }

  function removerPreco(index) {
    setForm((prev) => ({
      ...prev,
      precos: prev.precos.filter((_, i) => i !== index),
    }));
  }

  function adicionarInfo() {
    setForm((prev) => ({
      ...prev,
      infos: [...prev.infos, { label: "", valor: "" }],
    }));
  }

  function removerInfo(index) {
    setForm((prev) => ({
      ...prev,
      infos: prev.infos.filter((_, i) => i !== index),
    }));
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setIsUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (handleFetchError(response)) return;

      const data = await response.json();
      if (!response.ok) {
        setUploadError(data.message || "Falha ao enviar imagem.");
        return;
      }

      setForm((prev) => ({ ...prev, imagem: data.url }));
      setPreviewUrl(data.url);
    } catch (error) {
      setUploadError("Erro ao enviar imagem.");
    } finally {
      setIsUploading(false);
    }
  }

  function resetForm() {
    setForm({ ...initialForm, categoria: categorias[0]?.id || "" });
    setEditingId(null);
    setPreviewUrl("");
    setUploadError("");
  }

  function startEdit(produto) {
    setForm({
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoriaId || produto.categoria,
      imagem: produto.imagem,
      precos: produto.precos?.length ? produto.precos : [{ label: "", valor: "" }],
      infos: produto.infos?.length ? produto.infos : [],
    });
    setPreviewUrl(produto.imagem?.startsWith("http") ? produto.imagem : "");
    setEditingId(produto.id);
  }

  function validar() {
    const msgs = [];
    if (!form.nome.trim()) msgs.push("Nome obrigatório");
    if (!form.categoria) msgs.push("Categoria obrigatória");
    if (!form.imagem.trim()) msgs.push("Imagem obrigatória");

    const temPreco = form.precos.some((p) => p.label.trim() && p.valor.toString().trim());
    const temInfo = form.infos.some((i) => i.label.trim() && i.valor.toString().trim());
    if (!temPreco && !temInfo) msgs.push("Adicione pelo menos 1 preço ou 1 informação");

    if (msgs.length > 0) {
      setMensagem(msgs.join("\n"));
      setTipoMensagem("erro");
      return false;
    }
    return true;
  }

  async function criarProduto(event) {
    event.preventDefault();
    setMensagem("");

    if (!validar()) return;

    const novoProduto = {
      categoria: form.categoria,
      id: Date.now().toString(),
      nome: form.nome.trim(),
      imagem: form.imagem.trim(),
      precos: form.precos.filter((p) => p.label.trim() && p.valor.toString().trim()),
      infos: form.infos.filter((i) => i.label.trim() && i.valor.toString().trim()),
    };

    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoProduto),
      });

      if (handleFetchError(response)) return;

      const data = await response.json();
      if (!response.ok) {
        setMensagem(data.message || "Falha ao criar produto.");
        setTipoMensagem("erro");
        return;
      }

      resetForm();
      await fetchProdutos();
      setMensagem("✓ Produto criado com sucesso!");
      setTipoMensagem("sucesso");
    } catch (error) {
      setMensagem("Erro ao criar produto.");
      setTipoMensagem("erro");
    } finally {
      setIsSaving(false);
    }
  }

  async function atualizarProduto(event) {
    event.preventDefault();
    setMensagem("");

    if (!validar()) return;

    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/produtos/${encodeURIComponent(editingId)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoria: form.categoria,
          nome: form.nome.trim(),
          imagem: form.imagem.trim(),
          precos: form.precos.filter((p) => p.label.trim() && p.valor.toString().trim()),
          infos: form.infos.filter((i) => i.label.trim() && i.valor.toString().trim()),
        }),
      });

      if (handleFetchError(response)) return;

      const data = await response.json();
      if (!response.ok) {
        setMensagem(data.message || "Falha ao atualizar.");
        setTipoMensagem("erro");
        return;
      }

      resetForm();
      await fetchProdutos();
      setMensagem("✓ Produto atualizado com sucesso!");
      setTipoMensagem("sucesso");
    } catch (error) {
      setMensagem("Erro ao atualizar produto.");
      setTipoMensagem("erro");
    } finally {
      setIsSaving(false);
    }
  }

  async function deletarProduto(id) {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    setMensagem("");
    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/produtos/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleFetchError(response)) return;

      if (!response.ok) {
        const data = await response.json();
        setMensagem(data.message || "Falha ao deletar.");
        setTipoMensagem("erro");
        return;
      }

      if (editingId === id) resetForm();
      await fetchProdutos();
      setMensagem("✓ Produto deletado!");
      setTipoMensagem("sucesso");
    } catch (error) {
      setMensagem("Erro ao deletar produto.");
      setTipoMensagem("erro");
    } finally {
      setIsSaving(false);
    }
  }

  async function criarCategoria() {
    if (!novaCat.trim()) return;

    try {
      const response = await fetch(`${API_URL}/categorias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: novaCat.trim() }),
      });

      if (handleFetchError(response)) return;

      if (!response.ok) {
        const data = await response.json();
        setMensagem(data.message || "Erro ao criar categoria.");
        setTipoMensagem("erro");
        return;
      }

      setNovaCat("");
      await fetchCategorias();
      setMensagem("✓ Categoria criada!");
      setTipoMensagem("sucesso");
    } catch (error) {
      setMensagem("Erro ao criar categoria.");
      setTipoMensagem("erro");
    }
  }

  async function atualizarCategoria(id) {
    if (!editingCatNome.trim()) return;

    try {
      const response = await fetch(`${API_URL}/categorias/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome: editingCatNome.trim() }),
      });

      if (handleFetchError(response)) return;

      if (!response.ok) {
        const data = await response.json();
        setMensagem(data.message || "Erro ao atualizar.");
        setTipoMensagem("erro");
        return;
      }

      setEditingCatId(null);
      await fetchCategorias();
      setMensagem("✓ Categoria atualizada!");
      setTipoMensagem("sucesso");
    } catch (error) {
      setMensagem("Erro ao atualizar categoria.");
      setTipoMensagem("erro");
    }
  }

  async function deletarCategoria(id) {
    if (!confirm("Deletar categoria e TODOS os produtos dentro dela?")) return;

    try {
      const response = await fetch(`${API_URL}/categorias/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (handleFetchError(response)) return;

      if (!response.ok) {
        const data = await response.json();
        setMensagem(data.message || "Erro ao deletar.");
        setTipoMensagem("erro");
        return;
      }

      await fetchCategorias();
      await fetchProdutos();
      if (form.categoria === id) resetForm();
      setMensagem("✓ Categoria deletada!");
      setTipoMensagem("sucesso");
    } catch (error) {
      setMensagem("Erro ao deletar categoria.");
      setTipoMensagem("erro");
    }
  }

  const submitAction = editingId ? atualizarProduto : criarProduto;

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white/95 p-6 shadow-lg shadow-slate-300/20">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Painel Admin</h1>
            <p className="text-sm text-slate-600">Gerencie categorias e produtos.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Ver cardápio
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-2xl bg-[#f97316] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d46010]"
            >
              Logout
            </button>
          </div>
        </div>

        {mensagem && (
          <div
            className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
              tipoMensagem === "sucesso"
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {mensagem}
          </div>
        )}

        <div className="mb-8 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-800">Categorias</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={novaCat}
              onChange={(e) => setNovaCat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && criarCategoria()}
              placeholder="Nome da nova categoria..."
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
            />
            <button
              type="button"
              onClick={criarCategoria}
              className="rounded-2xl bg-[#76A5AF] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5c8f99]"
            >
              Criar
            </button>
          </div>

          <div className="space-y-2">
            {categorias.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4">
                {editingCatId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editingCatNome}
                      onChange={(e) => setEditingCatNome(e.target.value)}
                      className="flex-1 rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => atualizarCategoria(cat.id)}
                      className="rounded-2xl bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingCatId(null)}
                      className="rounded-2xl bg-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-400"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-semibold text-slate-700">{cat.nome}</span>
                    <button
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setEditingCatNome(cat.nome);
                      }}
                      className="rounded-2xl bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deletarCategoria(cat.id)}
                      className="rounded-2xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <form className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6" onSubmit={submitAction}>
            <h2 className="text-xl font-semibold text-slate-800">{editingId ? "Editar produto" : "Novo produto"}</h2>

            <label className="block text-sm text-slate-700">
              Nome *
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setCampo("nome", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
                required
              />
            </label>

            <label className="block text-sm text-slate-700">
              Categoria *
              <select
                value={form.categoria}
                onChange={(e) => setCampo("categoria", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-slate-700">
              Imagem do produto *
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none file:rounded-2xl file:border-0 file:bg-[#76A5AF] file:px-4 file:py-2 file:text-white file:font-semibold file:cursor-pointer focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
              />
            </label>
            {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
            {isUploading && <p className="text-xs text-slate-600">Enviando...</p>}
            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 w-full rounded-2xl border border-slate-200 object-contain"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Preços</span>
                <button
                  type="button"
                  onClick={adicionarPreco}
                  className="rounded-2xl bg-[#76A5AF] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5c8f99]"
                >
                  Adicionar
                </button>
              </div>
              {form.precos.map((preco, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto]">
                  <input
                    type="text"
                    value={preco.label}
                    onChange={(e) => handlePrecoChange(index, "label", e.target.value)}
                    placeholder="Label"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
                  />
                  <input
                    type="text"
                    value={preco.valor}
                    onChange={(e) => handlePrecoChange(index, "valor", e.target.value)}
                    placeholder="Valor"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
                  />
                  <button
                    type="button"
                    onClick={() => removerPreco(index)}
                    className="rounded-2xl bg-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-300"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Informações adicionais</span>
                <button
                  type="button"
                  onClick={adicionarInfo}
                  className="rounded-2xl bg-[#76A5AF] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#5c8f99]"
                >
                  Adicionar
                </button>
              </div>
              {form.infos.map((info, index) => (
                <div key={index} className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto]">
                  <input
                    type="text"
                    value={info.label}
                    onChange={(e) => handleInfoChange(index, "label", e.target.value)}
                    placeholder="Label"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
                  />
                  <input
                    type="text"
                    value={info.valor}
                    onChange={(e) => handleInfoChange(index, "valor", e.target.value)}
                    placeholder="Valor"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#76A5AF] focus:ring-2 focus:ring-[#76A5AF]/20"
                  />
                  <button
                    type="button"
                    onClick={() => removerInfo(index)}
                    className="rounded-2xl bg-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-300"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-2xl bg-[#376d75] py-3 text-sm font-semibold text-white transition hover:bg-[#2a5460] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (editingId ? "Atualizando..." : "Salvando...") : editingId ? "Atualizar" : "Salvar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar edição
              </button>
            )}
          </form>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Produtos ({produtos.length})</h2>
            {isLoading ? (
              <p className="text-slate-600">Carregando...</p>
            ) : produtos.length === 0 ? (
              <p className="text-slate-600">Nenhum produto ainda.</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {produtos.map((produto) => (
                  <div
                    key={produto.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-800 text-sm">{produto.nome}</h3>
                        <p className="text-xs text-slate-600 mt-1">
                          {categorias.find((c) => c.id === produto.categoria)?.nome || produto.categoria}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEdit(produto)}
                          className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deletarProduto(produto.id)}
                          className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 transition"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
