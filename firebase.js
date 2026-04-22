// firebase.js (npm version)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATT-pyHuOBD9_lD9ee9i0XR0H6YHFJXrI",
  authDomain: "webnizhao.firebaseapp.com",
  projectId: "webnizhao",
  storageBucket: "webnizhao.appspot.com", // 🔥 FIX
  messagingSenderId: "562185836577",
  appId: "1:562185836577:web:ce563d59c0b81d02b06b60"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
