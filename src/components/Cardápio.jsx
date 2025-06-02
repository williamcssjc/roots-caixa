import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ingredientesPorLanche = {
  "X-Salada": {
    "Pão Brioche": 1,
    "Blend 120g": 1,
    "Alface americana": 1,
    "Tomate": 1,
    "Queijo cheddar": 1,
    "Maionese": 1
  },
  "X-Bacon": {
    "Pão Brioche": 1,
    "Blend 120g": 1,
    "Bacon": 1,
    "Queijo cheddar": 1,
    "Maionese": 1
  },
  "X-Cheddar": {
    "Pão Brioche": 1,
    "Blend 120g": 1,
    "Queijo cheddar": 2,
    "Maionese": 1
  }
};

export const atualizarEstoque = async (pedido, qtd) => {
  const ingredientes = ingredientesPorLanche[pedido];

  for (const nome in ingredientes) {
    const ref = doc(db, "estoque", nome);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const atual = snap.data().quantidade;
      const novoValor = atual - ingredientes[nome] * qtd;
      await updateDoc(ref, { quantidade: novoValor });
    }
  }
};
