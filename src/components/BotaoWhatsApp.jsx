import React from "react";
import "../Styles/botaoWhats.css";

const BotaoWhatsApp = () => {
  const numero = "5512996999907"; // DDI + DDD + número
  const mensagem = "Olá! Quero fazer um pedido no Roots Burguer 🍔🔥";
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      💬 Peça pelo WhatsApp
    </a>
  );
};

export default BotaoWhatsApp;
