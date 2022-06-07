/*
Local Storage

Get data from local storage using getter function then pass information
to global variable
*/ function getTomato() {
    let tomato1 = localStorage.getItem("tomato");
    if (tomato1 == null) return 0;
    tomato1 = JSON.parse(tomato1);
    return tomato1;
}
function getSubjects() {
    let subjects1 = localStorage.getItem("subjects");
    if (subjects1 == null) return [];
    subjects1 = JSON.parse(subjects1);
    return subjects1;
}
/*
Global variable

The reason I use only 1 JavaScript file because the variable such as tomato
and subjects will use across the whole page.
*/ var tomato = getTomato();
var subjects = getSubjects();
/*
Task page
*/ // variable
var assignmentAddButton = document.querySelector("#Task-List > aside > button");
var assignmentForm = document.getElementById("add-assignment");
var assignmentExitButton = assignmentForm.querySelector("form > #form-exit-button");
var assignmentBackground = assignmentForm.getElementsByTagName("div")[0];
var assignmentSelectBox = assignmentForm.getElementsByTagName("select")[0];
// function startup
/* 
Once load in the page, put element to html, the function name told the
exact meaning on what the function do
*/ function LoadSubjectListToAddAssignmentForm() {
    // hide or unhide the subject name input accored to the value inside subject select box value
    CheckAddAssignmentSubjectName();
    // put the option inside select box
    subjects.forEach(function(subject) {
        let subjectChoice = document.createElement("option");
        subjectChoice.innerText = subject.subjectName;
        subjectChoice.value = subject.subjectName;
        assignmentSelectBox.appendChild(subjectChoice);
    });
    // put the last object which is the create new choice
    let createNewChoice = document.createElement("option");
    createNewChoice.innerText = "-Create New-";
    createNewChoice.value = "new";
    assignmentSelectBox.appendChild(createNewChoice);
}
LoadSubjectListToAddAssignmentForm();
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
        nameInput.required = false;
    }
}
assignmentSelectBox.addEventListener("change", function(event) {
    CheckAddAssignmentSubjectName();
});
/* Open an add assignment form
Every time user open the add assignment form, it will automatically hide
the subject name input and add the subject option on select subject box
*/ assignmentAddButton.addEventListener("click", function(event) {
    assignmentForm.style.display = "block";
});
/* Close an add assignment form
By clicking on the dim background or exit button will hide the popup form away
*/ assignmentBackground.addEventListener("click", function(event) {
    assignmentForm.style.display = "none";
});
assignmentExitButton.addEventListener("click", function(event) {
    assignmentForm.style.display = "none";
}); /* Submit an assignment form
Load the new information to local storage and render it to user
*/ 

//# sourceMappingURL=taskOld.add4ad43.js.map
