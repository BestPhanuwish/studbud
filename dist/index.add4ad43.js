/*
Local Storage

Get data from local storage using getter function then pass information
to global variable
*/ function getTomato() {
    let tomato = localStorage.getItem("tomato");
    if (tomato == null) return 0;
    tomato = JSON.parse(tomato);
    return tomato;
}
function getSubjects() {
    let subjects = localStorage.getItem("subjects");
    if (subjects == null) return {};
    subjects = JSON.parse(subjects);
    return subjects;
}
function getCurrentSubjectAndAssignmentName() {
    let sa = localStorage.getItem("current");
    if (sa == null) return "&";
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
    if (subjectData[subjectName] == null) return null;
    // loop through every assignment to see if the name is match the current assignment
    let currentAssignment;
    subjectData[subjectName].assignments.forEach(function(assignment) {
        if (assignment.name == assignmentName) currentAssignment = assignment;
    });
    return currentAssignment;
}
function updateAssignment(newAssignment, subjectName, assignmentName) {
    if (subjectName == null || assignmentName == null) {
        let list = getCurrentSubjectAndAssignmentName().split("&");
        subjectName = list[0];
        assignmentName = list[1];
    }
    let subjectData = getSubjects();
    // edge case prevent
    if (subjectData[subjectName] == null) return;
    // loop through every assignment to see if the name is match the current assignment
    for(let i = 0; i < subjectData[subjectName].assignments.length; i++)if (subjectData[subjectName].assignments[i].name == assignmentName) // set the assignment to new assignment
    subjectData[subjectName].assignments[i] = newAssignment;
    // update current assignment name (in case, if this function pass by edit assignment function)
    localStorage.setItem('current', subjectName + "&" + newAssignment.name);
    // Local storage can only store strings, while we want to store a dictionary. To get around this, we use JSON.stringify (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
    subjectData = JSON.stringify(subjectData);
    // And finally we write the JSON string into local storage.
    localStorage.setItem('subjects', subjectData);
}
/*
Task page
*/ // variable
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
var kanbanBoardProgress = document.getElementById("board-kanban-progress");
var kanbanBoardDone = document.getElementById("board-kanban-done");
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
// function form-validation
/* 
On every list in the form will contains small tags that will fill in
later on when the form is invalid (such as when user leave empty space)
By making custom form validation will help making overall UI looks appealing
to the website instead of default form validation
*/ const NORMAL_MESSAGE = "Please fill in the space above";
const SELECT_MESSAGE = "Please select the option above";
const DATE_MESSAGE = "Please fill in the date";
const DATE_MESSAGE_OLD = "Please provide the correct date format";
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
    if (input.value == "") return showError(input, NORMAL_MESSAGE);
    else return showSuccess(input);
}
function selectValid(input) {
    if (input.value == "") return showError(input, SELECT_MESSAGE);
    else return showSuccess(input);
}
function dateValid(input) {
    if (input.value == "") return showError(input, DATE_MESSAGE);
    else /*
        I have made my own date validation, but I just realise it's not need because
        type date already have self validation
        let date = input.value.split("/");
        if (date[0] == null || Number(date[0]) == NaN || date[0] >= 31 || date[0] <= 0) return showError(input, DATE_MESSAGE_OLD);
        if (date[1] == null || Number(date[1]) == NaN || date[1] >= 12 || date[1] <= 0) return showError(input, DATE_MESSAGE_OLD);
        if (date[2] == null || Number(date[2]) == NaN || date[2] <= 0) return showError(input, DATE_MESSAGE_OLD);
        if (date[3] != null) return showError(input, DATE_MESSAGE_OLD);
        */ return showSuccess(input);
}
const InputValid = {
    "text": textValid,
    "select": selectValid,
    "date": dateValid
};
function validateForm(ulForm) {
    let isValidForm = true;
    let inputList = ulForm.getElementsByTagName("li");
    for(let i = 0; i < inputList.length; i++){
        let list = inputList[i];
        let input = list.getElementsByTagName("input")[0];
        if (input == null) input = list.getElementsByTagName("select")[0];
        if (input == null) continue;
        let inputIsRequired = input.required;
        if (inputIsRequired) {
            let inputType = input.type;
            if (input.tagName != "SELECT") {
                let checker_function = InputValid[inputType];
                let is_valid = checker_function(input);
                if (!is_valid) isValidForm = false;
            } else {
                let checker_function = InputValid["select"];
                let is_valid = checker_function(input);
                if (!is_valid) isValidForm = false;
            }
        }
    }
    if (isValidForm) return true;
    return false;
}
function clearFormInput(ulForm) {
    let inputList = ulForm.getElementsByTagName("li");
    for(let i = 0; i < inputList.length; i++){
        let list = inputList[i];
        let input = list.getElementsByTagName("input")[0];
        if (input == null) input = list.getElementsByTagName("select")[0];
        if (input == null) continue;
        if (input.tagName == "SELECT") input.selectedIndex = 0;
        else {
            input.value = "";
            input.innerText = "";
        }
    }
}
// function startup
/* 
Once load in the page, put element to html, the function name told the
exact meaning on what the function do. These function can also used
inside event function to render new data to the page. Since it also clear
information inside any DOM element tag.
*/ function LoadSubjectListToAddAssignmentForm() {
    // hide or unhide the subject name input accored to the value inside subject select box value
    CheckAddAssignmentSubjectName();
    // clear all the options if there're any
    while(assignmentSelectBox.firstChild)assignmentSelectBox.removeChild(assignmentSelectBox.firstChild);
    // add empty option as the first option
    let emptyChoice = document.createElement("option");
    emptyChoice.innerText = "";
    emptyChoice.style.display = "none";
    assignmentSelectBox.appendChild(emptyChoice);
    // put the option inside select box
    let subjects = getSubjects();
    for(let key in subjects){
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
LoadSubjectListToAddAssignmentForm();
function LoadKanbanboardCanvas() {
    // check and get current assignment data
    let subjectName = getCurrentSubjectName();
    let currentAssignment = getCurrentAssignment();
    // if there any data then open the board, if not then open the add new page
    if (subjectName == null || currentAssignment == null) {
        kanbanBoard.style.display = "none";
        kanbanBoardAdd.style.display = "flex";
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
    while(todoExistedArticle[0])todoExistedArticle[0].parentNode.removeChild(todoExistedArticle[0]);
    progressExistedArticle = kanbanBoardProgress.getElementsByTagName("article");
    while(progressExistedArticle[0])progressExistedArticle[0].parentNode.removeChild(progressExistedArticle[0]);
    doneExistedArticle = kanbanBoardDone.getElementsByTagName("article");
    while(doneExistedArticle[0])doneExistedArticle[0].parentNode.removeChild(doneExistedArticle[0]);
}
LoadKanbanboardCanvas();
function LoadTreeAsideNavigation() {
    // clear all the existing tree by loop every element in tree then remove the last child until no child (research found that remove from last child will be more efficient than remove from first child)
    while(asideNavigationTree.firstChild)asideNavigationTree.removeChild(asideNavigationTree.lastChild);
    // add list of subject by loop through all of the subjects
    let subjects = getSubjects();
    for (let [subjectName, value] of Object.entries(subjects)){
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
            if (assignment.isDone) newAssignment.style.color = "#96e6b3";
            ulList.appendChild(newAssignment);
            // when user click on it, it will change the kanban board
            newAssignment.addEventListener("click", function(event) {
                // update current assignment to the clicked assignment
                localStorage.setItem('current', subjectName + "&" + assignment.name);
                // Render the new update to the webpage
                LoadKanbanboardCanvas();
            });
        });
        // By adding the subject at last, is to make it render all of its child one time so it not consume too much memory
        asideNavigationTree.appendChild(newSubject);
    }
}
LoadTreeAsideNavigation();
// function event
/* Select Create new subject on add assignment form
When user select create new option, will add another line to the form
(by unhide it) that line will ask for subject name
*/ function CheckAddAssignmentSubjectName() {
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
        subjectNameListElement.style.display = "none";
        // make the subject name not require
        let nameInput = subjectNameListElement.getElementsByTagName("input")[0];
        nameInput.value = null;
        nameInput.innerText = "";
        nameInput.required = false;
    }
}
assignmentSelectBox.addEventListener("change", function(event) {
    CheckAddAssignmentSubjectName();
});
/* Add an assignment form
Every time user open the add assignment form, it will automatically hide
the subject name input and add the subject option on select subject box
By clicking on the dim background or exit button will hide the popup form away
Load the new information to local storage and render it to user
*/ boardAddButton.addEventListener("click", function(event) {
    assignmentForm.style.visibility = "visible";
});
assignmentAddButton.addEventListener("click", function(event) {
    assignmentForm.style.visibility = "visible";
});
assignmentBackground.addEventListener("click", function(event) {
    assignmentForm.style.visibility = "hidden";
});
assignmentExitButton.addEventListener("click", function(event) {
    assignmentForm.style.visibility = "hidden";
});
assignmentSubmitButton.addEventListener("click", function(event) {
    event.preventDefault();
    // check if form is valid
    let ulElement = assignmentForm.getElementsByTagName("ul")[0];
    let isValidForm = validateForm(ulElement);
    if (!isValidForm) return;
    // Start by getting form value
    let subjectName = assignmentSelectBox.value;
    if (subjectName == "new") subjectName = assignmentForm.getElementsByTagName("input")[0].value;
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
    };
    // check if it's the new subject or existed subject
    let subjects = getSubjects();
    if (subjects[subjectName] == null) {
        let newSubject = {
            "assignments": [
                newAssignment
            ],
            "contents": []
        };
        subjects[subjectName] = newSubject;
    } else subjects[subjectName].assignments.push(newAssignment);
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
});
/* Mark done an assignment 
When user mark an assingment, open the popup to ask if user really wish to
mark it done. If yes, then update the local storage, move every task to done
section and turn the navigation to green.
*/ markdoneAssignmentButton.addEventListener("click", function(event) {
    markdoneAssignmentForm.style.visibility = "visible";
});
markdoneAssignmentExitButton.addEventListener("click", function(event) {
    markdoneAssignmentForm.style.visibility = "hidden";
});
markdoneAssignmentBackground.addEventListener("click", function(event) {
    markdoneAssignmentForm.style.visibility = "hidden";
});
markdoneAssignmentNoButton.addEventListener("click", function(event) {
    markdoneAssignmentForm.style.visibility = "hidden";
});
markdoneAssignmentYesButton.addEventListener("click", function(event) {
    // update assignment status
    let assignment = getCurrentAssignment();
    assignment.isDone = true;
    updateAssignment(assignment);
    // render the new update to user (so it have green mark)
    LoadTreeAsideNavigation();
    markdoneAssignmentForm.style.visibility = "hidden";
});
/* Edit an assignment form
User able to edit the name and due date of the assignment by fill up
the form and it will change information inside it. When open up the form
all the form old data already filled in the input. To make user knew what
info they about to change
*/ editAssignmentButton.addEventListener("click", function(event) {
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
editAssignmentBackground.addEventListener("click", function(event) {
    editAssignmentForm.style.visibility = "hidden";
});
editAssignmentExitButton.addEventListener("click", function(event) {
    editAssignmentForm.style.visibility = "hidden";
});
editAssignmentSubmitButton.addEventListener("click", function(event) {
    event.preventDefault();
    // check if form is valid
    let ulElement = editAssignmentForm.getElementsByTagName("ul")[0];
    let isValidForm = validateForm(ulElement);
    if (!isValidForm) return;
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
});
/* Delete an assignment 
When user mark an assingment, open the popup to ask if user really wish to
mark it done. If yes, then update the local storage, move every task to done
section and turn the navigation to green.
*/ deleteAssignmentButton.addEventListener("click", function(event) {
    deleteAssignmentForm.style.visibility = "visible";
});
deleteAssignmentExitButton.addEventListener("click", function(event) {
    deleteAssignmentForm.style.visibility = "hidden";
});
deleteAssignmentBackground.addEventListener("click", function(event) {
    deleteAssignmentForm.style.visibility = "hidden";
});
deleteAssignmentNoButton.addEventListener("click", function(event) {
    deleteAssignmentForm.style.visibility = "hidden";
});
deleteAssignmentYesButton.addEventListener("click", function(event) {
    // get the current assignment and subject name
    let list = getCurrentSubjectAndAssignmentName().split("&");
    let subjectName = list[0];
    let assignmentName = list[1];
    let subjectData = getSubjects();
    // loop through every assignment to see if the name is match the current assignment
    for(let i = 0; i < subjectData[subjectName].assignments.length; i++)if (subjectData[subjectName].assignments[i].name == assignmentName) // set the assignment to new assignment
    subjectData[subjectName].assignments.splice(i, 1);
    // delete the whole subject if there are no assignment left
    if (subjectData[subjectName].assignments.length == 0) delete subjectData[subjectName];
    // reset current assignment to default value
    localStorage.setItem('current', "");
    // automatically change current assignment to first of the subject list and assignment (I using loop here because I don't know how to get first element of dictionary)
    let firstSubject = Object.keys(subjectData)[0];
    let firstAssignment;
    if (firstSubject != null) firstAssignment = subjectData[firstSubject].assignments[0];
    // update current assignment if found first assignment (in case no assignment found, we already set current to empty string to prevent error)
    if (firstAssignment != null) localStorage.setItem('current', firstSubject + "&" + firstAssignment.name);
    // update new subjects data to local storage
    subjectData = JSON.stringify(subjectData);
    localStorage.setItem('subjects', subjectData);
    // render the new update to user
    LoadSubjectListToAddAssignmentForm();
    LoadKanbanboardCanvas();
    LoadTreeAsideNavigation();
    deleteAssignmentForm.style.visibility = "hidden";
});

//# sourceMappingURL=index.add4ad43.js.map
