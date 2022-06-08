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

function Time(minute, second) {
    this.minute = minute;
    this.second = second;
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

/* 
update the param assignment to the current assigbment if no destination
provided. And also sort the order of task list accorded to its priority
first and then due date
*/
function updateAssignment(newAssignment, subjectName, assignmentName) {
    if (subjectName == null || assignmentName == null) {
        let list = getCurrentSubjectAndAssignmentName().split("&");
        subjectName = list[0];
        assignmentName = list[1];
    }

    let subjectData = getSubjects();

    // edge case prevent
    if (subjectData[subjectName] == null)
        return;

    // sort task accorded to its priority and due date
    for (let [_, taskArray] of Object.entries(newAssignment.task)) {
        // first sort the task by its due date
        taskArray.sort(function(a, b) {
            return new Date(a.due) - new Date(b.due);
        });

        // then sort task by its priority
        taskArray.sort(function(a, b) {
            return b.priority - a.priority;
        });
    }

    // loop through every assignment to see if the name is match the current assignment
    for (let i = 0; i < subjectData[subjectName].assignments.length; i++) {
        if (subjectData[subjectName].assignments[i].name == assignmentName) {
            // set the assignment to new assignment
            subjectData[subjectName].assignments[i] = newAssignment;
        }
    }

    // update current assignment name (in case, if this function pass by edit assignment function)
    localStorage.setItem('current', subjectName + "&" + newAssignment.name);

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

/*
Timer page

Below are script that will accociated with task page only
*/

/* variable */

var mode = "pomodoro";

var settingButton = document.getElementById("setting-button");
var settingForm = document.getElementById("timer-setting");
var settingSubmitButton = settingForm.querySelector("form > #form-submit-button");
var settingExitButton = settingForm.querySelector("form > #form-exit-button");
var settingBackground = settingForm.getElementsByTagName("div")[0];

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

function numberValid(input) {
    if (input.value == "") {
        return showError(input, NUMBER_MESSAGE);
    } else {
        if (input.value < 0 || input.value%1 != 0)
            return showError(input, NUMBER_EDGE_MESSAGE);
        else
            return showSuccess(input);
    }
}

const InputValid = {
    "text": textValid,
    "select": selectValid,
    "number": numberValid,
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

function clearFormInput(ulForm) {
	let inputList = ulForm.getElementsByTagName("li");
    // loop through every list in ul (because 1 list will contains 1 input)
    for (let i = 0; i < inputList.length; i++) {
        // get the list tag in current index
        let list = inputList[i];

        // get the first input tag on the list
        let input = list.getElementsByTagName("input")[0];

        // if can't get the first input tag then get first textarea tag
        if (input == null)
            input = list.getElementsByTagName("textarea")[0];

        // if still null then get select tag
        if (input == null)
            input = list.getElementsByTagName("select")[0];
        
        // if it's other tag inside ul then we skip that list
        if (input == null)
            continue;

        if (input.tagName == "SELECT") {
            // if input is select then select the first index
            input.selectedIndex = 0;
        } else if (input.type == "radio") {
            // if the input is radio button, checked the first input
            input.checked = true;
        } else {
            input.value = "";
            input.innerText = "";
        }
    }
}

/* 
function startup

Once load in the page, put element to html, the function name told the
exact meaning on what the function do. These function can also used
inside event function to render new data to the page. Since it also clear
information inside any DOM element tag.
*/

// Timer page does not have its own function startup

/* 
function event

These function below is where the user interaction within the page happened
These function will perform vary depend on the button that pass the function
*/

/* Add an assignment form
Every time user open the add assignment form, it will automatically hide
the subject name input and add the subject option on select subject box
By clicking on the dim background or exit button will hide the popup form away
Load the new information to local storage and render it to user
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

    // change its inner text and value accorded to task existed data
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

    // check if form is valid
    let ulElement = assignmentForm.getElementsByTagName("ul")[0];
    let isValidForm = validateForm(ulElement)
    if (!isValidForm)
        return;

    // Start by getting form value
    let subjectName = assignmentSelectBox.value;
    if (subjectName == "new")
        subjectName = assignmentForm.getElementsByTagName("input")[0].value;
    let assignmentName = assignmentForm.getElementsByTagName("input")[1].value;
    let dueDate = assignmentForm.getElementsByTagName("input")[2].value;

    // Make a JS object to contain the assignment data we want to write into local storage for each item.
    let newAssignment = {
        "name": assignmentName,
        "due": dueDate,
        "isDone": false,
        "task": {
            "todo": [],
            "progress": [],
            "done": []
        }
    }

    // check if it's the new subject or existed subject
    let subjects = getSubjects();
    if (subjects[subjectName] == null) {
        let newSubject = {
            "assignments": [newAssignment],
            "contents": []
        };
        subjects[subjectName] = newSubject;
    } else
        subjects[subjectName].assignments.push(newAssignment);

    // Local storage can only store strings, while we want to store a dictionary. To get around this, we use JSON.stringify (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
    subjects = JSON.stringify(subjects);

    // And finally we write the JSON string into local storage.
    localStorage.setItem('subjects', subjects);

    // also update current assignment to the new create assignment
    localStorage.setItem('current', subjectName + "&" + assignmentName);

    // clear all the user input
    clearFormInput(ulElement);

    // Render the new update to the webpage
    LoadSubjectListToAddAssignmentForm();
    LoadKanbanboardCanvas();
    LoadTreeAsideNavigation();

    // close the form
    assignmentForm.style.visibility = "hidden";
})