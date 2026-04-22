import { db, auth } from "./firebase.js";
import {
collection, addDoc, getDocs, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ================= TOAST
function showToast(msg){
 const el = document.getElementById("toast");
 el.innerText = msg;
 el.style.opacity = "1";
 setTimeout(()=>{ el.style.opacity="0"; },2000);
}

// ================= ADMIN PROTECTION
onAuthStateChanged(auth,(user)=>{
 if(!user){
   location="index.html";
   return;
 }

 if(user.email !== "jhonlouiebaid92@gmail.com"){
   alert("❌ Not authorized");
   location="dashboard.html";
 }
});

// ================= CREATE KEY
window.genKey = async ()=>{
 if(!newKey.value || !coins.value){
   showToast("❌ Fill all fields");
   return;
 }

 try{
   await setDoc(doc(db,"keys",newKey.value),{
 coins:Number(coins.value),
 type: game.value,
 used:false,
 createdAt: Date.now()
});

   showToast("✅ Key Created");
   loadStats();
 }catch(e){
   showToast("Error: "+e.message);
 }
};

// ================= ADD STOCK
window.addStock = async ()=>{
 if(!user.value || !pass.value || !price.value){
   showToast("❌ Fill all fields");
   return;
 }

 try{
   await addDoc(collection(db,"stocks"),{
     game:game.value,
     username:user.value,
     password:pass.value,
     price:Number(price.value),
     used:false
   });

   showToast("✅ Stock Added");
   loadStats();
 }catch(e){
   showToast("Error: "+e.message);
 }
};

// ================= LOAD STATS
async function loadStats(){
 let stockCount=0;
 let keyCount=0;

 const s = await getDocs(collection(db,"stocks"));
 s.forEach(()=> stockCount++);

 const k = await getDocs(collection(db,"keys"));
 k.forEach(()=> keyCount++);

 totalStocks.innerText = "Stocks: " + stockCount;
 totalKeys.innerText = "Keys: " + keyCount;
}

// ================= LOAD LOGS
async function loadLogs(){
 const q = await getDocs(collection(db,"logs"));
 let html="";

 q.forEach(d=>{
   const x=d.data();
   html += `<p>${x.email} | ${x.game}</p>`;
 });

 logs.innerHTML = html;
}

// ================= AUTO LOAD
async function init(){
 await loadStats();
 await loadLogs();
}

init();
setInterval(init,5000);
