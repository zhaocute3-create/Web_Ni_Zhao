// firebase.js (FINAL FIXED)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "PASTE_MO_BAGO_API_KEY",
  authDomain: "webnizhao.firebaseapp.com",
  projectId: "webnizhao",
  storageBucket: "webnizhao.appspot.com",
  messagingSenderId: "562185836577",
  appId: "1:562185836577:web:ce563d59c0b81d02b06b60"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
