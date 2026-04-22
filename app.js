import { auth, db } from "./firebase.js";
import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function showToast(t){
 toast.innerText=t;
}

// REGISTER
window.register = async ()=>{
 try{
   const res = await createUserWithEmailAndPassword(auth,email.value,pass.value);

   await setDoc(doc(db,"users",res.user.uid),{
     email: email.value,
     createdAt: Date.now()
   });

   showToast("Registered!");
 }catch(e){
   showToast(e.message);
 }
};

// LOGIN
window.login = async ()=>{
 try{
   await signInWithEmailAndPassword(auth,email.value,pass.value);
   showToast("Login success");
   setTimeout(()=>location="dashboard.html",1000);
 }catch(e){
   showToast(e.message);
 }
};
