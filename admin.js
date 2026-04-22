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

// 🔑 CREATE KEY (FIXED)
window.createKey = async ()=>{
 try{

  let key = "ZHAO-" + Math.random().toString(36).substring(2,8).toUpperCase();

  await setDoc(doc(db,"keys",key),{
    coins: 100,
    used:false,
    created: Date.now()
  });

  alert("✅ Key Created: " + key);

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
