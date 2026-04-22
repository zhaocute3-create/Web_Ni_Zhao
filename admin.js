import { db, auth } from "./firebase.js";
import {
collection, addDoc, getDocs, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ADMIN PROTECT
onAuthStateChanged(auth,(user)=>{
 if(!user || user.email !== "jhonlouiebaid92@gmail.com"){
   alert("Not admin");
   location="index.html";
 }
});

// ADD STOCK
window.addStock = async ()=>{
 await addDoc(collection(db,"stocks"),{
   game:game.value,
   username:user.value,
   password:pass.value,
   used:false
 });
};

// CREATE KEY
window.genKey = async ()=>{
 await setDoc(doc(db,"keys",newKey.value),{used:false});
};

// LOAD ALL
async function loadAll(){
 let total=0;
 let users={};
 let stats={MLBB:0,CODM:0,Roblox:0};

 const logsSnap = await getDocs(collection(db,"logs"));
 logs.innerHTML="";

 logsSnap.forEach(d=>{
   let x=d.data();

   logs.innerHTML+=`<p>${x.email} ${x.game}</p>`;

   users[x.email]=(users[x.email]||0)+1;
   stats[x.game]++;
 });

 // leaderboard
 let sorted=Object.entries(users).sort((a,b)=>b[1]-a[1]);
 leaderboard.innerHTML="";
 sorted.slice(0,5).forEach(u=>{
   leaderboard.innerHTML+=`<p>${u[0]} ${u[1]}</p>`;
 });

 // earnings
 const earnSnap = await getDocs(collection(db,"earnings"));
 earnSnap.forEach(d=>{
   total+=d.data().amount||0;
 });

 totalEarn.innerText="₱ "+total;

 // stock
 const stockSnap = await getDocs(collection(db,"stocks"));
 let s={MLBB:0,CODM:0,Roblox:0};

 stockSnap.forEach(d=>{
   let data=d.data();
   if(!data.used) s[data.game]++;
 });

 stocks.innerHTML=`MLBB:${s.MLBB} CODM:${s.CODM} Roblox:${s.Roblox}`;
}

setInterval(loadAll,5000);
loadAll();
