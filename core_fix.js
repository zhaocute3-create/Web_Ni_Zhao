import { db } from "./firebase.js";
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.CORE = {
  key: "",
  type: ""
};

window.coreSaveKey = (k,data)=>{
  CORE.key = k;
  CORE.type = data.type || "";
};

window.coreCheckExpire = (data)=>{
  const now = Date.now();
  const created = data.createdAt || now;
  return (now - created) <= 86400000;
};

window.coreLoad = (state)=>{
  const el = document.getElementById("loading");
  if(el) el.style.display = state ? "flex" : "none";
};

window.coreError = (e)=>{
  alert("ERROR: " + e.message);
};

window.coreTrack = async(user,data)=>{
  await addDoc(collection(db,"purchases"),{
    user:user.email,
    game:data.game,
    price:data.price,
    account:data.username+"|"+data.password,
    date:Date.now()
  });

  if(CORE.key){
    await addDoc(collection(db,"earnings"),{
      key:CORE.key,
      coinsUsed:data.price,
      date:Date.now()
    });
  }
};
