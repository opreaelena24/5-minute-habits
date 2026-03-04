const habitSelect=document.getElementById("habitSelect")
const timerDisplay=document.getElementById("timer")
const startBtn=document.getElementById("startBtn")
const resetBtn=document.getElementById("resetBtn")
const calendar=document.getElementById("calendar")
const streakDisplay=document.getElementById("streak")

let habits={

mind:["Read 📖","Meditate 🧘","Journal 📓"],

body:["Stretch 💪","Drink water 💧","Walk 🚶"],

growth:["Study 💻","Plan day 📝","Clean space 🧹"]

}

let currentCategory="mind"

function loadHabits(){

habitSelect.innerHTML=""

habits[currentCategory].forEach(h=>{

let option=document.createElement("option")

option.textContent=h

habitSelect.appendChild(option)

})

}

document.querySelectorAll(".catBtn").forEach(btn=>{

btn.addEventListener("click",function(){

document.querySelectorAll(".catBtn").forEach(b=>b.classList.remove("active"))

this.classList.add("active")

currentCategory=this.dataset.cat

loadHabits()

})

})

loadHabits()

let totalTime=300
let timeLeft=300
let interval=null

let streak=parseInt(localStorage.getItem("streak"))||0
let completedDays=JSON.parse(localStorage.getItem("completedDays"))||[]
let lastDone=localStorage.getItem("lastDone")

streakDisplay.innerText="Streak: "+streak+" 🔥"

function getToday(){

return new Date().toDateString()

}

function getYesterday(){

let d=new Date()

d.setDate(d.getDate()-1)

return d.toDateString()

}

function renderCalendar(){

calendar.innerHTML=""

for(let i=29;i>=0;i--){

let date=new Date()

date.setDate(date.getDate()-i)

let key=date.toDateString()

let day=document.createElement("div")

day.classList.add("day")

if(key===getToday()){

day.classList.add("today")

}

if(completedDays.includes(key)){

day.classList.add("done")

}

let span=document.createElement("span")

span.textContent=date.getDate()

day.appendChild(span)

calendar.appendChild(day)

}

}

renderCalendar()

startBtn.addEventListener("click",function(){

if(interval)return

interval=setInterval(()=>{

timeLeft--

let min=Math.floor(timeLeft/60)

let sec=timeLeft%60

if(sec<10)sec="0"+sec

timerDisplay.innerText=min+":"+sec

if(timeLeft<=0){

clearInterval(interval)

interval=null

timerDisplay.innerText="Done! 🌟"

let today=getToday()

let yesterday=getYesterday()

if(lastDone===yesterday){

streak++

}else{

streak=1

}

if(!completedDays.includes(today)){

completedDays.push(today)

}

localStorage.setItem("streak",streak)

localStorage.setItem("lastDone",today)

localStorage.setItem("completedDays",JSON.stringify(completedDays))

streakDisplay.innerText="Streak: "+streak+" 🔥"

renderCalendar()

}

},1000)

})

resetBtn.addEventListener("click",function(){

clearInterval(interval)

interval=null

timeLeft=totalTime

timerDisplay.innerText="05:00"

})

if("serviceWorker" in navigator){

navigator.serviceWorker.register("sw.js")

.then(()=>console.log("Service Worker Registered"))

}

let deferredPrompt

const installBtn=document.getElementById("installBtn")

window.addEventListener("beforeinstallprompt",(e)=>{

e.preventDefault()

deferredPrompt=e

installBtn.style.display="block"

})

installBtn.addEventListener("click",async()=>{

installBtn.style.display="none"

deferredPrompt.prompt()

const {outcome}=await deferredPrompt.userChoice

console.log(`User response: ${outcome}`)

deferredPrompt=null

})
