import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Cardapio from "../Pages/Cardapio";
import Footer from "../Components/Footer";



export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cardapio" element={<Cardapio />} />
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}