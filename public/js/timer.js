/*
Local Storage

This is the space contains function that will use repetitive throughout
the script that will accociate with local storage such as getter and setter
method. Every script will have different function accorded to its use case.
*/
function getTomato() {
    let tomato = localStorage.getItem("tomato");

    if (tomato == null)
        return 0;

    tomato = JSON.parse(tomato);
    return tomato;
}

function getSubjects() {
    let subjects = localStorage.getItem("subjects");

    if (subjects == null)
        return {};

    subjects = JSON.parse(subjects);
    return subjects;
}

class Time {
    constructor(minute, second) {
        this.minute = minute;
        this.second = second;
    }
}

function getSetting() {
    let setting = localStorage.getItem("setting");

    if (setting == null)
        return {
            "pomodoro": new Time(25, 0),
            "short": new Time(5, 0),
            "long": new Time(30, 0),
            "interval": 4
        };

    setting = JSON.parse(setting);
    return setting;
}

function getTask() {
    // prevent edge case by stop the action
    if (subjectSelect == "" || assignmentSelectIndex == -1 || taskSelectSection == "" || taskSelectIndex == -1) {
        return console.error("Can't get the current task information because variable is missing, need fix real quick");
    }

    let subjects = getSubjects();
    return subjects[subjectSelect].assignments[assignmentSelectIndex].task[taskSelectSection][taskSelectIndex];
}

function updateTask(newTask) {
    let subjectData = getSubjects();

    // edge case prevent
    if (subjectData[subjectSelect].assignments[assignmentSelectIndex].task[taskSelectSection][taskSelectIndex] == null)
        return;

    // update new task on where the old task is
    subjectData[subjectSelect].assignments[assignmentSelectIndex].task[taskSelectSection][taskSelectIndex] = newTask;

    // Local storage can only store strings, while we want to store a dictionary. To get around this, we use JSON.stringify (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
    subjectData = JSON.stringify(subjectData);

    // And finally we write the JSON string into local storage.
    localStorage.setItem('subjects', subjectData);
}

/*
General Start-up Function

These function below will run when user click on any page within the application
Mainly will used for load in the tomato currency and play the current music
*/

function LoadTomato() {
    let tomatoText = document.getElementById("Tomato-text");
    let tomato = getTomato();
    tomatoText.value = tomato;
    tomatoText.innerText = tomato;
}
LoadTomato();

/*
Timer page

Below are script that will accociated with task page only
*/

/* variable */

var mode = "pomodoro";
var subjectSelect = "";
var assignmentSelectIndex = -1; // index -1 mean it does not exist
var taskSelectSection = "";
var taskSelectIndex = -1;

// sound
var buttonSound = document.getElementById("button-sound");
var alarmSound = document.getElementById("alarm-sound");

// DOM
var settingButton = document.getElementById("setting-button");
var settingForm = document.getElementById("timer-setting");
var settingSubmitButton = settingForm.querySelector("form > #form-submit-button");
var settingExitButton = settingForm.querySelector("form > #form-exit-button");
var settingBackground = settingForm.getElementsByTagName("div")[0];
var settingResetButton = document.getElementById("setting-reset-button")

var selectButton = document.querySelector("#timer-page-select > article");
var selectForm = document.getElementById("timer-select");
var selectSubmitButton = selectForm.querySelector("form > #form-submit-button");
var selectExitButton = selectForm.querySelector("form > #form-exit-button");
var selectBackground = selectForm.getElementsByTagName("div")[0];

var congratForm = document.getElementById("timer-congrat");
var congratSubmitButton = congratForm.querySelector("form > #form-submit-button");
var congratExitButton = congratForm.querySelector("form > #form-exit-button");
var congratBackground = congratForm.getElementsByTagName("div")[0];

var subjectSelectBox = selectForm.getElementsByTagName("select")[0];
var assignmentSelectBox = selectForm.getElementsByTagName("select")[1];
var taskSelectBox = selectForm.getElementsByTagName("select")[2];

var pageBackground = document.getElementById("Timer-page");
var timerPage = document.getElementById("timer-page-main");
var selectPage = document.getElementById("timer-page-select");

