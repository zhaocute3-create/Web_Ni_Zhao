let currentKey = "";
let userKeyType = "";
import { auth, db } from "./firebase.js";
import {
collection, getDocs, doc, getDoc, updateDoc,
increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

function showToast(t){ toast.innerText=t; }

let currentUser;

// LOAD USER
auth.onAuthStateChanged(async(user)=>{
 if(!user){ location="index.html"; return; }
 currentUser=user;
 loadBalance();
});

// LOAD BALANCE
async function loadBalance(){
 const snap = await getDoc(doc(db,"users",currentUser.uid));
 balance.innerText = "Balance: " + (snap.data().balance || 0);
}

// USE KEY
window.checkKey = async ()=>{
 const k = key.value;

 if(!k){ showToast("Enter key"); return; }

 const ref = doc(db,"keys",k);
 const snap = await getDoc(ref);

 if(!snap.exists() || snap.data().used){
   showToast("Invalid key");
   return;
 }

 const coins = snap.data().coins;

 await updateDoc(doc(db,"users",currentUser.uid),{
   balance: increment(coins)
 });

 await updateDoc(ref,{used:true});

 showToast("+"+coins+" coins");
 loadBalance();
};

// GENERATE
window.generate = async ()=>{
 const userRef = doc(db,"users",currentUser.uid);
 const userSnap = await getDoc(userRef);
 let bal = userSnap.data().balance || 0;

 const q = await getDocs(collection(db,"stocks"));
 let found=null;

 q.forEach(d=>{
   if(!d.data().used && d.data().game==game.value && !found){
     found={id:d.id,...d.data()};
   }
 });

 if(!found){ showToast("No stock"); return; }

 if(bal < found.price){
   showToast("Not enough coins");
   return;
 }

 result.innerText = found.username+" | "+found.password;

 await updateDoc(userRef,{balance: bal - found.price});
 await updateDoc(doc(db,"stocks",found.id),{used:true});

 showToast("Generated!");
 loadBalance();
};
