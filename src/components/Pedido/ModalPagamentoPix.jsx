import React from "react";
import "./ModalPagamentoPix.css";

const ModalPagamentoPix = ({ total, onFechar }) => {
  const chavePix = "rootsburguer@pix.com";

  const copiarTexto = (texto) => {
    navigator.clipboard.writeText(texto);
    alert("Copiado para a área de transferência!");
  };

  const handleConfirmarPagamento = () => {
    alert("Pagamento confirmado! 🎉 Obrigado!");
    onFechar();
  };

  return (
    <div className="modal-pix-overlay">
      <div className="modal-pix">
        <h2 className="modal-pix-titulo">Pagamento via Pix</h2>

        <p>Use a chave abaixo:</p>
        <div className="chave-pix">{chavePix}</div>
        <button className="botao-copiar" onClick={() => copiarTexto(chavePix)}>
          📋 Copiar Chave
        </button>

        <p style={{ marginTop: "1rem" }}>Ou escaneie o QR Code:</p>
        <img src="/img/qrcode-pix.png" alt="QR Code Pix" className="qr-code" />

        <p className="valor-total">Total: R$ {total.toFixed(2)}</p>

        <button className="botao-confirmar" onClick={handleConfirmarPagamento}>
          Já fiz o pagamento
        </button>

        <button className="botao-fechar" onClick={onFechar}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ModalPagamentoPix;