var navPomodoroButton = document.getElementById("timer-pomodoro-nav");
var navStopwatchButton = document.getElementById("timer-stopwatch-nav");
var navSpan = pageBackground.querySelector("nav > span");

var timerText = timerPage.getElementsByTagName("timer-text")[0];
var playButton = timerPage.getElementsByTagName("button")[0];
var resetButton = timerPage.getElementsByTagName("button")[1];

var taskArticle = timerPage.getElementsByTagName("article")[0];
var articleSubject = taskArticle.getElementsByTagName("h1")[0];
var articleTask = taskArticle.getElementsByTagName("h2")[0];
var articleProgressText = taskArticle.querySelector("div > label");
var articleProgressBar = taskArticle.querySelector("div > div");

/**
function form-validation

On every list in the form will contains small tags that will fill in
later on when the form is invalid (such as when user leave empty space)
By making custom form validation will help making overall UI looks appealing
to the website instead of default form validation. 

The constant variable will use as a message when user have done something to
the form input to prevent edge case or empty data when the form required it
to be filled. 
@see const

showError and showSuccess is the function that will change the looks of the form
@see showError @see showSuccess

Input in different type will be able to perform a different text message
thanks to dictonary where it use input type as a key and its value that
perform different functionallity. 
@see InputValid

When pass in the ul list of form, the validate form function will check
every input to see if it's valid, if not then it perform function accorded
to input tyoe in InputValid
@see validateForm

There also special function that can clear every input on the form and set
the form to default value
@see clearFormInput
*/
const NORMAL_MESSAGE = "Please fill in the space above";
const SELECT_MESSAGE = "Please select the option above";
const NUMBER_MESSAGE = "Please fill in this space";
const NUMBER_EDGE_MESSAGE = "Number can't be negative or decimal";

function showError(input, message) {
    input.style.border = "1px solid transparent";
    input.style.outline = "2px solid #da3e52"; // make the input border red
    let messageElem = input.parentNode.querySelector("small");
    messageElem.innerText = message;
    return false;
}

function showSuccess(input) {
    input.style.border = "1px solid #696773"; // make the input border normal
    input.style.outline = null;
    let messageElem = input.parentNode.querySelector("small");
    messageElem.innerText = null;
    return true;
}

function textValid(input) {
    if (input.value == "") {
        return showError(input, NORMAL_MESSAGE);
    } else {
        return showSuccess(input);
    }
}

function selectValid(input) {
    if (input.value == "") {
        return showError(input, SELECT_MESSAGE);
    } else {
        return showSuccess(input);
    }
}

const InputValid = {
    "text": textValid,
    "select": selectValid,
};

function validateForm(ulForm) {
    let isValidForm = true
	let inputList = ulForm.getElementsByTagName("li");

    for (let i = 0; i < inputList.length; i++) {
        let list = inputList[i];
        let input = list.getElementsByTagName("input")[0];

        if (input == null)
            input = list.getElementsByTagName("select")[0];
        
        if (input == null)
            continue;

        let inputIsRequired = input.required;
        if (inputIsRequired) {
            let inputType = input.type;
            if (input.tagName != "SELECT") {
                let checker_function = InputValid[inputType];
                let is_valid = checker_function(input);
                if (!is_valid)
                    isValidForm = false;
            } else {
                let checker_function = InputValid["select"];
                let is_valid = checker_function(input);
                if (!is_valid)
                    isValidForm = false;
            }
        }
    }

    if (isValidForm) return true;
    return false;
}


/* 
function startup

Timer page does not have its own function startup instead use this section
to initialise the Timer function which will run every second after user
start the timer
*/


var counterFunction;

var current_time = new Time(0,0);
var current_phase = "pomodoro";
var current_interval = 0;

/* Time Logic Handler
this function use to handle time logic. Need to be call every second pass.
When the mode is different, the behaviour of tick also change.
*/
function tick() {
    if (mode == "pomodoro") {
        if (current_time.minute == 0 && current_time.second == 0) return;

        if (current_time.second > 0) {
            current_time.second -= 1;
        } else {
            current_time.second = 59;
            current_time.minute -= 1;
        }
    } else if (mode == "stopwatch") {
        if (current_time.second >= 59) {
            current_time.second = 0;
            current_time.minute += 1;
        } else {
            current_time.second += 1;
        }
    }
}

