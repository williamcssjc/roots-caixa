import React, { useEffect } from "react";
import somNotificacao from "../../../public/Sons/new-notification-09-352705.mp3";

const AlertaStatusPedido = ({ status, visivel, onFechar }) => {
  useEffect(() => {
    if (visivel && status) {
      const audio = new Audio(somNotificacao);
      audio.play().catch((e) => console.warn("Som bloqueado até interação do usuário."));
    }
  }, [visivel, status]);

  if (!visivel) return null;

  return (
    <div
      onClick={onFechar}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.5s ease-in-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: "40px 30px",
          borderRadius: "12px",
          maxWidth: "90%",
          width: "400px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          transform: "scale(1)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <h2 style={{ fontSize: "24px", color: "#D97706", marginBottom: "20px" }}>
          Status Atualizado
        </h2>
        <p style={{ fontSize: "20px", color: "#222", marginBottom: "30px" }}>
          Seu pedido está agora: <strong>{status}</strong>
        </p>
        <button
          onClick={onFechar}
          style={{
            backgroundColor: "#D97706",
            color: "#fff",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default AlertaStatusPedido;
