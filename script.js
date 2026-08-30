/* =========================
   RANDOM MOTIVATION QUOTE
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
    "Your goals are worth the effort.",
    "A little progress every day adds up to big results.",
    "Focus on the step in front of you, not the whole staircase."
];

const quoteElement =
    document.getElementById("quote");

if (quoteElement) {
    const randomIndex =
        Math.floor(Math.random() * quotes.length);

    quoteElement.textContent =
        quotes[randomIndex];
}


/* =========================
   GOALS
========================= */

const goals =
    document.querySelectorAll(
        '.goal input[type="checkbox"]'
    );

const progressText =
    document.getElementById("progress-text");

const progressFill =
    document.getElementById("progress-fill");


function updateProgress() {

    const totalGoals = goals.length;

    const completedGoals =
        document.querySelectorAll(
            '.goal input[type="checkbox"]:checked'
        ).length;

    const percentage =
        totalGoals === 0
            ? 0
            : Math.round(
                (completedGoals / totalGoals) * 100
            );

    progressText.textContent =
        percentage + "%";

    progressFill.style.width =
        percentage + "%";


    const goalStatus = [];

    goals.forEach(function(goal) {
        goalStatus.push(goal.checked);
    });

    localStorage.setItem(
        "notesGoalsStatus",
        JSON.stringify(goalStatus)
    );

    updateOverview();
}


function loadGoals() {

    const savedGoals =
        localStorage.getItem(
            "notesGoalsStatus"
        );

    if (!savedGoals) {
        return;
    }

    const goalStatus =
        JSON.parse(savedGoals);

    goals.forEach(function(goal, index) {

        if (goalStatus[index]) {
            goal.checked = true;
        }

    });
}


goals.forEach(function(goal) {

    goal.addEventListener(
        "change",
        updateProgress
    );

});


/* =========================
   TODAY'S OVERVIEW
========================= */

function updateOverview() {

    const dateElement =
        document.getElementById(
            "current-date"
        );

    const goalCount =
        document.getElementById(
            "goal-count"
        );

    const overviewProgress =
        document.getElementById(
            "overview-progress"
        );


    const today = new Date();


    if (dateElement) {

        dateElement.textContent =
            today.toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                }
            );

    }


    const totalGoals =
        goals.length;

    const completedGoals =
        document.querySelectorAll(
            '.goal input[type="checkbox"]:checked'
        ).length;


    const percentage =
        totalGoals === 0
            ? 0
            : Math.round(
                (completedGoals / totalGoals) * 100
            );


    if (goalCount) {

        goalCount.textContent =
            completedGoals +
            " / " +
            totalGoals;

    }


    if (overviewProgress) {

        overviewProgress.textContent =
            percentage + "%";

    }
}


/* =========================
   STUDY TIMER
========================= */

let timeLeft = 25 * 60;

let timerInterval = null;

const timerDisplay =
    document.getElementById(
        "timer-display"
    );


function updateTimerDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    const formattedMinutes =
        String(minutes).padStart(2, "0");

    const formattedSeconds =
        String(seconds).padStart(2, "0");


    if (timerDisplay) {

        timerDisplay.textContent =
            formattedMinutes +
            ":" +
            formattedSeconds;

    }
}


function startTimer() {

    if (timerInterval !== null) {
        return;
    }

    timerInterval =
        setInterval(function() {

            if (timeLeft > 0) {

                timeLeft--;

                updateTimerDisplay();

            } else {

                clearInterval(
                    timerInterval
                );

                timerInterval = null;

                showReminder(
                    "Study Session"
                );

            }

        }, 1000);
}


function resetTimer() {

    clearInterval(
        timerInterval
    );

    timerInterval = null;

    timeLeft = 25 * 60;

    updateTimerDisplay();
}


/* =========================
   TIMETABLE
========================= */

let schedules =
    JSON.parse(
        localStorage.getItem(
            "notesGoalsSchedules"
        )
    ) || [];


function formatTime(time) {

    const parts =
        time.split(":");

    let hour =
        parseInt(parts[0]);

    const minutes =
        parts[1];

    const ampm =
        hour >= 12 ? "PM" : "AM";

    hour =
        hour % 12 || 12;


    return (
        String(hour).padStart(2, "0") +
        ":" +
        minutes +
        " " +
        ampm
    );
}


function addSchedule() {

    const subject =
        document
            .getElementById("subjectInput")
            .value
            .trim();

    const day =
        document
            .getElementById("dayInput")
            .value;

    const start =
        document
            .getElementById("startTime")
            .value;

    const end =
        document
            .getElementById("endTime")
            .value;


    if (
        subject === "" ||
        day === "" ||
        start === "" ||
        end === ""
    ) {

        alert(
            "Please fill in all timetable details."
        );

        return;
    }


    if (start >= end) {

        alert(
            "End time must be after start time."
        );

        return;
    }


    const newSchedule = {

        id: Date.now(),

        subject: subject,

        day: day,

        start: start,

        end: end

    };


    schedules.push(
        newSchedule
    );


    saveSchedules();

    displaySchedules();


    document.getElementById(
        "subjectInput"
    ).value = "";

    document.getElementById(
        "dayInput"
    ).value = "";

    document.getElementById(
        "startTime"
    ).value = "";

    document.getElementById(
        "endTime"
    ).value = "";
}


