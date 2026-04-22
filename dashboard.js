import { auth, db } from "./firebase.js";
import {
collection, getDocs, doc, getDoc, updateDoc, addDoc, serverTimestamp, query, where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function showToast(t){
 toast.innerText=t;
}

let currentKey=null;

// CHECK KEY
window.checkKey = async ()=>{
 const k = key.value;

 const ref = doc(db,"keys",k);
 const snap = await getDoc(ref);

 if(snap.exists() && !snap.data().used){
   currentKey=k;
   showToast("Valid key");
   genBox.style.display="block";
 }else{
   showToast("Invalid key");
 }
};

// GENERATE
window.generate = async ()=>{
 const user = auth.currentUser;

 if(!user){
   showToast("Login first");
   return;
 }

 // ANTI ABUSE
 const qlog = query(collection(db,"logs"),where("uid","==",user.uid));
 const check = await getDocs(qlog);

 if(check.size >= 3){
   showToast("Limit reached");
   return;
 }

 const q = await getDocs(collection(db,"stocks"));

 let found=null;

 q.forEach(d=>{
   if(!d.data().used && d.data().game==game.value && !found){
     found={id:d.id,...d.data()};
   }
 });

 if(!found){
   showToast("No stock");
   return;
 }

 result.innerText = found.username+" | "+found.password;

 await updateDoc(doc(db,"stocks",found.id),{used:true});
 await updateDoc(doc(db,"keys",currentKey),{used:true});

 // LOG
 await addDoc(collection(db,"logs"),{
   uid:user.uid,
   email:user.email,
   game:game.value,
   username:found.username,
   keyUsed:currentKey,
   createdAt:serverTimestamp()
 });

 // EARNINGS
 await addDoc(collection(db,"earnings"),{
   uid:user.uid,
   amount:100,
   createdAt:serverTimestamp()
 });

 showToast("Generated!");
};
