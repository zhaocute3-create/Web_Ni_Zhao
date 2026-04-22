import { auth, db } from "./firebase.js";
import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function showToast(t){ document.getElementById("toast").innerText = t; }

window.register = async ()=>{
 try{
   const res = await createUserWithEmailAndPassword(auth,email.value,pass.value);

   await setDoc(doc(db,"users",res.user.uid),{
     email: email.value,
     balance: 0
   });

   showToast("Registered!");
 }catch(e){ showToast(e.message); }
};

window.login = async ()=>{
 try{
   const res = await signInWithEmailAndPassword(auth,email.value,pass.value);

   if(res.user.email === "jhonlouiebaid92@gmail.com"){
     location="admin.html";
   }else{
     location="dashboard.html";
   }
 }catch(e){ showToast(e.message); }
};
