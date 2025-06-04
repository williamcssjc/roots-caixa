import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("usuarioLogado");
    navigate("/admin/login");
  };

  return (
    <div className="pagina-caixa">
      <h2>Painel Administrativo Roots Burguer</h2>
      <p>Você está logado. Bem-vindo, mestre da grelha 👨‍🍳🔥</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default Dashboard;