function PomodoroCount() {
    let setting = getSetting();

    // when time at zero
    if (current_time.minute == 0 && current_time.second == 0) {

        // play alarm sound
        alarmSound.play();

        if (current_phase == "pomodoro") {
            // update tomato
            let updateTomato = JSON.stringify(getTomato()+1);
            localStorage.setItem("tomato", updateTomato);
            LoadTomato();

            // update task progress
            let task = getTask();
            task.progress = parseInt(task.progress) + 1;
            if (task.progress >= task.goal) {
                task.isDone = true;
                updateTask(task);

                // change to select page
                clearInterval(counterFunction);
                current_phase = "pomodoro";
                renderTomodoro();
                timerPage.style.visibility = "hidden";
                taskArticle.style.visibility = "hidden";
                selectPage.style.visibility = "visible";

                // update assignment where we change position of task to done section
                let subjects = getSubjects();
                subjects[subjectSelect].assignments[assignmentSelectIndex].task[taskSelectSection].splice(taskSelectIndex,1); // remove that task on the section
                subjects[subjectSelect].assignments[assignmentSelectIndex].task["done"].push(task);
                subjects = JSON.stringify(subjects);
                localStorage.setItem('subjects', subjects);

                // popup congratulation form came up, so the user know the task they are working on is done
                congratForm.style.visibility = "visible";
                return;
            } else {
                updateTask(task);
            }
            renderProgress();

            // updaet interval
            current_interval += 1;

            // render new background and change current phase var
            if (current_interval == setting.interval) {
                current_interval = 0;
                current_phase = "longbreak";
                current_time = setting.long;
                renderLongbreak();
            } else {
                current_phase = "shortbreak";
                current_time = setting.short;
                renderShortbreak();
            }
        } else {
            current_phase = "pomodoro"
            current_time = setting.pomodoro;
            renderTomodoro();
        }

    } else {

        // the time ticking function
        tick();

    }

    // render new time to user
    renderTime();
}

function StopwatchCount() {
    tick();
    renderTime();
}


/* 
function render

Such as background or text color change, progress bar update, and timer count
*/


function changeThemeColor(textClass) {
    // change navigation button color
    navPomodoroButton.className = textClass;
    navStopwatchButton.className = textClass;

    // change span at navigation color
    if (textClass == "time-text-black") {
        navSpan.style.backgroundColor = "#272727";
        articleProgressBar.style.backgroundColor = "#EFF1F3";
    } else {
        navSpan.style.backgroundColor = "#EFF1F3";
        articleProgressBar.style.backgroundColor = "#96e6b3";
    }

    // change timer and task text color
    articleSubject.className = textClass;
    articleTask.className = textClass;
    timerText.className = textClass;
}

function renderProgress() {
    let task = getTask();
    articleProgressText.innerText = task.progress + " / " + task.goal;
    articleProgressBar.style.width = Math.min((task.progress/task.goal)*100, 100) + "%";
    articleProgressBar.style.right = 50-(Math.min((task.progress/task.goal)*100, 100)/2) + "%";
}

function renderTime() {
    // update timer text
    let minute = current_time.minute;
    if (minute < 10)
        minute = "0" + minute;
    
    let second = current_time.second;
    if (second < 10)
        second = "0" + second;

    timerText.innerText = minute + ":" + second;
}

function renderTomodoro() {
    // change background color
    pageBackground.className = "time-pomodoro";

    // change text color
    changeThemeColor("time-text-white");
}

function renderShortbreak() {
    // change background color
    pageBackground.className = "time-shortbreak";

    // change text color
    changeThemeColor("time-text-black");
}

function renderLongbreak() {
    // change background color
    pageBackground.className = "time-longbreak";

    // change text color
    changeThemeColor("time-text-black");
}


/* 
function event

These function below is where the user interaction within the page happened
These function will perform vary depend on the button that pass the function
*/


/* Play Button
When player pressing start button, it will start the counting function
every second. The behaviour of function changed accorded to the mode.
It also swap between start and stop mode with playSwitch variable.
*/

var playSwitch = false; // if true mean, the play button will stop function

