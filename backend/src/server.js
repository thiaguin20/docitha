require("dotenv").config();

const express = require("express");
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const dataDir = path.join(__dirname, "..", "data");
const produtosFile = path.join(dataDir, "produtos.json");
const usuariosFile = path.join(dataDir, "usuarios.json");

const PORT = process.env.PORT || 3000;

/* ================= SUPABASE ================= */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const BUCKET_NAME = process.env.SUPABASE_BUCKET || "docitha";
const PUBLIC_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/`;

app.use(express.json());
/* Removido: app.use("/uploads", express.static(uploadDir)); */

/* ================= CORS ================= */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ================= UTIL ================= */

async function readJson(file) {
  const data = await fsPromises.readFile(file, "utf8");
  return JSON.parse(data || "{}");
}

let writeLock = Promise.resolve();

function withWriteLock(task) {
  writeLock = writeLock.then(() => task(), () => task());
  return writeLock;
}

async function writeJson(file, data) {
  await fsPromises.writeFile(file, JSON.stringify(data, null, 2));
}

/* ======== IMAGEM (SUPABASE STORAGE) ======== */

/**
 * Extrai o caminho do arquivo da URL pública Supabase
 * URL: https://... /storage/v1/object/public/bucket/2024-01-01-file.jpg
 * Retorna: 2024-01-01-file.jpg
 */
function extrairNomeArquivo(url) {
  if (!url) return null;
  
  // Se contém PUBLIC_URL, extrai nome após o bucket
  if (url.includes(BUCKET_NAME + "/")) {
    return url.split(BUCKET_NAME + "/")[1];
  }
  
  // Tenta último segmento se for um nome simples
  if (!url.includes("/")) {
    return url;
  }
  
  return null;
}

/**
 * Faz upload de arquivo para Supabase Storage
 */
async function uploadParaSupabase(file) {
  try {
    // Nome único: timestamp + extensão original
    const ext = file.originalname.split(".").pop() || "jpg";
    const nomeArquivo = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    // Upload para Supabase
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(nomeArquivo, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });
    
    if (error) {
      console.error(" Erro upload Supabase:", error.message);
      return null;
    }
    
    // Retorna URL pública
    const urlPublica = `${PUBLIC_URL}${nomeArquivo}`;
    console.log("✅ Arquivo enviado para Supabase:", nomeArquivo);
    return urlPublica;
  } catch (err) {
    console.error(" Erro ao fazer upload:", err.message);
    return null;
  }
}

/**
 * Deleta arquivo do Supabase Storage
 */
async function deletarImagemSupabase(url) {
  try {
    const nome = extrairNomeArquivo(url);
    if (!nome) {
      console.log(" Ignorando imagem (não é upload):", url);
      return;
    }
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([nome]);
    
    if (error) {
      console.log(" Arquivo não encontrado ou erro ao deletar:", nome);
      return;
    }
    
    console.log(" Arquivo deletado do Supabase:", nome);
  } catch (err) {
    console.error(" Erro ao deletar imagem:", err.message);
  }
}

/* Função legada mantida para compatibilidade (agora chamará deletarImagemSupabase) */
function deletarImagemSeExiste(url) {
  return deletarImagemSupabase(url);
}

/* ======== MULTER (MEMORY) ======== */

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

/* ================= AUTH ================= */

function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token não enviado" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
}

function somenteAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  next();
}

/* ================= INIT ================= */

async function init() {
  await fsPromises.mkdir(dataDir, { recursive: true });
  /* Removido: await fsPromises.mkdir(uploadDir, { recursive: true }); */

  if (!require("fs").existsSync(produtosFile)) {
    await writeJson(produtosFile, {
      categorias: [],
      produtos: [],
    });
  }

  if (!require("fs").existsSync(usuariosFile)) {
    await writeJson(usuariosFile, {
      usuarios: [
        {
          id: "admin",
          nome: "Admin",
          email: "admin@docitha.com",
          senha:
            "$2b$10$rs7Z5V7rmiH2DzRSsS9Bcek0D56c8y8W2KjUTMCUspXwwOSGnc35q",
          role: "admin",
        },
      ],
    });
  }
}

init();

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const data = await readJson(usuariosFile);
  const user = data.usuarios.find((u) => u.email === email);

  if (!user) return res.status(401).json({ message: "Erro login" });

  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) return res.status(401).json({ message: "Erro login" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, user: { nome: user.nome } });
});

/* ================= UPLOAD ================= */

app.post("/upload", autenticar, somenteAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Erro upload" });

  try {
    // Faz upload para Supabase
    const url = await uploadParaSupabase(req.file);
    
    if (!url) {
      return res.status(500).json({ message: "Erro ao fazer upload" });
    }
    
    res.json({ url });
  } catch (err) {
    console.error("Erro ao processar upload:", err);
    res.status(500).json({ message: "Erro ao fazer upload" });
  }
});

/* ================= CATEGORIAS ================= */

// GET categorias
app.get("/categorias", async (req, res) => {
  try {
    const data = await readJson(produtosFile);
    res.json(data.categorias || []);
  } catch (err) {
    res.status(500).json({ message: "Erro ao carregar categorias" });
  }
});

// CREATE categoria
app.post("/categorias", autenticar, somenteAdmin, async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ message: "Nome obrigatório" });
  }

  const categoria = await withWriteLock(async () => {
    const data = await readJson(produtosFile);

    const nova = {
      id: "cat-" + Date.now(),
      nome,
    };

    data.categorias.push(nova);
    await writeJson(produtosFile, data);

    return nova;
  });

  res.json(categoria);
});

// UPDATE categoria
app.put("/categorias/:id", autenticar, somenteAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;

  await withWriteLock(async () => {
    const data = await readJson(produtosFile);

    const cat = data.categorias.find((c) => c.id === id);
    if (cat) cat.nome = nome;

    await writeJson(produtosFile, data);
  });

  res.json({ message: "ok" });
});

// DELETE categoria
app.delete("/categorias/:id", autenticar, somenteAdmin, async (req, res) => {
  const { id } = req.params;

  await withWriteLock(async () => {
    const data = await readJson(produtosFile);

    // remove produtos da categoria
    const produtos = data.produtos.filter((p) => p.categoriaId === id);

    // Deleta todas as imagens em paralelo
    await Promise.all(
      produtos.map((p) => p.imagem ? deletarImagemSeExiste(p.imagem) : Promise.resolve())
    );

    data.produtos = data.produtos.filter((p) => p.categoriaId !== id);
    data.categorias = data.categorias.filter((c) => c.id !== id);

    await writeJson(produtosFile, data);
  });

  res.json({ message: "ok" });
});

/* ================= PRODUTOS ================= */

app.get("/produtos", async (req, res) => {
  const data = await readJson(produtosFile);

  const result = {};
  data.categorias.forEach((c) => {
    result[c.id] = {
      titulo: c.nome,
      produtos: data.produtos.filter((p) => p.categoriaId === c.id),
    };
  });

  res.json(result);
});

/* criar produto */

app.post("/produtos", autenticar, somenteAdmin, async (req, res) => {
  const { categoria, id, nome, imagem, precos, infos } = req.body;

  const produto = await withWriteLock(async () => {
    const data = await readJson(produtosFile);

    const novo = {
      id,
      nome,
      imagem,
      categoriaId: categoria,
      precos,
      infos: infos || [],
    };

    data.produtos.push(novo);
    await writeJson(produtosFile, data);
    return novo;
  }); 

  res.json(produto);
});

/*editar produto*/

app.put("/produtos/:id", autenticar, somenteAdmin, async (req, res) => {
  const { id } = req.params;

  await withWriteLock(async () => {
    const data = await readJson(produtosFile);
    const p = data.produtos.find((x) => x.id === id);
    if (!p) return;

    if (req.body.imagem && req.body.imagem !== p.imagem) {
      await deletarImagemSeExiste(p.imagem);
    }

    Object.assign(p, {
      nome: req.body.nome ?? p.nome,
      imagem: req.body.imagem ?? p.imagem,
      precos: req.body.precos ?? p.precos,
      infos: req.body.infos ?? p.infos,
      categoriaId: req.body.categoria ?? p.categoriaId,
    });

    await writeJson(produtosFile, data);
  });

  res.json({ message: "ok" });
});

/*deletar produto*/

app.delete("/produtos/:id", autenticar, somenteAdmin, async (req, res) => {
  const { id } = req.params;

  await withWriteLock(async () => {
    const data = await readJson(produtosFile);

    const index = data.produtos.findIndex((p) => p.id === id);
    if (index === -1) return;

    // Deleta imagem do Supabase
    if (data.produtos[index].imagem) {
      await deletarImagemSeExiste(data.produtos[index].imagem);
    }
    
    data.produtos.splice(index, 1);

    await writeJson(produtosFile, data);
  });

  res.json({ message: "ok" });
});

/* ================= SERVER ================= */

app.get("/", (req, res) => {
  res.send("API DOCITHA funcionando");
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});