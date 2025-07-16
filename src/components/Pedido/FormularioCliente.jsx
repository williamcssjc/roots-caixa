// 📁 src/components/Pedido/FormularioCliente.jsx

import React from "react";
import '../../Styles/inputs.css';
import '../../Styles/buttons.css';

const FormularioCliente = ({ cliente, setCliente, erros }) => {
  return (
    <div className="formulario-cliente">
      <h3>Dados do Cliente:</h3>

      <div className="mb-3">
      <input
  type="text"
  placeholder="Nome completo *"
  value={cliente.nome}
  onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
  className={`bg-black text-white border-2 border-yellow-500 rounded-xl px-4 py-2 w-full shadow-md shadow-yellow-500 ${erros.nome ? 'border-red-500' : ''}`}
/>

        {erros.nome && <div className="text-red-500 text-sm mt-1">{erros.nome}</div>}
      </div>

        <div className="campo-formulario">
    <input
      type="text"
      id="cep"
      placeholder="CEP Ex: 12236-000"
      value={cliente.cep}
      onChange={(e) => setCliente({ ...cliente, cep: e.target.value })}
      maxLength={9}
      required
    />
    {erros.cep && <p className="erro">{erros.cep}</p>}
  </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Ex: Rua João Gualberto*"
          id="endereço"
          value={cliente.endereco}
          onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
          className={erros.endereco ? "border-red-500" : ""}
        />
        {erros.endereco && <div className="text-red-500 text-sm mt-1">{erros.endereco}</div>}
      </div>


      <div className="mb-3">
        <input
          type="text"
          placeholder="Telefone *"
          value={cliente.telefone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setCliente({ ...cliente, telefone: value });
          }}
          className={erros.telefone ? "border-red-500" : ""}
        />
        {erros.telefone && <div className="text-red-500 text-sm mt-1">{erros.telefone}</div>}
      </div>

      <div className="mb-3">
        <select
          value={cliente.pagamento}
          onChange={(e) => setCliente({ ...cliente, pagamento: e.target.value })}
          className={erros.pagamento ? "border-red-500" : ""}
        >
          <option value="">Forma de Pagamento *</option>
          <option value="Pix">Pix</option>
          <option value="Cartão">Cartão</option>
          <option value="Dinheiro">Dinheiro</option>
        </select>
        {erros.pagamento && <div className="text-red-500 text-sm mt-1">{erros.pagamento}</div>}
      </div>

      <div className="text-sm text-gray-400 mt-2">* Campos obrigatórios</div>
    </div>
  );
};

export default FormularioCliente;
