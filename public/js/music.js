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

var tomatoButton = document.querySelector("#Music-Page > form > button");
var urlInput = document.querySelector("#Music-Page > form > div > input");
var warnText = document.querySelector("#Music-Page > form > div > small");

/* 
function startup


*/




/* 
function event

These function below is where the user interaction within the page happened
These function will perform vary depend on the button that pass the function
*/


/* Submit url link
User able to submit YouTube url link, first it will check if user have
enough tomato, then check if the url link is valid, then it will take in
loading process. If success, then stored the music data and load the page.
*/

// This function will help validate if the input is youtube link
// grab from: https://www.codegrepper.com/code-examples/javascript/javascript+validate+url+to+match+youtube+video
function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if(url.match(p)){
        return url.match(p)[1];
    }
    return false;
}

// if user click the input again then it turn back to normal
urlInput.addEventListener("focus", function(event) {
    warnText.innerText = "";
})

// click on the button event
tomatoButton.addEventListener("click", function(event) {
    // get the input value
    let link = urlInput.value;
    if (link == null || link == "") return; // do nothing if not input

    // if user don't have enough tomato, then warn user
    let tomato = getTomato();
    if (tomato < 1) {
        warnText.innerText = "You don't have enough Tomato to use this feature! Go back to study!";
        return;
    }

    // if the link is not valid then warn user
    if (!matchYoutubeUrl(link)) {
        warnText.innerText = "This link is invalid, please use another link";
        return;
    }
})