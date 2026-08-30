/* =====================================================
   NOTES & GOALS
   COMPLETE JAVASCRIPT
===================================================== */


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


function showRandomQuote() {

    const quoteElement =
        document.getElementById("quote");

    if (!quoteElement) {
        return;
    }


    const randomIndex =
        Math.floor(
            Math.random() * quotes.length
        );


    quoteElement.textContent =
        quotes[randomIndex];
}


showRandomQuote();



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


    const today =
        new Date();


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


    const total =
        dailyGoals.length;


    const completed =
        dailyGoals.filter(
            function(goal) {
                return goal.completed;
            }
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    if (goalCount) {

        goalCount.textContent =
            completed +
            " / " +
            total;

    }


    if (overviewProgress) {

        overviewProgress.textContent =
            percentage +
            "%";

    }

}



/* =========================
   DAILY GOALS
========================= */

let dailyGoals =
    JSON.parse(
        localStorage.getItem(
            "notesGoalsDailyGoals"
        )
    ) || [];


function saveDailyGoals() {

    localStorage.setItem(
        "notesGoalsDailyGoals",
        JSON.stringify(dailyGoals)
    );

}


function addGoal() {

    const input =
        document.getElementById(
            "goalInput"
        );


    if (!input) {
        return;
    }


    const text =
        input.value.trim();


    if (text === "") {

        alert(
            "Please write a goal first."
        );

        return;
    }


    const newGoal = {

        id: Date.now(),

        text: text,

        completed: false

    };


    dailyGoals.push(
        newGoal
    );


    saveDailyGoals();

    displayGoals();


    input.value = "";

}


function displayGoals() {

    const container =
        document.getElementById(
            "goalsContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    dailyGoals.forEach(
        function(goal) {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "goal";


            if (goal.completed) {

                element.classList.add(
                    "completed-goal"
                );

            }


            element.innerHTML = `

                <input
                    type="checkbox"
                    ${goal.completed ? "checked" : ""}
                    onchange="toggleGoal(${goal.id})"
                >

                <label>
                    ${escapeHTML(goal.text)}
                </label>

                <button
                    class="goal-delete"
                    onclick="deleteGoal(${goal.id})"
                >
                    ×
                </button>

            `;


            container.appendChild(
                element
            );

        }
    );


    updateProgress();

}


function toggleGoal(id) {

    dailyGoals =
        dailyGoals.map(
            function(goal) {

                if (goal.id === id) {

                    goal.completed =
                        !goal.completed;

                }

                return goal;

            }
        );


    saveDailyGoals();

    displayGoals();

}


function deleteGoal(id) {

    dailyGoals =
        dailyGoals.filter(
            function(goal) {

                return goal.id !== id;

            }
        );


    saveDailyGoals();

    displayGoals();

}


function updateProgress() {

    const total =
        dailyGoals.length;


    const completed =
        dailyGoals.filter(
            function(goal) {

                return goal.completed;

            }
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    const progressText =
        document.getElementById(
            "progress-text"
        );


    const progressFill =
        document.getElementById(
            "progress-fill"
        );


    if (progressText) {

        progressText.textContent =
            percentage +
            "%";

    }


    if (progressFill) {

        progressFill.style.width =
            percentage +
            "%";

    }


    updateOverview();

}


/* ENTER KEY FOR GOAL */

const goalInput =
    document.getElementById(
        "goalInput"
    );


if (goalInput) {

    goalInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                addGoal();

            }

        }
    );

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


let editingNoteId = null;


