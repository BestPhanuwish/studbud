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
Content page

Below are script that will accociated with content page only
*/

/* variable */

// DOM
var asideTreeList = document.getElementById("content-selector");
var mainContent = document.querySelector("#Content-List > main-content");
var subjectSectionTemplate = document.querySelector("body > section.content-template");
var contentNoteTemplate = document.querySelector("body > article.content-template");

var contentForm = document.getElementById("add-content");
var contentSubmitButton = contentForm.querySelector("form > #form-submit-button");
var contentExitButton = contentForm.querySelector("form > #form-exit-button");
var contentBackground = contentForm.getElementsByTagName("div")[0];
var contentAddLinkButton = contentForm.querySelector(".link-add-button");

var contentDeleteForm = document.getElementById("delete-content");
var contentDeleteExitButton = contentDeleteForm.querySelector("form > #form-exit-button");
var contentDeleteBackground = contentDeleteForm.getElementsByTagName("div")[0];
var contentDeleteNoButton = contentDeleteForm.querySelector("form > #form-no-button");
var contentDeleteYesButton = contentDeleteForm.querySelector("form > #form-yes-button");

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

function clearFormContent(assignmentName) {
    // clear all the input
    let ulElement = contentForm.getElementsByTagName("ul")[0];
    clearFormInput(ulElement);

    // remove all the link list
    let listOfLink = ulElement.querySelectorAll("li.form-link-list:not(#link-template)")
    listOfLink.forEach(function(list) {
        ulElement.removeChild(list);
    })

    // set the subject name input
    ulElement.getElementsByTagName("option")[0].innerText = selectedSubject;

    // clear all the assignment options if there're any
    let assignmentSelectBox = ulElement.getElementsByTagName("select")[1];
    while (assignmentSelectBox.firstChild)
        assignmentSelectBox.removeChild(assignmentSelectBox.lastChild);
    
    // add empty option as the first option (if it's new content)
    let firstChoice = document.createElement("option");
    if (contentIsNew) {
        firstChoice.innerText = "";
        firstChoice.style.display = "none";
    } else {
        firstChoice.innerText = assignmentName;
        firstChoice.value = assignmentName;
    }
    assignmentSelectBox.appendChild(firstChoice);

    // put the option inside select box
    let subjects = getSubjects();
    subjects[selectedSubject].assignments.forEach(function(assignment) {
        if (assignmentName == assignment.name) return; // not include the already existed assignment in select box
        let name = assignment.name;
        let choice = document.createElement("option");
        choice.innerText = name;
        choice.value = name;
        assignmentSelectBox.appendChild(choice);
    })
}

/* 
function startup

Content page have only one big Load start up function. It will load in the
aside navigation tree, and each subject section with content dynamically.
The add, edit, and delete content (which is a big function) also specify here
because, all the button have been add dynamically so we need to gave all
the button event function.
*/

