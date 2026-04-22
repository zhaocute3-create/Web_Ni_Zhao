import { db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.addStock = async ()=>{
 try{

  let id = Date.now().toString();

  await setDoc(doc(db,"stocks",id),{
    game: game.value,
    price: Number(price.value),
    username: username.value,
    password: password.value,

    // SAFE ADD FIELDS
    inactive: inactive?.value || "N/A",
    bind: bind?.value || "Unknown",
    image: image?.value || "",

    used:false
  });

  alert("✅ Stock Added");

 }catch(e){
  alert(e.message);
 }
};
