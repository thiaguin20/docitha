import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCtvukEjpid5sNBj5oH2XAuyn9wjhFkUUQ",
  authDomain: "docitha-app.firebaseapp.com",
  projectId: "docitha-app",
  storageBucket: "docitha-app.firebasestorage.app",
  messagingSenderId: "741679261792",
  appId: "1:741679261792:web:766bf85540c4ac1601fb05"
};






const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;