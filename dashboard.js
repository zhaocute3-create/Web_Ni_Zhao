import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, collection }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATT-pyHuOBD9_lD9ee9i0XR0H6YHFJXrI",
  authDomain: "webnizhao.firebaseapp.com",
  projectId: "webnizhao",
  storageBucket: "webnizhao.firebasestorage.app",
  messagingSenderId: "562185836577",
  appId: "1:562185836577:web:ce563d59c0b81d02b06b60"
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

let user;

function toast(t){
  toast.innerText=t;
  toast.style.display="block";
  setTimeout(()=>toast.style.display="none",2000);
}

onAuthStateChanged(auth,async u=>{
 if(!u){location="index.html";return;}
 user=u;

 const snap=await getDoc(doc(db,"users",u.uid));
 uid.innerText=snap.data().uid;
 bal.innerText=snap.data().balance;
});

window.openDep=()=>deposit.style.display="block";

window.submitDep=async()=>{
 toast("Submitting...");

 await addDoc(collection(db,"deposits"),{
   userId:user.uid,
   amount:Number(amount.value),
   ref:ref.value,
   status:"pending"
 });

 toast("Submitted!");
};
