import { auth } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";

// 🔐 CADASTRAR
export async function cadastrar(email, senha) {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, senha);
    return user;
  } catch (error) {
    console.error("Erro ao cadastrar:", error.message);
    throw error;
  }
}

// 🔐 LOGIN
export async function login(email, senha) {
  try {
    const user = await signInWithEmailAndPassword(auth, email, senha);
    return user;
  } catch (error) {
    console.error("Erro ao logar:", error.message);
    throw error;
  }
}