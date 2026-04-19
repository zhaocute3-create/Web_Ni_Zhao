import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATT-pyHuOBD9_lD9ee9i0XR0H6YHFJXrI",
  authDomain: "webnizhao.firebaseapp.com",
  projectId: "webnizhao",
  storageBucket: "webnizhao.firebasestorage.app",
  messagingSenderId: "562185836577",
  appId: "1:562185836577:web:ce563d59c0b81d02b06b60"
};

const app=initializeApp(firebaseConfig);
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

// ADD COINS
window.addCoins=async()=>{
 const users=await getDocs(collection(db,"users"));

 users.forEach(async d=>{
   if(d.data().uid==uid.value){
     await updateDoc(doc(db,"users",d.id),{
       balance:d.data().balance + Number(coins.value)
     });
   }
 });
 alert("Coins added");
};

// LOAD DEPOSITS
async function load(){
 const q=await getDocs(collection(db,"deposits"));
 let h="";

 q.forEach(d=>{
   const x=d.data();

   h+=`
   <div>
   <p>${x.amount}</p>
   <button onclick="approve('${d.id}','${x.userId}',${x.amount})">Approve</button>
   <button onclick="reject('${d.id}')">Reject</button>
   </div>`;
 });

 list.innerHTML=h;
}

// APPROVE
window.approve=async(id,uid,amt)=>{
 const users=await getDocs(collection(db,"users"));

 users.forEach(async d=>{
   if(d.id==uid){
     await updateDoc(doc(db,"users",uid),{
       balance:d.data().balance + amt
     });
   }
 });

 await deleteDoc(doc(db,"deposits",id));
 alert("Approved");
 load();
};

// REJECT
window.reject=async(id)=>{
 await deleteDoc(doc(db,"deposits",id));
 alert("Rejected");
 load();
};

load();
