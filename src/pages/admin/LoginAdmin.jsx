// src/pages/admin/LoginAdmin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      localStorage.setItem("usuarioLogado", "true");
      navigate("/admin/dashboard");
    } catch (err) {
      setErro("Usuário ou senha inválidos.");
    }
  };

  return (
    <div className="pagina-caixa">
      <h2>Login Administrativo</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit">Entrar</button>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
      </form>
    </div>
  );
}

export default LoginAdmin;
