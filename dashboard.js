import { auth, db } from "./firebase.js";
import {
collection, getDocs, doc, getDoc, updateDoc, increment, addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser;

auth.onAuthStateChanged(async(user)=>{
 if(!user){ location="index.html"; return; }
 currentUser = user;
 loadBalance();
 loadShop();
});

auth.onAuthStateChanged(user=>{
  if(user){
    if(user.email !== "jhonlouiebaid92@gmail.com"){
      let btn = document.getElementById("adminBtn");
      if(btn) btn.style.display = "none";
    }
  }
});

async function loadBalance(){
 const snap = await getDoc(doc(db,"users",currentUser.uid));
 balance.innerText = "Balance: " + (snap.data()?.balance || 0);
}

// 🔐 KEY SYSTEM
window.checkKey = async ()=>{
 try{
 const k = key.value;
 const ref = doc(db,"keys",k);
 const snap = await getDoc(ref);

 if(!snap.exists()) return alert("Invalid key");
 if(snap.data().used) return alert("Used key");

 await updateDoc(doc(db,"users",currentUser.uid),{
   balance: increment(snap.data().coins)
 });

 await updateDoc(ref,{used:true});

 alert("Coins added!");
 loadBalance();

 }catch(e){ alert(e.message); }
};

// 🛒 LOAD SHOP
window.loadShop = async ()=>{
 let keyword = document.getElementById("search")?.value?.toLowerCase() || "";

 const q = await getDocs(collection(db,"stocks"));
 let html="";

 q.forEach(d=>{
   let x=d.data();

   if(x.used) return;
   if(keyword && !x.game.toLowerCase().includes(keyword)) return;

   html += `
   <div class="card">

   ${x.image ? `<img src="${x.image}" width="100%">` : ""}

   <h3>${x.game}</h3>
   <p>📅 ${x.inactive || "N/A"}</p>
   <p>🔗 ${x.bind || "Unknown"}</p>
   <p>💰 ${x.price}</p>

   <button onclick="buy('${d.id}')">BUY</button>

   </div>
   `;
 });

 shop.innerHTML = html;
};

// 💰 BUY SYSTEM
window.buy = async(id)=>{
 try{

 loading.style.display="block";

 const userRef = doc(db,"users",currentUser.uid);
 const userSnap = await getDoc(userRef);

 let bal = userSnap.data()?.balance || 0;

 const stockRef = doc(db,"stocks",id);
 const stockSnap = await getDoc(stockRef);
 let data = stockSnap.data();

 if(bal < data.price){
   loading.style.display="none";
   return alert("Not enough coins");
 }

 await updateDoc(userRef,{balance: bal - data.price});
 await updateDoc(stockRef,{used:true});

 await addDoc(collection(db,"purchases"),{
   user: currentUser.email,
   account: data.username + "|" + data.password,
   price: data.price,
   date: Date.now()
 });

 loading.style.display="none";

 popup.style.display="block";
 popup.innerHTML = `
 <h3>✅ Thank you!</h3>
 <p>${data.username} | ${data.password}</p>
 `;

 setTimeout(()=> popup.style.display="none",4000);

 loadBalance();
 loadShop();

 }catch(e){
 loading.style.display="none";
 alert(e.message);
 }
};
