import { auth, db } from "./firebase.js";
import {
collection, getDocs, doc, getDoc, updateDoc, increment, addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 SAFE ELEMENTS
const balance = document.getElementById("balance");
const shop = document.getElementById("shop");
const loading = document.getElementById("loading");
const popup = document.getElementById("popup");
const key = document.getElementById("key");
const historyDiv = document.getElementById("history");

let currentUser;
let lastBuy = 0;

// 🔐 AUTH
auth.onAuthStateChanged(user=>{
 if(!user){
  location="index.html";
  return;
 }
 currentUser = user;
 loadBalance();
 loadShop();
 loadHistory();
});

// 💰 BALANCE
async function loadBalance(){
 const snap = await getDoc(doc(db,"users",currentUser.uid));
 balance.innerText = "Balance: " + (snap.data()?.balance || 0);
}

// 🔑 KEY SYSTEM
window.checkKey = async ()=>{
 try{
  let k = key.value.trim();

  const ref = doc(db,"keys",k);
  const snap = await getDoc(ref);

  if(!snap.exists()) return alert("Invalid Key");
  if(snap.data().used) return alert("Key already used");

  await updateDoc(doc(db,"users",currentUser.uid),{
    balance: increment(snap.data().coins)
  });

  await updateDoc(ref,{used:true});

  alert("✅ Coins Added!");
  loadBalance();

 }catch(e){
  alert(e.message);
 }
};

// 🛒 LOAD SHOP (WITH STOCK)
window.loadShop = async ()=>{
 let keyword = document.getElementById("search")?.value?.toLowerCase() || "";

 const q = await getDocs(collection(db,"stocks"));
 let html="";

 q.forEach(d=>{
   let x = d.data();

   let stock = x.stock ?? (x.used ? 0 : 1); // 🔥 backward compatible

   if(stock <= 0) return;
   if(keyword && !x.game.toLowerCase().includes(keyword)) return;

   html += `
   <div class="card">

   ${x.image 
     ? `<img src="${x.image}" width="100%" style="border-radius:10px;">`
     : `<img src="https://via.placeholder.com/300x150?text=No+Image" width="100%" style="border-radius:10px;">`
   }

   <h3>${x.game}</h3>
   <p>📅 ${x.inactive || "N/A"}</p>
   <p>🔗 ${x.bind || "Unknown"}</p>
   <p>💰 ${x.price}</p>
   <p>📦 Stock: ${stock}</p>

   <button onclick="buy('${d.id}')">BUY</button>

   </div>
   `;
 });

 shop.innerHTML = html;
};

// 💸 BUY SYSTEM (STOCK FIXED)
window.buy = async(id)=>{
 try{

  if(Date.now() - lastBuy < 3000){
    return alert("Wait before buying again");
  }
  lastBuy = Date.now();

  loading.style.display="flex";

  const userRef = doc(db,"users",currentUser.uid);
  const userSnap = await getDoc(userRef);
  let bal = userSnap.data()?.balance || 0;

  const stockRef = doc(db,"stocks",id);
  const stockSnap = await getDoc(stockRef);

  if(!stockSnap.exists()){
    loading.style.display="none";
    return alert("Item not found");
  }

  let data = stockSnap.data();

  let stock = data.stock ?? (data.used ? 0 : 1);

  if(stock <= 0){
    loading.style.display="none";
    return alert("Out of stock");
  }

  if(bal < data.price){
    loading.style.display="none";
    return alert("Not enough coins");
  }

  await updateDoc(userRef,{
    balance: bal - data.price
  });

  // 🔥 STOCK SYSTEM (NO BREAK)
  await updateDoc(stockRef,{
    stock: stock - 1,
    used: stock - 1 <= 0 // backward compatibility
  });

  await addDoc(collection(db,"purchases"),{
    user: currentUser.email,
    account: data.username + "|" + data.password,
    price: data.price,
    date: Date.now()
  });

  loading.style.display="none";

  popup.style.display="block";
  popup.innerHTML = `
  <h3>✅ Purchase Success</h3>
  <p>${data.username} | ${data.password}</p>
  `;

  setTimeout(()=> popup.style.display="none",4000);

  loadBalance();
  loadShop();
  loadHistory();

 }catch(e){
  loading.style.display="none";
  alert(e.message);
 }
};

// 🧾 HISTORY
async function loadHistory(){
 const q = await getDocs(collection(db,"purchases"));
 let html = "";

 q.forEach(d=>{
  let x = d.data();

  if(x.user !== currentUser.email) return;

  html += `
  <div class="card">
    <p>🎮 ${x.account}</p>
    <p>💰 ${x.price}</p>
    <p>📅 ${new Date(x.date).toLocaleString()}</p>
  </div>
  `;
 });

 if(historyDiv){
   historyDiv.innerHTML = html;
 }
}
