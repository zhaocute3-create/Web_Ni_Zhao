import { db, auth } from "./firebase.js";
import {
doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 📸 IMAGE PREVIEW + CONVERT
let base64Image = "";

document.getElementById("imageFile")?.addEventListener("change", function(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(){
    base64Image = reader.result;

    let preview = document.getElementById("preview");
    preview.src = base64Image;
    preview.style.display = "block";
  };

  reader.readAsDataURL(file);
});

// 🔑 CREATE KEY (ANTI DUPLICATE + ONE TIME USE)
window.createKey = async ()=>{
 try{

  let keyInput = document.getElementById("keyInput")?.value.trim();
  let coinsInput = document.getElementById("coinsInput")?.value;

  if(!keyInput || !coinsInput){
    return alert("Fill key and coins!");
  }

  const keyRef = doc(db,"keys",keyInput);
  const existing = await getDoc(keyRef);

  // 🔥 PREVENT DUPLICATE KEY
  if(existing.exists()){
    return alert("❌ Key already exists!");
  }

  await setDoc(keyRef,{
    coins: Number(coinsInput),
    used: false,
    created: Date.now()
  });

  alert("✅ Key Created: " + keyInput);

  // CLEAR INPUT
  document.getElementById("keyInput").value = "";
  document.getElementById("coinsInput").value = "";

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
  let image = base64Image || "";

  if(!game || !username || !password || !price){
    return alert("Fill all fields!");
  }

  await setDoc(doc(db,"stocks",id),{
    game: game,
    username: username,
    password: password,
    price: Number(price),
    image: image,

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
