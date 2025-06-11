// ✅ ProtectedRoute.jsx (componente novo)
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("usuarioLogado") === "true";
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default ProtectedRoute;


// ✅ LoginAdmin.jsx (corrigido e robusto)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("usuarioLogado") === "true") {
      navigate("/admin/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha.trim());
      localStorage.setItem("usuarioLogado", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Erro de login:", err);
      setErro("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="pagina-caixa">
      <h2>Login Administrativo</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          id="senha"
          name="senha"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}


