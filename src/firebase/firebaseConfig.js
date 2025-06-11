// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWZ_mS8mRvXiyYZhtg3Q2UOp-ur64CbdU",
  authDomain: "roots-burguer-caixa.firebaseapp.com",
  projectId: "roots-burguer-caixa",
  storageBucket: "roots-burguer-caixa.firebasestorage.app",
  messagingSenderId: "470523842936",
  appId: "1:470523842936:web:5c56d8e2a8f0c27e22788d",
  measurementId: "G-V2L8F44TQS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
