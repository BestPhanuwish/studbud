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

function getCurrentSubjectAndAssignmentName() {
    let sa = localStorage.getItem("current");

    if (sa == null)
        return "&";

    return sa;
}

function getCurrentSubjectName() {
    let list = getCurrentSubjectAndAssignmentName().split("&");
    let subjectName = list[0];
    return subjectName;
}

function getCurrentAssignment() {
    let list = getCurrentSubjectAndAssignmentName().split("&");
    let subjectName = list[0];
    let assignmentName = list[1];
    let subjectData = getSubjects();

    // edge case checker
    if (subjectData[subjectName] == null)
        return null, null;

    // loop through every assignment to see if the name is match the current assignment
    let currentAssignment;
    subjectData[subjectName].assignments.forEach(function(assignment) {
        if (assignment.name == assignmentName) {
            currentAssignment = assignment;
        }
    });

    return currentAssignment;
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
Task page

Below are script that will accociated with task page only
*/

/* variable */

var boardAddButton = document.querySelector("#Task-List > main-content > #board-add");
var assignmentAddButton = document.querySelector("#Task-List > aside > button");
var assignmentForm = document.getElementById("add-assignment");
var assignmentSubmitButton = assignmentForm.querySelector("form > #form-submit-button");
var assignmentExitButton = assignmentForm.querySelector("form > #form-exit-button");
var assignmentBackground = assignmentForm.getElementsByTagName("div")[0];
var assignmentSelectBox = assignmentForm.getElementsByTagName("select")[0];

var asideNavigationTree = document.querySelector("#Task-List > aside > #assignment-selector");

var kanbanBoard = document.querySelector("#Task-List > main-content > #board-kanban");
var kanbanBoardAdd = document.querySelector("#Task-List > main-content > #board-add");

var kanbanBoardTodo = document.getElementById("board-kanban-todo");
var kanbanBoardTodoAddButton = kanbanBoardTodo.querySelector("#add-task-button");
var kanbanBoardProgress = document.getElementById("board-kanban-progress");
var kanbanBoardProgressAddButton = kanbanBoardProgress.querySelector("#add-task-button");
var kanbanBoardDone = document.getElementById("board-kanban-done");
var kanbanBoardDoneAddButton = kanbanBoardDone.querySelector("#add-task-button");
var kanbanBoardTopbar = document.getElementById("board-kanban-topbar");

var kanbanBoardSubject = kanbanBoardTopbar.querySelector("#text > #subject");
var kanbanBoardAssignment = kanbanBoardTopbar.querySelector("#text > #assignment");
var kanbanBoardDate = kanbanBoardTopbar.querySelector("#text > #due-date");

var markdoneAssignmentButton = kanbanBoardTopbar.querySelector("#button > #mark-button");
var markdoneAssignmentForm = document.getElementById("mark-assignment");
var markdoneAssignmentExitButton = markdoneAssignmentForm.querySelector("form > #form-exit-button");
var markdoneAssignmentBackground = markdoneAssignmentForm.getElementsByTagName("div")[0];
var markdoneAssignmentNoButton = markdoneAssignmentForm.querySelector("form > #form-no-button");
var markdoneAssignmentYesButton = markdoneAssignmentForm.querySelector("form > #form-yes-button");

var editAssignmentButton = kanbanBoardTopbar.querySelector("#button > #edit-button");
var editAssignmentForm = document.getElementById("edit-assignment");
var editAssignmentSubmitButton = editAssignmentForm.querySelector("form > #form-submit-button");
var editAssignmentExitButton = editAssignmentForm.querySelector("form > #form-exit-button");
var editAssignmentBackground = editAssignmentForm.getElementsByTagName("div")[0];

var deleteAssignmentButton = kanbanBoardTopbar.querySelector("#button > #delete-button");
var deleteAssignmentForm = document.getElementById("delete-assignment");
var deleteAssignmentExitButton = deleteAssignmentForm.querySelector("form > #form-exit-button");
var deleteAssignmentBackground = deleteAssignmentForm.getElementsByTagName("div")[0];
var deleteAssignmentNoButton = deleteAssignmentForm.querySelector("form > #form-no-button");
var deleteAssignmentYesButton = deleteAssignmentForm.querySelector("form > #form-yes-button");

var taskForm = document.getElementById("add-task");
var taskSubmitButton = taskForm.querySelector("form > #form-submit-button");
var taskExitButton = taskForm.querySelector("form > #form-exit-button");
var taskBackground = taskForm.getElementsByTagName("div")[0];
var taskTemplate = document.querySelector("body > #task-template");

var deleteTaskForm = document.getElementById("delete-task");
var deleteTaskExitButton = deleteTaskForm.querySelector("form > #form-exit-button");
var deleteTaskBackground = deleteTaskForm.getElementsByTagName("div")[0];
var deleteTaskNoButton = deleteTaskForm.querySelector("form > #form-no-button");
var deleteTaskYesButton = deleteTaskForm.querySelector("form > #form-yes-button");

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
const DATE_MESSAGE = "Please fill in the date";
const DATE_MESSAGE_OLD = "Please provide the correct date format";
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

function dateValid(input) {
    if (input.value == "") {
        return showError(input, DATE_MESSAGE);
    } else {
        /*
        I have made my own date validation, but I just realise it's not need because
        type date already have self validation
        let date = input.value.split("/");
        if (date[0] == null || Number(date[0]) == NaN || date[0] >= 31 || date[0] <= 0) return showError(input, DATE_MESSAGE_OLD);
        if (date[1] == null || Number(date[1]) == NaN || date[1] >= 12 || date[1] <= 0) return showError(input, DATE_MESSAGE_OLD);
        if (date[2] == null || Number(date[2]) == NaN || date[2] <= 0) return showError(input, DATE_MESSAGE_OLD);
        if (date[3] != null) return showError(input, DATE_MESSAGE_OLD);
        */
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
    "date": dateValid,
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

function LoadSubjectListToAddAssignmentForm() {
    // hide or unhide the subject name input accored to the value inside subject select box value
    CheckAddAssignmentSubjectName();

    // clear all the options if there're any
    while (assignmentSelectBox.firstChild)
        assignmentSelectBox.removeChild(assignmentSelectBox.firstChild);
    
    // add empty option as the first option
    let emptyChoice = document.createElement("option");
    emptyChoice.innerText = "";
    emptyChoice.style.display = "none";
    assignmentSelectBox.appendChild(emptyChoice);

    // put the option inside select box
    let subjects = getSubjects();
    for (let key in subjects) {
        let subjectName = key;
        let subjectChoice = document.createElement("option");
        subjectChoice.innerText = subjectName;
        subjectChoice.value = subjectName;
        assignmentSelectBox.appendChild(subjectChoice);
    }

    // put the last object which is the create new choice
    let createNewChoice = document.createElement("option");
    createNewChoice.innerText = "-Create New-";
    createNewChoice.value = "new";
    assignmentSelectBox.appendChild(createNewChoice);
}
LoadSubjectListToAddAssignmentForm()

function LoadKanbanboardCanvas() {
    // check and get current assignment data
    let subjectName = getCurrentSubjectName();
    let currentAssignment = getCurrentAssignment();
    
    // if there any data then open the board, if not then open the add new page
    if (subjectName == null || currentAssignment == null) {
        kanbanBoard.style.display = "none";
        kanbanBoardAdd.style.display  = "flex";
        return;
    } else {
        kanbanBoard.style.display = "grid";
        kanbanBoardAdd.style.display = "none";
    }

    // change the topbar details
    kanbanBoardSubject.innerText = subjectName + " - ";
    kanbanBoardAssignment.innerText = currentAssignment.name;
    kanbanBoardDate.innerText = "DUE: " + currentAssignment.due;

    // clear every article of each kanban section
    todoExistedArticle = kanbanBoardTodo.getElementsByTagName("article");
    while (todoExistedArticle[0]) 
        todoExistedArticle[0].parentNode.removeChild(todoExistedArticle[0])
    
    progressExistedArticle = kanbanBoardProgress.getElementsByTagName("article");
    while (progressExistedArticle[0]) 
        progressExistedArticle[0].parentNode.removeChild(progressExistedArticle[0])

    doneExistedArticle = kanbanBoardDone.getElementsByTagName("article");
    while (doneExistedArticle[0]) 
        doneExistedArticle[0].parentNode.removeChild(doneExistedArticle[0])

    // Render all the task by loop thorugh every section and task then clone the template and fill data in then insert it to section
    for (let [section, taskArray] of Object.entries(currentAssignment.task)) {
        for (let i = 0; i < taskArray.length; i++) {
            // get the task info on task array
            let task = taskArray[i];

            // clone template and fill information in
            let newTask = taskTemplate.cloneNode(true);
            newTask.getElementsByTagName("h2")[0].innerText = task.name;
            newTask.getElementsByTagName("p")[0].innerText = "Due: " + task.due;
            newTask.getElementsByTagName("p")[1].innerText = task.goal*0.5 + " hours";
            newTask.getElementsByTagName("p")[2].innerText = task.description;
            newTask.getElementsByTagName("label")[0].innerText = task.progress + " / " + task.goal;
            newTask.getElementsByTagName("div")[1].getElementsByTagName("div")[0].style.width = Math.min((task.progress/task.goal)*100, 100) + "%";
            newTask.style.display = "grid";

            // add it to the parent accorded to the section
            if (section == "todo")
                kanbanBoardTodo.insertBefore(newTask, kanbanBoardTodoAddButton);
            else if (section == "progress")
                kanbanBoardProgress.insertBefore(newTask, kanbanBoardProgressAddButton);
            else
                kanbanBoardDone.insertBefore(newTask, kanbanBoardDoneAddButton);

            // add event to its edit button
            let editButton = newTask.getElementsByTagName("div")[0].getElementsByTagName("button")[1];
            editButton.addEventListener("click", function(event) {
                // clear all form input
                let ulElement = taskForm.getElementsByTagName("ul")[0];
                clearFormInput(ulElement);

                // change toggle variable
                sectionSelect = section;
                taskIndex = i;
                taskIsNew = false;

                /* when edit form, fill in all the input with the same data as the selected task to acknowledge the user */
                
                // Start by getting form input (except priority rate and task status)
                let taskName = taskForm.querySelector("input[name='name']");
                let dueDate = taskForm.querySelector("input[name='due']");
                let tomodoroGoal = taskForm.querySelector("input[name='goal']");
                let tomodoroCurrent = taskForm.querySelector("input[name='progress']");
                let taskDescription = taskForm.querySelector("textarea[name='description']");

                // change its inner text and value accorded to task existed data
                taskName.value = task.name;
                taskName.innerText = task.name;
                dueDate.value = task.due;
                dueDate.innerText = task.due;
                tomodoroGoal.value = task.goal; 
                tomodoroGoal.innerText = task.goal;
                tomodoroCurrent.value = task.progress;
                tomodoroCurrent.innerText = task.progress;
                taskDescription.value = task.description; 
                taskDescription.innerText = task.description;

                // change the priority rate and status radio button
                if (task.priority == 0)
                    taskForm.querySelector("#low").checked = true;
                else if (task.priority == 1)
                    taskForm.querySelector("#mid").checked = true;
                else
                    taskForm.querySelector("#high").checked = true;
                
                if (task.isDone)
                    taskForm.querySelector("#done").checked = true;
                else
                    taskForm.querySelector("#not-done").checked = true;

                // change the submit form button inner text
                taskForm.querySelector("#form-submit-button").innerText = "Change";

                taskForm.style.visibility = "visible";
            })

            // add event to its delete button
            let delButton = newTask.getElementsByTagName("div")[0].getElementsByTagName("button")[2];
            delButton.addEventListener("click", function(event) {
                deleteTaskForm.style.visibility = "visible";
                sectionSelect = section;
                taskIndex = i;
            })
        }
    }
}
LoadKanbanboardCanvas();

function LoadTreeAsideNavigation() {
    // clear all the existing tree by loop every element in tree then remove the last child until no child (research found that remove from last child will be more efficient than remove from first child)
    while (asideNavigationTree.firstChild) 
        asideNavigationTree.removeChild(asideNavigationTree.lastChild);
    
    // add list of subject by loop through all of the subjects
    let subjects = getSubjects();
    for (let [subjectName, value] of Object.entries(subjects)) {
        // create new subject and add it to the tree
        let newSubject = document.createElement("li");
        newSubject.id = subjectName;
        newSubject.innerText = subjectName;

        // create and unordered list to contains list of assignment
        let ulList = document.createElement("ul");
        newSubject.appendChild(ulList);

        // loop through its assignment and add it to the unordered list
        value.assignments.forEach(function(assignment) {
            let newAssignment = document.createElement("li");
            newAssignment.class = subjectName;
            newAssignment.id = assignment.name;
            newAssignment.innerText = assignment.name;
            newAssignment.setAttribute('tabindex', '0'); // make assignment accessible by blind ppl
            if (assignment.isDone) // if assignment is done, change the tab to green color
                newAssignment.style.color = "#96e6b3";
            ulList.appendChild(newAssignment);

            // when user click on it, it will change the kanban board
            newAssignment.addEventListener("click", function(event) {
                // update current assignment to the clicked assignment
                localStorage.setItem('current', subjectName + "&" + assignment.name);

                // Render the new update to the webpage
                LoadKanbanboardCanvas();
            })
        });

        // By adding the subject at last, is to make it render all of its child one time so it not consume too much memory
        asideNavigationTree.appendChild(newSubject);
    }
      
}
LoadTreeAsideNavigation();


/* 
function event

These function below is where the user interaction within the page happened
These function will perform vary depend on the button that pass the function
*/

/* Select Create new subject on add assignment form
When user select create new option, will add another line to the form
(by unhide it) that line will ask for subject name
*/
function CheckAddAssignmentSubjectName() {
    if (assignmentSelectBox.value == "new") {
        // show the subject name input
        let subjectNameListElement = assignmentForm.getElementsByTagName("li")[1];
        subjectNameListElement.style.display = "initial";

        // make the subject name as require to prevent blamk subject name
        let nameInput = subjectNameListElement.getElementsByTagName("input")[0];
        nameInput.required = true;
    } else {
        // hide the subject name input
        let subjectNameListElement = assignmentForm.getElementsByTagName("li")[1];
        subjectNameListElement.style.display  = "none";

        // make the subject name not require
        let nameInput = subjectNameListElement.getElementsByTagName("input")[0];
        nameInput.value = null;
        nameInput.innerText = "";
        nameInput.required = false;
    }
}

assignmentSelectBox.addEventListener("change", function(event) {
    CheckAddAssignmentSubjectName();
})

/* Add an assignment form
Every time user open the add assignment form, it will automatically hide
the subject name input and add the subject option on select subject box
By clicking on the dim background or exit button will hide the popup form away
Load the new information to local storage and render it to user
*/

// open form event
boardAddButton.addEventListener("click", function(event) {
    assignmentForm.style.visibility = "visible";
});

assignmentAddButton.addEventListener("click", function(event) {
    assignmentForm.style.visibility = "visible";
});

// close form event
assignmentBackground.addEventListener("click", function(event) {
    assignmentForm.style.visibility = "hidden";
});

assignmentExitButton.addEventListener("click", function(event) {
    assignmentForm.style.visibility = "hidden";
});

// sunmit form event
assignmentSubmitButton.addEventListener("click", function(event) {
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

/* Mark done an assignment 
When user mark an assingment, open the popup to ask if user really wish to
mark it done. If yes, then update the local storage, move every task to done
section and turn the navigation to green.
*/

// open form event
markdoneAssignmentButton.addEventListener("click", function(event) {
    markdoneAssignmentForm.style.visibility = "visible";
})

// close form event
markdoneAssignmentExitButton.addEventListener("click", function(event) {
    markdoneAssignmentForm.style.visibility = "hidden";
})

markdoneAssignmentBackground.addEventListener("click", function(event) {
    markdoneAssignmentForm.style.visibility = "hidden";
})

markdoneAssignmentNoButton.addEventListener("click", function(event) {
    markdoneAssignmentForm.style.visibility = "hidden";
})

// submit form event
markdoneAssignmentYesButton.addEventListener("click", function(event) {
    // update assignment status
    let assignment = getCurrentAssignment();
    assignment.isDone = true;

    // remove every task on other section except done to done section and change every task status to done and have full progress
    for (let [section, taskArray] of Object.entries(assignment.task)) {
        if (section == "done") continue;

        // loop through every task on the section start from last index
        for (let i = taskArray.length-1; i >= 0; i--) {
            // get the task info on task array
            let task = taskArray[i];

            // edit the task so its status is done and its progress is reach the goal
            task.progress = task.goal;
            task.isDone = true;

            // add the task to 'done' section
            assignment.task["done"].push(task);

            // remove the last element of task on current section
            taskArray.pop();
        }
    }

    updateAssignment(assignment);

    // render the new update to user (so it have green mark)
    LoadKanbanboardCanvas();
    LoadTreeAsideNavigation();

    markdoneAssignmentForm.style.visibility = "hidden";
})

/* Edit an assignment form
User able to edit the name and due date of the assignment by fill up
the form and it will change information inside it. When open up the form
all the form old data already filled in the input. To make user knew what
info they about to change
*/

// open form event
editAssignmentButton.addEventListener("click", function(event) {
    editAssignmentForm.style.visibility = "visible";

    // get current assignment information
    let currentSubject = getCurrentSubjectAndAssignmentName().split("&")[0];
    let currentAssignment = getCurrentAssignment();

    // Fill in the old data to the form
    let subjectName = editAssignmentForm.getElementsByTagName("input")[0];
    subjectName.value = currentSubject;
    subjectName.innerText = currentSubject;

    let assignmentName = editAssignmentForm.getElementsByTagName("input")[1];
    assignmentName.value = currentAssignment.name;
    assignmentName.innerText = currentAssignment.name;

    let dueDate = editAssignmentForm.getElementsByTagName("input")[2];
    dueDate.value = currentAssignment.due;
    dueDate.innerText = currentAssignment.due;
});

// close form event
editAssignmentBackground.addEventListener("click", function(event) {
    editAssignmentForm.style.visibility = "hidden";
});

editAssignmentExitButton.addEventListener("click", function(event) {
    editAssignmentForm.style.visibility = "hidden";
});

// submit form event
editAssignmentSubmitButton.addEventListener("click", function(event) {
    event.preventDefault();

    // check if form is valid
    let ulElement = editAssignmentForm.getElementsByTagName("ul")[0];
    let isValidForm = validateForm(ulElement)
    if (!isValidForm)
        return;

    // Start by getting form value
    let assignmentName = editAssignmentForm.getElementsByTagName("input")[1].value;
    let dueDate = editAssignmentForm.getElementsByTagName("input")[2].value;

    // update assignment new data
    let assignment = getCurrentAssignment();
    assignment.name = assignmentName;
    assignment.due = dueDate;
    updateAssignment(assignment);

    // clear all the user input
    clearFormInput(ulElement);

    // Render the new update to the webpage
    LoadKanbanboardCanvas();
    LoadTreeAsideNavigation();

    // close the form
    editAssignmentForm.style.visibility = "hidden";
})

/* Delete an assignment 
When user mark an assingment, open the popup to ask if user really wish to
mark it done. If yes, then update the local storage, move every task to done
section and turn the navigation to green.
*/

// open form event
deleteAssignmentButton.addEventListener("click", function(event) {
    deleteAssignmentForm.style.visibility = "visible";
})

// close form event
deleteAssignmentExitButton.addEventListener("click", function(event) {
    deleteAssignmentForm.style.visibility = "hidden";
})

deleteAssignmentBackground.addEventListener("click", function(event) {
    deleteAssignmentForm.style.visibility = "hidden";
})

deleteAssignmentNoButton.addEventListener("click", function(event) {
    deleteAssignmentForm.style.visibility = "hidden";
})

// submit form event
deleteAssignmentYesButton.addEventListener("click", function(event) {
    // get the current assignment and subject name
    let list = getCurrentSubjectAndAssignmentName().split("&");
    let subjectName = list[0];
    let assignmentName = list[1];

    let subjectData = getSubjects();

    // loop through every assignment to see if the name is match the current assignment
    for (let i = 0; i < subjectData[subjectName].assignments.length; i++) {
        if (subjectData[subjectName].assignments[i].name == assignmentName) {
            // set the assignment to new assignment
            subjectData[subjectName].assignments.splice(i, 1);
        }
    }

    // delete the whole subject if there are no assignment left
    if (subjectData[subjectName].assignments.length == 0)
        delete subjectData[subjectName];

    // reset current assignment to default value
    localStorage.setItem('current', "");

    // automatically change current assignment to first of the subject list and assignment (I using loop here because I don't know how to get first element of dictionary)
    let firstSubject = Object.keys(subjectData)[0];
    let firstAssignment;
    if (firstSubject != null)
        firstAssignment = subjectData[firstSubject].assignments[0];

    // update current assignment if found first assignment (in case no assignment found, we already set current to empty string to prevent error)
    if (firstAssignment != null)
        localStorage.setItem('current', firstSubject + "&" + firstAssignment.name);

    // update new subjects data to local storage
    subjectData = JSON.stringify(subjectData);
    localStorage.setItem('subjects', subjectData);

    // render the new update to user
    LoadSubjectListToAddAssignmentForm();
    LoadKanbanboardCanvas();
    LoadTreeAsideNavigation();

    deleteAssignmentForm.style.visibility = "hidden";
})

/* Task 
sectionSelect:
The variable section select will determined which section have been pick
This allow all the button to use the same function even in a bit of diferent behaviour

taskIndex:
The variable task index determined which task on the section list will get editted

taskIsNew:
Since add new task and editted task will used the same form (so it did not
need to create the new form that used similar input). We used variable to
toggle if the form is add form function or edit form function
*/
var sectionSelect = "";
var taskIndex = 0;
var taskIsNew = true;

/* Add task form
You can add task in any section on kanbad board, but each section will have
different behaviour. For example:
To-do: The form will suggest you have 0 current tomodoro count
In progress: you can change anything on the form
Done: Any task fall on this category will check status as done and filled the progress bar
*/

// open form event
kanbanBoardTodoAddButton.addEventListener("click", function(event) {
    // clear all form input
    let ulElement = taskForm.getElementsByTagName("ul")[0];
    clearFormInput(ulElement);

    // change toggle variable
    sectionSelect = "todo";
    taskIsNew = true;

    // change the submit form button inner text
    taskForm.querySelector("#form-submit-button").innerText = "Create";

    // make current pomodoro 0
    let currentInput = ulElement.getElementsByTagName("input")[3];
    currentInput.value = 0;
    currentInput.innerText = 0;

    // make status automatically to not done
    let statusInput = ulElement.getElementsByTagName("input")[7];
    statusInput.checked = true;

    // make form visible
    taskForm.style.visibility = "visible";
});

kanbanBoardProgressAddButton.addEventListener("click", function(event) {
    // clear all form input
    let ulElement = taskForm.getElementsByTagName("ul")[0];
    clearFormInput(ulElement);

    // change toggle variable
    sectionSelect = "progress";
    taskIsNew = true;

    // change the submit form button inner text
    taskForm.querySelector("#form-submit-button").innerText = "Create";

    // make status automatically to not done
    let statusInput = ulElement.getElementsByTagName("input")[7];
    statusInput.checked = true;

    // make form visible
    taskForm.style.visibility = "visible";
});

kanbanBoardDoneAddButton.addEventListener("click", function(event) {
    // clear all form input
    let ulElement = taskForm.getElementsByTagName("ul")[0];
    clearFormInput(ulElement);

    // change toggle variable
    sectionSelect = "done";
    taskIsNew = true;

    // change the submit form button inner text
    taskForm.querySelector("#form-submit-button").innerText = "Create";

    // make status automatically to done
    let statusInput = ulElement.getElementsByTagName("input")[8];
    statusInput.checked = true;

    // make form visible
    taskForm.style.visibility = "visible";
});

// close form event
taskBackground.addEventListener("click", function(event) {
    taskForm.style.visibility = "hidden";
});

taskExitButton.addEventListener("click", function(event) {
    taskForm.style.visibility = "hidden";
});

// submit form event
taskSubmitButton.addEventListener("click", function(event) {
    event.preventDefault();

    // check if form is valid
    let ulElement = taskForm.getElementsByTagName("ul")[0];
    let isValidForm = validateForm(ulElement)
    if (!isValidForm)
        return;

    // Start by getting form value
    let taskName = taskForm.querySelector("input[name='name']").value;
    let dueDate = taskForm.querySelector("input[name='due']").value;
    let tomodoroGoal = taskForm.querySelector("input[name='goal']").value;
    let tomodoroCurrent = taskForm.querySelector("input[name='progress']").value;
    let priorityRate = taskForm.querySelector("input[name='priority']:checked").value;
    let taskStatus = taskForm.querySelector("input[name='status']:checked").value;
    let taskDescription = taskForm.querySelector("textarea[name='description']").value;

    // this variable will used when edit task because we need to remove the old task
    let oldSectionSelect = sectionSelect;

    // edge case if tomodoro current have more than goal
    if (tomodoroCurrent > tomodoroGoal)
        tomodoroCurrent = tomodoroGoal;

    // when add new task or editted task, some condition is changed a bit
    if (taskIsNew) {
        // if the form got submit by 'done' section, change status to done, and current tomodoro to goal tomodoro
        if (sectionSelect == "done" || taskStatus == "true") {
            sectionSelect = "done";
            taskStatus = true;
            tomodoroCurrent = tomodoroGoal;
        }
    } else {
        // if the form status is done, change status to done, and current tomodoro to goal tomodoro and move task to done section
        if (taskStatus == "true") {
            sectionSelect = "done";
            taskStatus = true;
            tomodoroCurrent = tomodoroGoal;
        }

        // if the task was done before and got check to not done then move task to in progress section
        if (sectionSelect == "done" && taskStatus == "false")
            sectionSelect = "progress";

        // if the tomodoro count changed where the current did not reach the goal, move task to in progress section and change it to not done
        if (sectionSelect == "done" && tomodoroCurrent < tomodoroGoal) {
            sectionSelect = "progress";
            taskStatus = false;
        }
    }

    // Make a JS object to contain the task data we want to write into local storage for each item.
    let newTask = {
        "name": taskName,
        "due": dueDate,
        "goal": tomodoroGoal,
        "progress": tomodoroCurrent,
        "priority": priorityRate,
        "isDone": taskStatus,
        "description": taskDescription
    }

    // get the current assignment then modify it by add new task, if the task is editted then remove the existed task then add new task
    let assignment = getCurrentAssignment();

    if (!taskIsNew)
        assignment.task[oldSectionSelect].splice(taskIndex, 1);

    assignment.task[sectionSelect].push(newTask);

    // if the assignment got added on somewhere else except done then make the assignment not done
    if (sectionSelect != "done")
        assignment.isDone = false;

    // update it to local storage
    updateAssignment(assignment);

    // Render the new update to the webpage
    LoadKanbanboardCanvas();
    LoadTreeAsideNavigation();

    // close the form
    taskForm.style.visibility = "hidden";
})

/* Delete a task
The task delete button are add dynamically, where the yes button acts as
submit button and variable 'sectionSelect' and 'taskIndex' have been change
accorded to each exit button to provide different functionally when the user
confirm to delete the task
*/

// close form event
deleteTaskExitButton.addEventListener("click", function(event) {
    deleteTaskForm.style.visibility = "hidden";
})

deleteTaskBackground.addEventListener("click", function(event) {
    deleteTaskForm.style.visibility = "hidden";
})

deleteTaskNoButton.addEventListener("click", function(event) {
    deleteTaskForm.style.visibility = "hidden";
})

// submit form event
deleteTaskYesButton.addEventListener("click", function(event) {
    // get the current assignment data
    let assignment = getCurrentAssignment();

    // delete a task out of specific position
    assignment.task[sectionSelect].splice(taskIndex, 1);

    // update new subjects data to local storage
    updateAssignment(assignment);

    // render the new update to user
    LoadKanbanboardCanvas();

    deleteTaskForm.style.visibility = "hidden";
})