playButton.addEventListener("click", function(event) {
    buttonSound.play();

    if (playSwitch) {
        playSwitch = false;
        playButton.innerText = "START";

        clearInterval(counterFunction); // stop the counter loop
    } else {
        playSwitch = true;
        playButton.innerText = "STOP";

        if (mode == "pomodoro") {
            counterFunction = setInterval(PomodoroCount, 1000) // 1000 mean it will call this function every 1000 milisecond (which is 1 second)
        } else if (mode == "stopwatch") {
            counterFunction = setInterval(StopwatchCount, 1000)
        }
    }
})

/* Reset Button
User can reset their timer back to begining. With stopwatch, it's simple just
set back to 0. But with Tomodoro, it will have to change page back to select
page and stop the counting progress.
*/

resetButton.addEventListener("click", function(event) {
    buttonSound.play();
    clearInterval(counterFunction);

    if (mode == "pomodoro") {
        current_phase = "pomodoro";
        renderTomodoro();
        timerPage.style.visibility = "hidden";
        taskArticle.style.visibility = "hidden";
        selectPage.style.visibility = "visible";
    } else if (mode == "stopwatch") {
        playSwitch = false;
        playButton.innerText = "START";
    
        current_time = new Time(0,0);
        renderTime();
    }
})

/* Navigation Button
On timer page, there are 2 modes of timer which is Pomodoro and Stopwatch
By clicking on the nav, it will change the page mode, which will make the
timer acts differently
*/

navPomodoroButton.addEventListener("click", function(event) {
    if (mode == "pomodoro") return; // not doing anything if the user still on the same mode

    // change the mode
    mode = "pomodoro";

    // Stop time loop
    clearInterval(counterFunction);

    // change background color
    pageBackground.className = "time-pomodoro";

    // change text color
    changeThemeColor("time-text-white");

    // hide the timer page
    timerPage.style.visibility = "hidden";

    // show the select page
    selectPage.style.visibility = "visible";
})

navStopwatchButton.addEventListener("click", function(event) {
    if (mode == "stopwatch") return; // not doing anything if the user still on the same mode

    // change the mode
    mode = "stopwatch";

    // Stop time loop and reset the timer count
    clearInterval(counterFunction);
    current_time = new Time(0,0);
    renderTime();

    // reset start button
    playSwitch = false;
    playButton.innerText = "START";

    // change background color
    pageBackground.className = "time-stopwatch";

    // change text color
    changeThemeColor("time-text-black");

    // hide the task section
    taskArticle.style.visibility = "hidden";

    // hide the select page
    selectPage.style.visibility = "hidden";

    // show the timer page
    timerPage.style.visibility = "visible";
})

/* Change the pomodoro setting
Every time user open setting form, it will automatically fill all the input
with current setting data. The form doesn't require every input to be filled
up. It will automatically prevent the edge case where the empty space will
got replace with old setting data. The reset button will help user set back 
to its default value in case if they prefer the standard one
*/

// open form event
settingButton.addEventListener("click", function(event) {
    // getting setting data
    let setting = getSetting();

    // Start by getting form input
    let pomodoroMinute = settingForm.querySelector("input[name='pomodoro-minute']");
    let pomodoroSecond = settingForm.querySelector("input[name='pomodoro-second']");
    let shortbreakMinute = settingForm.querySelector("input[name='shortbreak-minute']");
    let shortbreakSecond = settingForm.querySelector("input[name='shortbreak-second']");
    let longbreakMinute = settingForm.querySelector("input[name='longbreak-minute']");
    let longbreakSecond = settingForm.querySelector("input[name='longbreak-second']");
    let longbreakInterval = settingForm.querySelector("input[name='longbreak-interval']");

    // change its inner text and value accorded to setting existed data
    pomodoroMinute.value = setting.pomodoro.minute;
    pomodoroMinute.innerText = setting.pomodoro.minute;
    pomodoroSecond.value = setting.pomodoro.second;
    pomodoroSecond.innerText = setting.pomodoro.second;
    shortbreakMinute.value = setting.short.minute;
    shortbreakMinute.innerText = setting.short.minute;
    shortbreakSecond.value = setting.short.second;
    shortbreakSecond.innerText = setting.short.second;
    longbreakMinute.value = setting.long.minute;
    longbreakMinute.innerText = setting.long.minute;
    longbreakSecond.value = setting.long.second;
    longbreakSecond.innerText = setting.long.second;
    longbreakInterval.value = setting.interval;
    longbreakInterval.innerText = setting.interval;

    settingForm.style.visibility = "visible";
});

