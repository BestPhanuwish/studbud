/*
Initialise custom HTML tags

I've discovered the custom HTML tags to be the super useful tool
to help structure and improve readability of the code overall
instead of using id attribute.

popup-form: use to contain the html form with faded black background, 
and will use for form popup such as when adding new assignment
main-content: seperate aside tag and the main content using content tag 
instead of using main tag again, to avoid repetition on css code using diferent id

More information of custom HTML tags:
https://www.smashingmagazine.com/2014/03/introduction-to-custom-elements/
*/ class PopupForm extends HTMLElement {
    constructor(){
        super();
    }
}
class MainContent extends HTMLElement {
    constructor(){
        super();
    }
}
customElements.define("popup-form", PopupForm);
customElements.define("main-content", MainContent);
/*
Global variable

The reason I use only 1 JavaScript file because the variable such as tomato
and subjects will use across the whole page.
*/ var tomato = 0;
var subjects = [];
/*
Task page
*/ // variable
var assignmentButton = document.querySelector("#Task-List > aside > button");
var assignmentForm = document.getElementById("add-assignment");
var assignmentBackground = document.querySelector("#add-assignment > div");
// function
assignmentButton.addEventListener("click", function(event) {
    assignmentForm.style.display = "block";
});
assignmentBackground.addEventListener("click", function(event) {
    assignmentForm.style.display = "none";
});

//# sourceMappingURL=index.f3bd186e.js.map
