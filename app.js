import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey:"PASTE_API_KEY",
  authDomain:"YOUR_PROJECT.firebaseapp.com",
  projectId:"YOUR_PROJECT"
});

const auth=getAuth(app);
const db=getFirestore(app);

function toast(t){
  toast.innerText=t;
  toast.style.display="block";
  setTimeout(()=>toast.style.display="none",2000);
}

window.register=async()=>{
 try{
   const res=await createUserWithEmailAndPassword(auth,email.value,pass.value);

   await setDoc(doc(db,"users",res.user.uid),{
     email:email.value
   });

   toast("Registered!");
 }catch(e){toast(e.message);}
};

window.login=async()=>{
 try{
   await signInWithEmailAndPassword(auth,email.value,pass.value);
   toast("Login success");
   setTimeout(()=>location="dashboard.html",1000);
 }catch(e){toast(e.message);}
};