// close form event
settingBackground.addEventListener("click", function(event) {
    settingForm.style.visibility = "hidden";
});

settingExitButton.addEventListener("click", function(event) {
    settingForm.style.visibility = "hidden";
});

// sunmit form event
settingSubmitButton.addEventListener("click", function(event) {
    event.preventDefault();

    // Start by getting form value
    let pomodoroMinute = settingForm.querySelector("input[name='pomodoro-minute']").value;
    let pomodoroSecond = settingForm.querySelector("input[name='pomodoro-second']").value;
    let shortbreakMinute = settingForm.querySelector("input[name='shortbreak-minute']").value;
    let shortbreakSecond = settingForm.querySelector("input[name='shortbreak-second']").value;
    let longbreakMinute = settingForm.querySelector("input[name='longbreak-minute']").value;
    let longbreakSecond = settingForm.querySelector("input[name='longbreak-second']").value;
    let longbreakInterval = settingForm.querySelector("input[name='longbreak-interval']").value;

    // if the value is empty then set it to the oldSetting value, so it less annoy the user and prevent edge case
    let oldSetting = getSetting();
    if (pomodoroMinute == null) pomodoroMinute = oldSetting.pomodoro.minute;
    if (pomodoroSecond == null) pomodoroSecond = oldSetting.pomodoro.second;
    if (shortbreakMinute == null) shortbreakMinute = oldSetting.short.minute;
    if (shortbreakSecond == null) shortbreakSecond = oldSetting.short.second;
    if (longbreakMinute == null) longbreakMinute = oldSetting.long.minute;
    if (longbreakSecond == null) longbreakSecond = oldSetting.long.second;
    if (longbreakInterval == null) longbreakInterval = oldSetting.interval;

    // second and minute also can't be decimal
    pomodoroMinute = Math.floor(pomodoroMinute);
    pomodoroSecond = Math.floor(pomodoroSecond);
    shortbreakMinute = Math.floor(shortbreakMinute);
    shortbreakSecond = Math.floor(shortbreakSecond);
    longbreakMinute = Math.floor(longbreakMinute);
    longbreakSecond = Math.floor(longbreakSecond);

    // if second is exceed 60 then add it up to minute
    if (pomodoroSecond >= 60) {
        pomodoroMinute = parseInt(pomodoroMinute) + Math.floor(pomodoroSecond/60);
        pomodoroSecond = pomodoroSecond%60;
    }
    if (shortbreakSecond >= 60) {
        shortbreakMinute = parseInt(shortbreakMinute) + Math.floor(shortbreakSecond/60);
        shortbreakSecond = shortbreakSecond%60;
    }
    if (longbreakSecond >= 60) {
        longbreakMinute += parseInt(longbreakMinute) + Math.floor(longbreakSecond/60);
        longbreakSecond = longbreakSecond%60;
    }

    // interval can't lower than 1 or decimal
    if (longbreakInterval < 1)
        longbreakInterval = 1;
    longbreakInterval = Math.floor(longbreakInterval);

    // Make a JS object to contain new setting information
    let newSetting = {
        "pomodoro": new Time(pomodoroMinute, pomodoroSecond),
        "short": new Time(shortbreakMinute, shortbreakSecond),
        "long": new Time(longbreakMinute, longbreakSecond),
        "interval": longbreakInterval
    };

    // Local storage can only store strings, while we want to store an object. To get around this, we use JSON.stringify (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
    newSetting = JSON.stringify(newSetting);

    // And finally we write the JSON string into local storage.
    localStorage.setItem('setting', newSetting);

    // close the form
    settingForm.style.visibility = "hidden";
})