function LoadContent() {
    // clear all the existing aside tree by loop every element in tree then remove the last child until no child
    while (asideTreeList.firstChild) 
        asideTreeList.removeChild(asideTreeList.lastChild);

    // clear all the existing section content by loop every element in the main content then remove the last child until no child
    while (mainContent.firstChild) 
        mainContent.removeChild(mainContent.lastChild);

    // loop through all the subjects
    let subjects = getSubjects();
    for (let [subjectName, value] of Object.entries(subjects)) {
        // clone the section and add subject information in it
        let newSection = subjectSectionTemplate.cloneNode(true);
        // make section visible (before it was display: none)
        newSection.removeAttribute("class");
        newSection.style.display = "initial";
        // set section id so the link able to go to selected section
        newSection.id = subjectName;
        // put on the subject name
        newSection.querySelector("section-topbar > h1").innerText = subjectName;

        // the button on section will open add content form event
        let addContentButton = newSection.getElementsByTagName("button")[0];
        addContentButton.addEventListener("click", function(event) {
            openAddContentForm(subjectName);
        })

        // loop through all the content, fill information, and add it to the section
        let contentArray = value.contents;
        for (let i = 0; i < contentArray.length; i++) {
            // get the content info on content array
            let content = contentArray[i];

            // clone template and fill information in
            let newContent = contentNoteTemplate.cloneNode(true);
            newContent.getElementsByTagName("h2")[0].innerText = content.name;
            newContent.getElementsByTagName("p")[0].innerText = content.assignment;
            newContent.getElementsByTagName("p")[1].innerText = content.description;

            // add all the link that accociated with content
            let ulLink = newContent.getElementsByTagName("ul")[0]; // get the list container
            let linkTemplate = ulLink.getElementsByTagName("li")[0]; // get the template
            // loop through all the link and clone it and add information in it
            content.links.forEach(function(link) {
                let newLink = linkTemplate.cloneNode(true);
                let newLinkaTag = newLink.getElementsByTagName("a")[0];
                newLinkaTag.href = link;
                newLinkaTag.innerText = link;
                ulLink.appendChild(newLink);
            });
            ulLink.removeChild(linkTemplate) // remove the template list

            // style content note
            newContent.style.display = "grid";

            // add edit content event to edit button
            let editButton = newContent.getElementsByTagName("div")[0].getElementsByTagName("button")[0];
            editButton.addEventListener("click", function(event) {
                openEditContentForm(subjectName, i, content);
            })

            // add delete content event to delete button
            let delButton = newContent.getElementsByTagName("div")[0].getElementsByTagName("button")[1];
            delButton.addEventListener("click", function(event) {
                openDeleteContentForm(subjectName, i);
            })

            // add new content note to the section
            let sectionContent = newSection.getElementsByTagName("section-content")[0];
            sectionContent.appendChild(newContent);
        }

        // in the end, add the new section to the main content (so it render all the information to user together)
        mainContent.appendChild(newSection);

        // at last, add the subject link aside navigation that will link to each subject section (the reason I add it last because these link need section to be existed first before we can link it)
        let newNavList = document.createElement("li");
        let newNavLink = document.createElement("a");
        newNavLink.href = "#" + subjectName;
        newNavLink.innerText = subjectName;
        newNavList.appendChild(newNavLink);
        asideTreeList.appendChild(newNavList);
    }
}
LoadContent();


/* 
function event

These function below is where the user interaction within the page happened
These function will perform vary depend on the button that pass the function
*/


/* Content Form Link
When the user add link to the form, it will clone the link list template
to the form which contain the link and delete link button to the form.
*/

// create a new line of link to the form
function addLink(input) {
    // clone link template and fill information in it if existed
    let ulElement = contentForm.getElementsByTagName("ul")[0]; // get the list container
    let linkTemplate = document.getElementById("link-template"); // get the template
    let newList = linkTemplate.cloneNode(true); // clone template
    newList.removeAttribute("id"); // adjust its frame value
    newList.style.display = "flex";
    let link = newList.getElementsByTagName("a")[0];
    link.href = input; // add link value
    link.innerText = input;

    // add delete link event
    newList.getElementsByTagName("button")[0].addEventListener("click", function(event) {
        ulElement.removeChild(newList);
    })

    // add new link list and render to user to see
    ulElement.appendChild(newList);
}

contentAddLinkButton.addEventListener("click", function(event) {
    event.preventDefault();
    let input = contentForm.querySelector("input[name='link']");
    if (input.value == "") return;

    addLink(input.value);

    // clear link input
    input.value = "";
    input.innerText = "";
})


/* Content Note
selectSubject:
The variable selectSubject will determined which subject have been pick
so when add note or edit note, it will go to that subject category

contentIndex:
The variable content index determined which content on the array will get
editted, so it will put it back at the same position

contentIsNew:
Since add new content and editted content will used the same form (so it did not
need to create the new form that used similar input). We used variable to
toggle if the form is add form function or edit form function
*/
var selectedSubject = "";
var contentIndex = 0;
var contentIsNew = true;

/* Add & Edit a content
You can new content on the button aside of each subject section. The button
that will used to open form are add dynamically on LoadContent() function.
*/

// open add content form event (only function)
function openAddContentForm(sentFromSubject) {
    // change the subject accorded to subject section that clicked the button
    selectedSubject = sentFromSubject;
    contentIsNew = true;

    clearFormContent();

    // change the submit form button inner text
    contentForm.querySelector("#form-submit-button").innerText = "Create";

    // open form
    contentForm.style.visibility = "visible";
}

