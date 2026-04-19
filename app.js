import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey:"PASTE_API_KEY",
  authDomain:"YOUR_PROJECT.firebaseapp.com",
  projectId:"YOUR_PROJECT"
};

const app = initializeApp(firebaseConfig);
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
   const user=res.user;

   const ref=doc(db,"meta","counter");
   const snap=await getDoc(ref);

   let uid=1;
   if(snap.exists()) uid=snap.data().count+1;

   await setDoc(ref,{count:uid});

   await setDoc(doc(db,"users",user.uid),{
     email:user.email,
     uid:uid,
     balance:0
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