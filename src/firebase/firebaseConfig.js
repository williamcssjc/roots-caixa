// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWZ_mS8mRvXiyYZhtg3Q2UOp-ur64CbdU",
  authDomain: "roots-burguer-caixa.firebaseapp.com",
  projectId: "roots-burguer-caixa",
  storageBucket: "roots-burguer-caixa.firebasestorage.app",
  messagingSenderId: "470523842936",
  appId: "1:470523842936:web:5c56d8e2a8f0c27e22788d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
