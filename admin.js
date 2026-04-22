import { db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.addStock = async ()=>{
 try{

  let id = Date.now().toString();

  // SAFE GET VALUES
  let gameVal = document.getElementById("game")?.value;
  let userVal = document.getElementById("username")?.value;
  let passVal = document.getElementById("password")?.value;
  let priceVal = document.getElementById("price")?.value;

  let inactiveVal = document.getElementById("inactive")?.value;
  let bindVal = document.getElementById("bind")?.value;
  let imageVal = document.getElementById("image")?.value;

  if(!userVal || !passVal || !priceVal){
    return alert("Fill all required fields!");
  }

  await setDoc(doc(db,"stocks",id),{
    game: gameVal,
    price: Number(priceVal),
    username: userVal,
    password: passVal,

    inactive: inactiveVal || "N/A",
    bind: bindVal || "Unknown",
    image: imageVal || "",

    used:false
  });

  alert("✅ Stock Added");

 }catch(e){
  alert(e.message);
 }
};
