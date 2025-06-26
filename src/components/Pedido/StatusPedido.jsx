import React, { useState, useEffect } from "react";

const StatusPedido = ({ numeroPedido, status }) => {
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    console.log("[StatusPedido] status mudou:", status);
    if (status) {
      setModalAberto(true);
      const audio = new Audio("/notificacao.mp3");
      audio.play().catch(() => {
        console.log("[StatusPedido] áudio bloqueado pelo navegador");
      });
    }
  }, [status]);

  if (!numeroPedido) {
    console.log("[StatusPedido] sem número de pedido, nada renderizado");
    return null;
  }
  if (!modalAberto) {
    console.log("[StatusPedido] modal fechado");
    return null;
  }

  const getStatusColor = () => {
    switch (status) {
      case "Recebido":
        return "bg-blue-500";
      case "Em Preparo":
        return "bg-yellow-500";
      case "Saiu para Entrega":
        return "bg-purple-500";
      case "Entregue":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  console.log("[StatusPedido] renderizando modal");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#2d2d2d",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
          color: "white",
        }}
      >
        <h3
          style={{
            color: "#ffbf00",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Pedido #{String(numeroPedido).padStart(3, "0")}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              marginRight: "10px",
              backgroundColor:
                status === "Recebido"
                  ? "#3b82f6"
                  : status === "Em Preparo"
                  ? "#facc15"
                  : status === "Saiu para Entrega"
                  ? "#8b5cf6"
                  : status === "Entregue"
                  ? "#22c55e"
                  : "#6b7280",
            }}
          ></div>
          <p style={{ fontSize: "1.125rem" }}>
            {status || "Aguardando atualização..."}
          </p>
        </div>
        <button
          onClick={() => setModalAberto(false)}
          style={{
            backgroundColor: "#ffbf00",
            color: "black",
            padding: "10px 20px",
            borderRadius: "6px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0ac00")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffbf00")}
        >
          OK, entendi
        </button>
      </div>
    </div>
  );
};

export default StatusPedido;
