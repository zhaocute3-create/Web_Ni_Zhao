import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app=initializeApp({
 apiKey:"PASTE_API_KEY",
 projectId:"YOUR_PROJECT"
});

const db=getFirestore(app);

let currentKey=null;

function toast(t){
 toast.innerText=t;
 toast.style.display="block";
 setTimeout(()=>toast.style.display="none",2000);
}

// CHECK KEY
window.checkKey=async()=>{
 const q=await getDocs(collection(db,"keys"));
 let valid=false;

 q.forEach(d=>{
   if(d.id==key.value && !d.data().used){
     valid=true;
     currentKey=d.id;
   }
 });

 if(valid){
   toast("Key Valid!");
   genBox.style.display="block";
 }else{
   toast("Invalid Key");
 }
};

// GENERATE
window.generate=async()=>{
 const q=await getDocs(collection(db,"stocks"));
 let found=null;

 q.forEach(d=>{
   if(!d.data().used && d.data().game==game.value && !found){
     found={id:d.id,...d.data()};
   }
 });

 if(!found){
   toast("No stock!");
   return;
 }

 result.innerText = found.username + " | " + found.password;

 await updateDoc(doc(db,"stocks",found.id),{used:true});
 await updateDoc(doc(db,"keys",currentKey),{used:true});

 toast("Generated!");
};
