import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app=initializeApp({
 apiKey:"PASTE_API_KEY",
 projectId:"YOUR_PROJECT"
});

const db=getFirestore(app);

// ADD STOCK
window.addStock=async()=>{
 await addDoc(collection(db,"stocks"),{
   game:game.value,
   username:user.value,
   password:pass.value,
   used:false
 });
 alert("Stock added");
};

// CREATE KEY
window.genKey=async()=>{
 await setDoc(doc(db,"keys",newKey.value),{
   used:false
 });
 alert("Key created");
 load();
};

// LOAD KEYS
async function load(){
 const q=await getDocs(collection(db,"keys"));
 let h="";
 q.forEach(d=>{
   h+=`<p>${d.id} | used: ${d.data().used}</p>`;
 });
 keys.innerHTML=h;
}

load();