function saveNote() {

    const titleInput =
        document.getElementById(
            "noteTitle"
        );


    const textInput =
        document.getElementById(
            "noteText"
        );


    const title =
        titleInput.value.trim();


    const text =
        textInput.value.trim();


    if (
        title === "" ||
        text === ""
    ) {

        alert(
            "Please enter a title and your notes."
        );

        return;
    }


    if (
        editingNoteId !== null
    ) {

        savedNotes =
            savedNotes.map(
                function(note) {

                    if (
                        note.id ===
                        editingNoteId
                    ) {

                        return {

                            id: note.id,

                            title: title,

                            text: text

                        };

                    }


                    return note;

                }
            );


        editingNoteId = null;


        document.querySelector(
            ".notes-container .olive-button"
        ).textContent =
            "Save Note";

    }

    else {

        savedNotes.push({

            id: Date.now(),

            title: title,

            text: text

        });

    }


    localStorage.setItem(
        "notesGoalsNotes",
        JSON.stringify(savedNotes)
    );


    displayNotes();


    titleInput.value = "";

    textInput.value = "";

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

                <div class="note-content">

                    <h3>
                        ${escapeHTML(note.title)}
                    </h3>

                    <p>
                        ${escapeHTML(note.text)}
                    </p>

                </div>


                <div class="note-actions">

                    <button
                        class="edit-button"
                        onclick="editNote(${note.id})"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-button"
                        onclick="deleteNote(${note.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


function editNote(id) {

    const note =
        savedNotes.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!note) {
        return;
    }


    document.getElementById(
        "noteTitle"
    ).value =
        note.title;


    document.getElementById(
        "noteText"
    ).value =
        note.text;


    editingNoteId =
        id;


    document.querySelector(
        ".notes-container .olive-button"
    ).textContent =
        "Update Note";


    document.getElementById(
        "notes"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


function deleteNote(id) {

    savedNotes =
        savedNotes.filter(
            function(note) {

                return note.id !== id;

            }
        );


    localStorage.setItem(
        "notesGoalsNotes",
        JSON.stringify(savedNotes)
    );


    displayNotes();

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


function saveSchedules() {

    localStorage.setItem(
        "notesGoalsSchedules",
        JSON.stringify(schedules)
    );

}


function formatTime(time) {

    const parts =
        time.split(":");


    let hour =
        parseInt(parts[0]);


    const minutes =
        parts[1];


    const ampm =
        hour >= 12
            ? "PM"
            : "AM";


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
            .getElementById(
                "subjectInput"
            )
            .value
            .trim();


    const day =
        document
            .getElementById(
                "dayInput"
            )
            .value;


    const start =
        document
            .getElementById(
                "startTime"
            )
            .value;


    const end =
        document
            .getElementById(
                "endTime"
            )
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


    schedules.push({

        id: Date.now(),

        subject: subject,

        day: day,

        start: start,

        end: end

    });


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


function displaySchedules() {

    const container =
        document.getElementById(
            "scheduleContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    schedules.forEach(
        function(item) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "schedule-card saved-schedule";


            card.dataset.day =
                item.day;


            card.innerHTML = `

                <div class="time">

                    ${formatTime(item.start)}
                    -
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


                <button
                    class="delete-button"
                    onclick="deleteSchedule(${item.id})"
                >
                    Delete
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );


    highlightToday();

}


function deleteSchedule(id) {

    schedules =
        schedules.filter(
            function(item) {

                return item.id !== id;

            }
        );


    saveSchedules();

    displaySchedules();

}


function highlightToday() {

    const today =
        new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    document
        .querySelectorAll(
            ".saved-schedule"
        )
        .forEach(
            function(card) {

                if (
                    card.dataset.day ===
                    today
                ) {

                    card.classList.add(
                        "today-session"
                    );

                }

            }
        );

}


function highlightCurrentDay() {

    const today =
        new Date().toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    document
        .querySelectorAll(
            ".week-day"
        )
        .forEach(
            function(day) {

                if (
                    day.dataset.weekday ===
                    today
                ) {

                    day.classList.add(
                        "active-day"
                    );

                }

            }
        );

}



/* =========================
   REMINDERS
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


    setTimeout(
        function() {

            reminderBox.classList.remove(
                "show"
            );

        },
        10000
    );


    if (
        "Notification" in window &&
        Notification.permission ===
        "granted"
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
        Notification.permission ===
        "default"
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
        String(
            now.getHours()
        ).padStart(2, "0")
        +
        ":" +
        String(
            now.getMinutes()
        ).padStart(2, "0");


    schedules.forEach(
        function(item) {

            if (
                item.day === currentDay &&
                item.start === currentTime
            ) {

                const key =
                    "reminder-" +
                    item.id +
                    "-" +
                    currentDay +
                    "-" +
                    currentTime;


                if (
                    localStorage.getItem(
                        key
                    )
                ) {

                    return;

                }


                showReminder(
                    item.subject
                );


                localStorage.setItem(
                    key,
                    "shown"
                );

            }

        }
    );

}



/* =========================
   STUDY TIMER
========================= */

let selectedMinutes = 25;

let timeLeft =
    selectedMinutes * 60;

let timerInterval = null;


const timerDisplay =
    document.getElementById(
        "timer-display"
    );


const timerStatus =
    document.getElementById(
        "timer-status"
    );


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timeLeft / 60
        );


    const seconds =
        timeLeft % 60;


    if (timerDisplay) {

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

    }

}


function setTimer(minutes) {

    clearInterval(
        timerInterval
    );


    timerInterval = null;


    selectedMinutes =
        minutes;


    timeLeft =
        minutes * 60;


    updateTimerDisplay();


    if (timerStatus) {

        timerStatus.textContent =
            "Ready to focus";

    }


    document
        .querySelectorAll(
            ".preset-button"
        )
        .forEach(
            function(button) {

                button.classList.remove(
                    "active-preset"
                );

            }
        );


    document
        .querySelectorAll(
            ".preset-button"
        )
        .forEach(
            function(button) {

                if (
                    button.textContent.trim() ===
                    minutes + " min"
                ) {

                    button.classList.add(
                        "active-preset"
                    );

                }

            }
        );

}


function startTimer() {

    if (
        timerInterval !== null
    ) {

        return;

    }


    if (timeLeft <= 0) {

        timeLeft =
            selectedMinutes * 60;

    }


    if (timerStatus) {

        timerStatus.textContent =
            "Focus mode is active";

    }


    timerInterval =
        setInterval(
            function() {

                if (
                    timeLeft > 0
                ) {

                    timeLeft--;

                    updateTimerDisplay();

                }

                else {

                    clearInterval(
                        timerInterval
                    );

                    timerInterval = null;


                    if (timerStatus) {

                        timerStatus.textContent =
                            "Session completed";

                    }


                    showReminder(
                        "Study Session"
                    );

                }

            },
            1000
        );

}


function pauseTimer() {

    if (
        timerInterval === null
    ) {

        return;

    }


    clearInterval(
        timerInterval
    );


    timerInterval = null;


    if (timerStatus) {

        timerStatus.textContent =
            "Timer paused";

    }

}


function resetTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval = null;


    timeLeft =
        selectedMinutes * 60;


    updateTimerDisplay();


    if (timerStatus) {

        timerStatus.textContent =
            "Ready to focus";

    }

}



/* =========================
   SAFE HTML
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

displayGoals();

displayNotes();

displaySchedules();

highlightCurrentDay();

updateOverview();

updateTimerDisplay();

requestNotificationPermission();

checkStudyTime();


/* Check reminders every minute */

setInterval(
    checkStudyTime,
    60000
);