// setting reset button
settingResetButton.addEventListener("click", function(event) {
    // Start by getting form value
    let pomodoroMinute = settingForm.querySelector("input[name='pomodoro-minute']");
    let pomodoroSecond = settingForm.querySelector("input[name='pomodoro-second']");
    let shortbreakMinute = settingForm.querySelector("input[name='shortbreak-minute']");
    let shortbreakSecond = settingForm.querySelector("input[name='shortbreak-second']");
    let longbreakMinute = settingForm.querySelector("input[name='longbreak-minute']");
    let longbreakSecond = settingForm.querySelector("input[name='longbreak-second']");
    let longbreakInterval = settingForm.querySelector("input[name='longbreak-interval']");

    // change its inner text and value accorded to original setting value
    pomodoroMinute.value = 25;
    pomodoroMinute.innerText = 25;
    pomodoroSecond.value = 0;
    pomodoroSecond.innerText = 0;
    shortbreakMinute.value = 5;
    shortbreakMinute.innerText = 5;
    shortbreakSecond.value = 0;
    shortbreakSecond.innerText = 0;
    longbreakMinute.value = 30;
    longbreakMinute.innerText = 30;
    longbreakSecond.value = 0;
    longbreakSecond.innerText = 0;
    longbreakInterval.value = 4;
    longbreakInterval.innerText = 4;
})

/* Select task
When the user want to use the pomodoro timer. They will need to select a task
that they would like to work on it. This will motivate user to keep on doing
task and track their progress. The form input will be the select tag and when
the user done select the top input, it will show up another input to the user.
When open the form, it will clear all the option inside it.
*/

// repetitive function
function clearAndFillEmptyOption(selectBox) {
    // clear all the options if there're any
    while (selectBox.firstChild)
        selectBox.removeChild(selectBox.lastChild);
    
    // add empty option as the first option
    let emptyChoice = document.createElement("option");
    emptyChoice.innerText = "";
    emptyChoice.style.display = "none";
    selectBox.appendChild(emptyChoice);
}

function clearAndFillSubjectInput() {
    clearAndFillEmptyOption(subjectSelectBox);

    // put the option inside select box
    subjectSelectBox.disabled = true;
    let subjects = getSubjects();
    for (let key in subjects) {
        subjectSelectBox.disabled = false;
        let subjectName = key;
        let subjectChoice = document.createElement("option");
        subjectChoice.innerText = subjectName;
        subjectChoice.value = subjectName;
        subjectSelectBox.appendChild(subjectChoice);
    }
}

function clearAndFillAssignmentInput() {
    clearAndFillEmptyOption(assignmentSelectBox);

    // if user didn't select any subject yet, then stop at this stage
    let subjects = getSubjects();
    if (subjects[subjectSelect] == null) return;

    // put the option inside select box
    assignmentSelectBox.disabled = true;
    for (let i = 0; i < subjects[subjectSelect].assignments.length; i++) {
        if (subjects[subjectSelect].assignments[i].isDone == true) continue;
        assignmentSelectBox.disabled = false;
        let assignmentName = subjects[subjectSelect].assignments[i].name;
        let assignmentChoice = document.createElement("option");
        assignmentChoice.innerText = assignmentName;
        assignmentChoice.value = i;
        assignmentSelectBox.appendChild(assignmentChoice);
    }
}

function clearAndFillTaskInput() {
    clearAndFillEmptyOption(taskSelectBox);

    // if user didn't select any subject or assignment yet, then stop at this stage
    let subjects = getSubjects();
    if (subjects[subjectSelect] == null) return;
    if (assignmentSelectIndex == -1) return;

    // put the option inside select box (except task in done section)
    taskSelectBox.disabled = true;
    for (let [section, taskArray] of Object.entries(subjects[subjectSelect].assignments[assignmentSelectIndex].task)) {
        if (section == "done") continue;

        for (let i = 0; i < taskArray.length; i++) {
            taskSelectBox.disabled = false;
            let taskName = taskArray[i].name;
            let taskChoice = document.createElement("option");
            taskChoice.innerText = taskName;
            taskChoice.value = section + "-" + i;
            taskSelectBox.appendChild(taskChoice);
        }
    }
}

