/* =========================
   RANDOM MOTIVATION QUOTES
========================= */

const quotes = [
    "Small progress is still progress.",
    "Your future is created by what you do today.",
    "Stay consistent. Results will follow.",
    "One focused hour can change your whole day.",
    "Believe in your ability to learn.",
    "Do not stop until you are proud of yourself.",
    "Every chapter you complete brings you closer to your goal.",
    "Discipline makes difficult things easier.",
    "Start where you are. Improve one step at a time.",
    "Your goals are worth the effort."
];

const quoteElement = document.getElementById("quote");

const randomIndex = Math.floor(Math.random() * quotes.length);

quoteElement.textContent = quotes[randomIndex];


/* =========================
   GOALS PROGRESS
========================= */

const goals = document.querySelectorAll(
    '.goal input[type="checkbox"]'
);

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

function updateProgress() {

    const totalGoals = goals.length;

    const completedGoals = document.querySelectorAll(
        '.goal input[type="checkbox"]:checked'
    ).length;

    const percentage = Math.round(
        (completedGoals / totalGoals) * 100
    );

    progressText.textContent = percentage + "%";

    progressFill.style.width = percentage + "%";
}


goals.forEach(function(goal) {

    goal.addEventListener("change", updateProgress);

});


/* =========================
   STUDY TIMER
========================= */

let timeLeft = 25 * 60;
let timerInterval = null;

const timerDisplay = document.getElementById("timer-display");


function updateTimerDisplay() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    timerDisplay.textContent =
        formattedMinutes + ":" + formattedSeconds;
}


function startTimer() {

    if (timerInterval !== null) {
        return;
    }

    timerInterval = setInterval(function() {

        if (timeLeft > 0) {

            timeLeft--;

            updateTimerDisplay();

        } else {

            clearInterval(timerInterval);

            timerInterval = null;

            alert("Study session complete! Time for a short break.");

        }

    }, 1000);
}


function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    timeLeft = 25 * 60;

    updateTimerDisplay();
}


/* =========================
   ADD STUDY SESSION
========================= */

function addSchedule() {

    const subject = prompt(
        "Enter the subject name:"
    );

    if (!subject) {
        return;
    }

    const time = prompt(
        "Enter the study time:"
    );

    if (!time) {
        return;
    }

    const container =
        document.querySelector(".timetable-container");

    const schedule = document.createElement("div");

    schedule.className = "schedule-card";

    schedule.innerHTML = `
        <div class="time">${time}</div>

        <div class="subject">
            <h3>${subject}</h3>
            <p>Study Session</p>
        </div>
    `;

    container.appendChild(schedule);
}


/* =========================
   INITIALIZE
========================= */

updateProgress();
updateTimerDisplay();

