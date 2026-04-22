import { auth, db } from "./firebase.js";
import {
collection, getDocs, doc, getDoc, updateDoc, increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let currentUser;

auth.onAuthStateChanged(async(user)=>{
 if(!user){ location="index.html"; return; }
 currentUser = user;
 loadBalance();
 loadShop();
});

async function loadBalance(){
 const snap = await getDoc(doc(db,"users",currentUser.uid));
 balance.innerText = "Balance: " + (snap.data().balance || 0);
}

window.checkKey = async ()=>{
 try{

 const k = key.value;
 if(!k) return alert("Enter key");

 const ref = doc(db,"keys",k);
 const snap = await getDoc(ref);

 if(!snap.exists()) return alert("Invalid key");

 if(snap.data().used) return alert("❌ Key already used");

 if(!coreCheckExpire(snap.data())){
   return alert("❌ Key expired");
 }

 coreSaveKey(k, snap.data());

 await updateDoc(doc(db,"users",currentUser.uid),{
   balance: increment(snap.data().coins)
 });

 await updateDoc(ref,{used:true});

 alert("✅ Coins Added!");

 loadBalance();
 loadShop();

 }catch(e){
  coreError(e);
 }
};

async function loadShop(){
 const q = await getDocs(collection(db,"stocks"));
 let html="";

 q.forEach(d=>{
   let x=d.data();

   if(x.used) return;

   if(CORE.type && x.game !== CORE.type) return;

   html += `
   <div class="card">
   <img src="${x.image || ''}">
   <h3>${x.game}</h3>
   <p>Inactive: ${x.inactive}</p>
   <p>Bind: ${x.bind}</p>
   <p>Price: ${x.price}</p>
   <button onclick="buy('${d.id}')">BUY</button>
   </div>
   `;
 });

 shop.innerHTML = html;
}

window.buy = async(id)=>{
 try{

 coreLoad(true);

 const userRef = doc(db,"users",currentUser.uid);
 const userSnap = await getDoc(userRef);
 let bal = userSnap.data().balance || 0;

 const stockRef = doc(db,"stocks",id);
 const stockSnap = await getDoc(stockRef);
 let data = stockSnap.data();

 if(bal < data.price){
   coreLoad(false);
   return alert("Not enough coins");
 }

 await updateDoc(userRef,{
   balance: bal - data.price
 });

 await updateDoc(stockRef,{used:true});

 await coreTrack(currentUser,data);

 coreLoad(false);

 popup.style.display="block";
 popup.innerHTML = `<h3>Thank you!</h3><p>${data.username} | ${data.password}</p>`;

 setTimeout(()=> popup.style.display="none",4000);

 loadBalance();
 loadShop();

 }catch(e){
  coreLoad(false);
  coreError(e);
 }
};
