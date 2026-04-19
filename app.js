import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
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
