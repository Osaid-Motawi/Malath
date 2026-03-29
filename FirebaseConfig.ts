import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCI3ez-S6__mjeEQ3EV8huTPQpp2-5niN0",
  authDomain: "malath-3f6d8.firebaseapp.com",
  projectId: "malath-3f6d8",
  storageBucket: "malath-3f6d8.firebasestorage.app",
  messagingSenderId: "593418374423",
  appId: "1:593418374423:web:0a9ec4114989b237f5fb52",
  measurementId: "G-P4H3ETSHGM"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


export const auth = getAuth(app);