// open form event
selectButton.addEventListener("click", function(event) {
    // reset variable
    subjectSelect = "";
    assignmentSelectIndex = -1;
    taskSelectSection = "";
    taskSelectIndex = -1;

    // hide the assignment select box
    let assignmentSelectListElement = selectForm.getElementsByTagName("li")[1];
    assignmentSelectListElement.style.display  = "none";

    // hide the task select box
    let taskSelectListElement = selectForm.getElementsByTagName("li")[2];
    taskSelectListElement.style.display  = "none";

    // clear all the input
    clearAndFillSubjectInput();
    clearAndFillAssignmentInput();
    clearAndFillTaskInput();

    selectForm.style.visibility = "visible";
});

// close form event
selectBackground.addEventListener("click", function(event) {
    selectForm.style.visibility = "hidden";
});

selectExitButton.addEventListener("click", function(event) {
    selectForm.style.visibility = "hidden";
});

// done select subject event
subjectSelectBox.addEventListener("change", function(event) {
    // reset variable
    assignmentSelectIndex = -1;
    taskSelectSection = "";
    taskSelectIndex = -1;

    // get subject selected from the form
    let selectedSubject = subjectSelectBox.value;

    // set the current subject variable
    subjectSelect = selectedSubject;

    // show the assignment select box
    let assignmentSelectListElement = selectForm.getElementsByTagName("li")[1];
    assignmentSelectListElement.style.display  = "initial";

    // hide the task select box
    let taskSelectListElement = selectForm.getElementsByTagName("li")[2];
    taskSelectListElement.style.display  = "none";

    // clear assignment and task input
    clearAndFillAssignmentInput();
    clearAndFillTaskInput();
})

// done select assignment event
assignmentSelectBox.addEventListener("change", function(event) {
    // reset variable
    taskSelectSection = "";
    taskSelectIndex = -1;

    // get assignment selected from the form
    let selectedAssignmentIndex = assignmentSelectBox.value;

    // set the current assignment variable
    assignmentSelectIndex = selectedAssignmentIndex;

    // show the task select box
    let taskSelectListElement = selectForm.getElementsByTagName("li")[2];
    taskSelectListElement.style.display  = "initial";

    // clear task input
    clearAndFillTaskInput();
})

// done select task event
taskSelectBox.addEventListener("change", function(event) {
    // get task selected from the form
    let selectedTaskSection = taskSelectBox.value.split("-")[0];
    let selectedTaskIndex = taskSelectBox.value.split("-")[1];

    // set the current task variable
    taskSelectSection = selectedTaskSection;
    taskSelectIndex = selectedTaskIndex;
})

// submit form event
selectSubmitButton.addEventListener("click", function(event) {
    event.preventDefault();

    // check if form is valid
    let ulElement = selectForm.getElementsByTagName("ul")[0];
    let isValidForm = validateForm(ulElement)
    if (!isValidForm)
        return;
    
    // hide the form
    selectForm.style.visibility = "hidden";

    // hide the select page
    selectPage.style.visibility = "hidden";

    // show the task section
    taskArticle.style.visibility = "visible";

    // show the timer page
    timerPage.style.visibility = "visible";

    // update subject and task name
    let assignmentName = getSubjects()[subjectSelect].assignments[assignmentSelectIndex].name;
    let taskName = getTask().name;
    articleSubject.innerText = subjectSelect + " - " + assignmentName;
    articleTask.innerText = taskName;

    // update progress bar
    renderProgress();

    // change button, so its state is start
    playSwitch = true;
    playButton.innerText = "STOP";

    // reset timer variable and run the timer loop every 1 second
    let setting = getSetting();
    current_time = setting.pomodoro;
    console.log(current_time);
    current_phase = "pomodoro";
    current_interval = 0;
    renderTime();
    counterFunction = setInterval(PomodoroCount, 1000);
})

/* Congratulation task form
This form will shown up when user done their task (when the progress bar
is full when use pomodoro timer)
*/

// close form event
congratBackground.addEventListener("click", function(event) {
    congratForm.style.visibility = "hidden";
});

congratExitButton.addEventListener("click", function(event) {
    congratForm.style.visibility = "hidden";
});

// sunmit form event
congratSubmitButton.addEventListener("click", function(event) {
    congratForm.style.visibility = "hidden";
})