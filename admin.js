import { db, auth } from "./firebase.js";
import {
doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔐 ADMIN GUARD
auth.onAuthStateChanged(user=>{
  if(!user || user.email !== "jhonlouiebaid92@gmail.com"){
    alert("Access Denied");
    location = "dashboard.html";
  }
});

// 🔑 CREATE KEY (MANUAL FIXED)
window.createKey = async ()=>{
 try{

  let keyInput = document.getElementById("keyInput")?.value;
  let coinsInput = document.getElementById("coinsInput")?.value;

  if(!keyInput || !coinsInput){
    return alert("Fill key and coins!");
  }

  await setDoc(doc(db,"keys",keyInput),{
    coins: Number(coinsInput),
    used:false,
    created: Date.now()
  });

  alert("✅ Key Created: " + keyInput);

  // 🔥 CLEAR INPUT (optional)
  keyInput.value = "";
  coinsInput.value = "";

 }catch(e){
  alert("Key Error: " + e.message);
 }
};

// 📦 ADD STOCK (FIXED IMAGE + FIELDS)
window.addStock = async ()=>{
 try{

  let id = Date.now().toString();

  let game = document.getElementById("game").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let price = document.getElementById("price").value;

  let inactive = document.getElementById("inactive")?.value;
  let bind = document.getElementById("bind")?.value;
  let image = document.getElementById("image")?.value;

  if(!game || !username || !password || !price){
    return alert("Fill all fields!");
  }

  await setDoc(doc(db,"stocks",id),{
    game: game,
    username: username,
    password: password,
    price: Number(price),

    inactive: inactive || "N/A",
    bind: bind || "Unknown",

    // 🔥 FIX IMAGE
    image: image?.startsWith("http") ? image : "",

    used:false
  });

  alert("✅ Stock Added");

 }catch(e){
  alert("Stock Error: " + e.message);
 }
};