// open edit content form event (only function)
function openEditContentForm(sentFromSubject, sentFromContentIndex, contentInfo) {
    // change the subject accorded to subject section and content index that clicked the button
    selectedSubject = sentFromSubject;
    contentIndex = sentFromContentIndex;
    contentIsNew = false;

    // clear all the input
    clearFormContent(contentInfo.assignment);

    // Start by getting form input (except priority rate and task status)
    let name = contentForm.querySelector("input[name='name']");
    let description = contentForm.querySelector("textarea[name='description']");

    // change its inner text and value accorded to task existed data
    name.value = contentInfo.name;
    name.innerText = contentInfo.name;
    description.value = contentInfo.description; 
    description.innerText = contentInfo.description;

    // loop through info and create a link list
    contentInfo.links.forEach(function(link) {
        addLink(link);
    })

    // change the submit form button inner text
    contentForm.querySelector("#form-submit-button").innerText = "Change";

    // open form
    contentForm.style.visibility = "visible";
}

// close form event
contentBackground.addEventListener("click", function(event) {
    contentForm.style.visibility = "hidden";
});

contentExitButton.addEventListener("click", function(event) {
    contentForm.style.visibility = "hidden";
});

// submit form event
contentSubmitButton.addEventListener("click", function(event) {
    event.preventDefault();

    // check if form is valid
    let ulElement = contentForm.getElementsByTagName("ul")[0];
    let isValidForm = validateForm(ulElement)
    if (!isValidForm)
        return;

    // Start by getting form value
    let assignment = contentForm.querySelector("select[name='assignment']").value;
    let name = contentForm.querySelector("input[name='name']").value;
    let description = contentForm.querySelector("textarea[name='description']").value;
    let links = [];
    // loop through every link list in ul
    let listOfLink = ulElement.querySelectorAll("li.form-link-list:not(#link-template)")
    listOfLink.forEach(function(list) {
        links.push(list.getElementsByTagName("a")[0].href);;
    })

    // Make a JS object to contain the task data we want to write into local storage for each item.
    let newContent = {
        "assignment": assignment,
        "name": name,
        "description": description,
        "links": links,
    }

    // get the current subjects, then modify it by adding new content or editted the existed one
    let subjects = getSubjects();
    if (contentIsNew)
        subjects[selectedSubject].contents.push(newContent);
    else
        subjects[selectedSubject].contents[contentIndex] = newContent;

    // update it to local storage
    subjects = JSON.stringify(subjects);
    localStorage.setItem('subjects', subjects);

    // Render the new update to the webpage
    LoadContent();

    // close the form
    contentForm.style.visibility = "hidden";
})

/* Delete a content
The content delete button are add dynamically, where the yes button acts as
submit button and variable 'selectSubject' and 'contentIndex' have been change
accorded to each exit button to provide different functionally when the user
confirm to delete the content
*/

// open delete content form event (only function)
function openDeleteContentForm(sentFromSubject, sentFromContentIndex, contentInfo) {
    // change the subject accorded to subject section and content index that clicked the button
    selectedSubject = sentFromSubject;
    contentIndex = sentFromContentIndex;

    // open form
    contentDeleteForm.style.visibility = "visible";
}

// close form event
contentDeleteExitButton.addEventListener("click", function(event) {
    contentDeleteForm.style.visibility = "hidden";
})

contentDeleteBackground.addEventListener("click", function(event) {
    contentDeleteForm.style.visibility = "hidden";
})

contentDeleteNoButton.addEventListener("click", function(event) {
    contentDeleteForm.style.visibility = "hidden";
})

// submit form event
contentDeleteYesButton.addEventListener("click", function(event) {
    // get the current subjects data
    let subjects = getSubjects();

    // delete a task out of specific position
    subjects[selectedSubject].contents.splice(contentIndex, 1)

    // update new subjects data to local storage
    subjects = JSON.stringify(subjects);
    localStorage.setItem('subjects', subjects);

    // render the new update to user
    LoadContent();

    contentDeleteForm.style.visibility = "hidden";
})