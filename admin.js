import { db } from "./firebase.js";
import {
collection, addDoc, getDocs, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= TOAST
function showToast(t){ alert(t); }

// ================= ADD STOCK
window.addStock = async ()=>{
 await addDoc(collection(db,"stocks"),{
   game: game.value,
   username: user.value,
   password: pass.value,
   used:false
 });
 showToast("✅ Stock added");
};

// ================= CREATE KEY
window.genKey = async ()=>{
 await setDoc(doc(db,"keys",newKey.value),{used:false});
 showToast("✅ Key created");
};

// ================= LOAD LOGS
async function loadLogs(){
 const q = await getDocs(collection(db,"logs"));
 let h="";

 q.forEach(d=>{
   let x=d.data();
   h+=`<p>${x.email} | ${x.game} | ${x.username}</p>`;
 });

 logs.innerHTML=h;
}

// ================= EARNINGS TOTAL
async function loadEarnings(){
 const q = await getDocs(collection(db,"earnings"));
 let total=0;

 q.forEach(d=>{
   total+=d.data().amount||0;
 });

 totalEarn.innerText="₱ "+total;
}

// ================= DAILY CHART
let dailyChart;

async function loadDailyChart(){
 const q = await getDocs(collection(db,"earnings"));

 let days={};

 q.forEach(d=>{
   let date = new Date().toLocaleDateString(); // simple
   days[date]=(days[date]||0)+(d.data().amount||0);
 });

 const ctx=document.getElementById("dailyChart");

 if(dailyChart) dailyChart.destroy();

 dailyChart=new Chart(ctx,{
   type:"line",
   data:{
     labels:Object.keys(days),
     datasets:[{
       label:"Daily Earnings",
       data:Object.values(days)
     }]
   }
 });
}

// ================= GAME STATS
let chart;

async function loadChart(){
 const q = await getDocs(collection(db,"logs"));

 let stats={MLBB:0,CODM:0,Roblox:0};

 q.forEach(d=>{
   let g=d.data().game;
   if(stats[g]!==undefined) stats[g]++;
 });

 if(chart) chart.destroy();

 chart=new Chart(document.getElementById("chart"),{
   type:"bar",
   data:{
     labels:["MLBB","CODM","Roblox"],
     datasets:[{
       label:"Generates",
       data:[stats.MLBB,stats.CODM,stats.Roblox]
     }]
   }
 });
}

// ================= LEADERBOARD
async function loadLeaderboard(){
 const q = await getDocs(collection(db,"logs"));

 let users={};

 q.forEach(d=>{
   let email=d.data().email;
   users[email]=(users[email]||0)+1;
 });

 let sorted=Object.entries(users).sort((a,b)=>b[1]-a[1]);

 let h="";
 sorted.slice(0,5).forEach(u=>{
   h+=`<p>${u[0]} - ${u[1]} generates</p>`;
 });

 leaderboard.innerHTML=h;
}

// ================= STOCK COUNTER
async function loadStocks(){
 const q = await getDocs(collection(db,"stocks"));

 let stats={MLBB:0,CODM:0,Roblox:0};

 q.forEach(d=>{
   let data=d.data();
   if(!data.used && stats[data.game]!==undefined){
     stats[data.game]++;
   }
 });

 stocks.innerHTML=`
 MLBB: ${stats.MLBB}<br>
 CODM: ${stats.CODM}<br>
 Roblox: ${stats.Roblox}
 `;
}

// ================= LOAD KEYS
async function loadKeys(){
 const q = await getDocs(collection(db,"keys"));
 let h="";

 q.forEach(d=>{
   h+=`<p>${d.id} | ${d.data().used}</p>`;
 });

 keys.innerHTML=h;
}

// ================= ADMIN PROTECTION
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{
 if(!user){
   alert("❌ Login first");
   location="index.html";
   return;
 }

 // 👉 change this to YOUR admin email
 if(user.email !== "jhonlouiebaid92@gmail.com"){
   alert("❌ Not admin");
   location="dashboard.html";
 }
});

// ================= AUTO LOAD
async function loadAll(){
 await loadLogs();
 await loadEarnings();
 await loadChart();
 await loadDailyChart();
 await loadLeaderboard();
 await loadStocks();
 await loadKeys();
}

setInterval(loadAll,5000);
loadAll();
