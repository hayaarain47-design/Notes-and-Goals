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
    "Your goals are worth the effort.",
    "A little progress every day adds up to big results.",
    "Focus on the step in front of you, not the whole staircase."
];

const quoteElement =
    document.getElementById("quote");

const randomIndex =
    Math.floor(Math.random() * quotes.length);

quoteElement.textContent =
    quotes[randomIndex];


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
        Math.round(
            (completedGoals / totalGoals) * 100
        );

    progressText.textContent =
        percentage + "%";

    progressFill.style.width =
        percentage + "%";


    /* Save goals */

    const goalStatus = [];

    goals.forEach(function(goal) {

        goalStatus.push(goal.checked);

    });

    localStorage.setItem(
        "notesGoalsStatus",
        JSON.stringify(goalStatus)
    );
}


goals.forEach(function(goal) {

    goal.addEventListener(
        "change",
        updateProgress
    );

});


/* Load saved goals */

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

    timerDisplay.textContent =
        formattedMinutes +
        ":" +
        formattedSeconds;
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


/* Display timetable */

function displaySchedules() {

    const container =
        document.getElementById(
            "scheduleContainer"
        );


    /* Keep default schedules */

    schedules.forEach(function(item) {

        const existing =
            document.querySelector(
                `[data-id="${item.id}"]`
            );

        if (existing) {
            return;
        }


        const card =
            document.createElement("div");

        card.className =
            "schedule-card";

        card.setAttribute(
            "data-id",
            item.id
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
}


/* Save timetable */

function saveSchedules() {

    localStorage.setItem(
        "notesGoalsSchedules",
        JSON.stringify(schedules)
    );
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


    /* Browser notification */

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


/* Request notification permission */

function requestNotificationPermission() {

    if (
        "Notification" in window &&
        Notification.permission === "default"
    ) {

        Notification.requestPermission();

    }
}


/* Check timetable */

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
   START
========================= */

loadGoals();

updateProgress();

updateTimerDisplay();

displaySchedules();

requestNotificationPermission();

checkStudyTime();


/* Check every minute */

setInterval(
    checkStudyTime,
    60000
);
```javascript
/* =========================
   STUDY NOTES
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


/* DISPLAY NOTES */

function displayNotes() {

    const container =
        document.getElementById(
            "savedNotes"
        );


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


/* LOAD NOTES */

displayNotes();
