const habitSelect = document.getElementById("habitSelect");
const customHabitInput = document.getElementById("customHabit");
const addHabitBtn = document.getElementById("addHabitBtn");
const timerDisplay = document.getElementById("timer");
const streakDisplay = document.getElementById("streak");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const catButtons = document.querySelectorAll(".catBtn");
const calendar = document.getElementById("calendar");

const antiScrollBox = document.getElementById("antiScrollBox");
const startFocusBtn = document.getElementById("startFocusBtn");
const almostScrolledBtn = document.getElementById("almostScrolledBtn");
const distractionCount = document.getElementById("distractionCount");

let habits = {
    mind: ["Read 5 minutes 📖", "Meditate 🧘", "Journal 📓"],
    body: ["Stretch 💪", "Drink water 💧", "Walk 🚶"],
    growth: ["Study 💻", "Plan day 📝", "Clean space 🧹"]
};

let currentCategory = "mind";

function loadHabits() {
    habitSelect.innerHTML = "";
    habits[currentCategory].forEach(habit => {
        let option = document.createElement("option");
        option.textContent = habit;
        habitSelect.appendChild(option);
    });
}

catButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        catButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        currentCategory = this.dataset.cat;
        loadHabits();
    });
});

addHabitBtn.addEventListener("click", function () {
    let newHabit = customHabitInput.value.trim();
    if (newHabit !== "") {
        habits[currentCategory].push(newHabit);
        loadHabits();
        customHabitInput.value = "";
    }
});

let totalTime = 300;
let timeLeft = totalTime;
let interval = null;

function getTodayString() {
    return new Date().toDateString();
}

function getYesterdayString() {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toDateString();
}

function formatDate(date) {
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastDone = localStorage.getItem("lastDone");
let completedDays = JSON.parse(localStorage.getItem("completedDays")) || [];
let distractionCounter = parseInt(localStorage.getItem("distractionCounter")) || 0;

streakDisplay.innerText = "Streak: " + streak + " 🔥";
distractionCount.innerText = "You avoided distraction " + distractionCounter + " times 💪";

function renderCalendar() {
    calendar.innerHTML = "";

    for (let i = 29; i >= 0; i--) {
        let date = new Date();
        date.setDate(date.getDate() - i);

        let dateKey = date.toDateString();
        let formattedDate = formatDate(date);

        let dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        if (dateKey === getTodayString()) {
            dayDiv.classList.add("today");
        }

        if (completedDays.includes(dateKey)) {
            dayDiv.classList.add("done");
            dayDiv.title = formattedDate + " ✅ Completed";
        } else {
            dayDiv.title = formattedDate + " ❌ Not completed";
        }

        let span = document.createElement("span");
        span.textContent = date.getDate();
        dayDiv.appendChild(span);

        calendar.appendChild(dayDiv);
    }
}

renderCalendar();

startFocusBtn.addEventListener("click", function () {
    antiScrollBox.style.display = "none";
    startBtn.click();
});

almostScrolledBtn.addEventListener("click", function () {
    distractionCounter++;
    localStorage.setItem("distractionCounter", distractionCounter);
    distractionCount.innerText = "You avoided distraction " + distractionCounter + " times 💪";
});

startBtn.addEventListener("click", function () {

    if (interval) return;

    interval = setInterval(function () {

        timeLeft--;

        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        if (seconds < 10) seconds = "0" + seconds;

        timerDisplay.innerText = minutes + ":" + seconds;

        if (timeLeft <= 0) {
            clearInterval(interval);
            interval = null;
            timerDisplay.innerText = "Done! 🌟";

            let today = getTodayString();
            let yesterday = getYesterdayString();

            if (lastDone === today) {
            } else if (lastDone === yesterday) {
                streak++;
            } else {
                streak = 1;
            }

            if (!completedDays.includes(today)) {
                completedDays.push(today);
            }

            localStorage.setItem("streak", streak);
            localStorage.setItem("lastDone", today);
            localStorage.setItem("completedDays", JSON.stringify(completedDays));

            streakDisplay.innerText = "Streak: " + streak + " 🔥";
            renderCalendar();
        }

    }, 1000);
});

resetBtn.addEventListener("click", function () {
    clearInterval(interval);
    interval = null;
    timeLeft = totalTime;
    timerDisplay.innerText = "05:00";
});

darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");
});

loadHabits();
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker Registered"));
}