function saveSchedules() {

    localStorage.setItem(
        "notesGoalsSchedules",
        JSON.stringify(schedules)
    );
}


function displaySchedules() {

    const container =
        document.getElementById(
            "scheduleContainer"
        );

    if (!container) {
        return;
    }


    /* Remove previously added cards */

    const savedCards =
        container.querySelectorAll(
            ".saved-schedule"
        );

    savedCards.forEach(function(card) {
        card.remove();
    });


    schedules.forEach(function(item) {

        const card =
            document.createElement("div");

        card.className =
            "schedule-card saved-schedule";


        card.setAttribute(
            "data-day",
            item.day
        );


        card.innerHTML = `

            <div class="time">

                ${formatTime(item.start)}

                <br>
                -
                <br>

                ${formatTime(item.end)}

            </div>


            <div class="subject">

                <h3>
                    ${escapeHTML(item.subject)}
                </h3>

                <p>
                    ${item.day} • Study Session
                </p>

            </div>

        `;


        container.appendChild(card);

    });


    highlightToday();
}


/* =========================
   HIGHLIGHT TODAY
========================= */

function highlightToday() {

    const today =
        new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    const cards =
        document.querySelectorAll(
            ".saved-schedule"
        );


    cards.forEach(function(card) {

        if (
            card.dataset.day === today
        ) {

            card.classList.add(
                "today-session"
            );

        } else {

            card.classList.remove(
                "today-session"
            );

        }

    });
}


/* =========================
   STUDY REMINDER
========================= */

const reminderBox =
    document.getElementById(
        "reminderBox"
    );


function showReminder(subject) {

    if (!reminderBox) {
        return;
    }


    reminderBox.innerHTML = `

        <h3>
            Study Time!
        </h3>

        <p>
            It's time to study
            <strong>
                ${escapeHTML(subject)}
            </strong>.
        </p>

    `;


    reminderBox.classList.add(
        "show"
    );


    setTimeout(function() {

        reminderBox.classList.remove(
            "show"
        );

    }, 10000);


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "Study Time!",
            {
                body:
                    "It's time to study " +
                    subject + "."
            }
        );

    }
}


function requestNotificationPermission() {

    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {

        Notification.requestPermission();

    }
}


function checkStudyTime() {

    if (schedules.length === 0) {
        return;
    }


    const now =
        new Date();


    const currentDay =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    const currentTime =
        now.getHours()
            .toString()
            .padStart(2, "0")
        +
        ":" +
        now.getMinutes()
            .toString()
            .padStart(2, "0");


    schedules.forEach(function(item) {

        if (
            item.day === currentDay &&
            item.start === currentTime
        ) {

            const reminderKey =
                item.id +
                "-" +
                currentDay +
                "-" +
                currentTime;


            if (
                localStorage.getItem(
                    "reminder-" +
                    reminderKey
                )
            ) {

                return;

            }


            showReminder(
                item.subject
            );


            localStorage.setItem(
                "reminder-" +
                reminderKey,
                "shown"
            );

        }

    });
}


/* =========================
   NOTES
========================= */

let savedNotes =
    JSON.parse(
        localStorage.getItem(
            "notesGoalsNotes"
        )
    ) || [];


function saveNote() {

    const title =
        document
            .getElementById("noteTitle")
            .value
            .trim();

    const text =
        document
            .getElementById("noteText")
            .value
            .trim();


    if (
        title === "" ||
        text === ""
    ) {

        alert(
            "Please enter a title and your notes."
        );

        return;
    }


    const newNote = {

        id: Date.now(),

        title: title,

        text: text

    };


    savedNotes.push(
        newNote
    );


    localStorage.setItem(
        "notesGoalsNotes",
        JSON.stringify(savedNotes)
    );


    displayNotes();


    document.getElementById(
        "noteTitle"
    ).value = "";

    document.getElementById(
        "noteText"
    ).value = "";
}


function displayNotes() {

    const container =
        document.getElementById(
            "savedNotes"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    savedNotes.forEach(
        function(note) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "note-card";


            card.innerHTML = `

                <h3>
                    ${escapeHTML(note.title)}
                </h3>

                <p>
                    ${escapeHTML(note.text)}
                </p>

            `;


            container.appendChild(
                card
            );

        }
    );
}


/* =========================
   SAFE TEXT
========================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}


/* =========================
   INITIALIZE
========================= */

loadGoals();

updateProgress();

updateOverview();

updateTimerDisplay();

displaySchedules();

displayNotes();

requestNotificationPermission();

checkStudyTime();


/* Check study reminder every minute */

setInterval(
    checkStudyTime,
    60000
);
