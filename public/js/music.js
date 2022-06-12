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

function getMusics() {
    let musics = localStorage.getItem("musics");
    console.log(musics);

    if (musics == null)
        return [];

    musics = JSON.parse(musics);
    return musics;
}

function getMusicIndex() {
    let musicIndex = localStorage.getItem("musicIndex");

    if (musicIndex == null)
        return 0;

    musicIndex = JSON.parse(musicIndex);
    return musicIndex;
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
Music page

Below are script that will accociated with content page only
*/

/* variable */

var tomatoButton = document.querySelector("#Music-Page > form > button");
var urlInput = document.querySelector("#Music-Page > form > div > input");
var warnText = document.querySelector("#Music-Page > form > div > small");

var mainContent = document.querySelector("#Music-Page > main-content");
var mainName = mainContent.getElementsByTagName("h1")[0];
var mainAuthor= mainContent.querySelector("h3 > a");
var mainImage = mainContent.getElementsByTagName("img")[0];
var mainPlayerContainer = mainContent.getElementsByTagName("div")[0];

var skipLeftButton = mainContent.getElementsByTagName("button")[0];
var skipRightButton = mainContent.getElementsByTagName("button")[1];

var songList = document.getElementById("music-selector");
var songListTemplate = document.getElementById("songList-template");

/* 
function startup


*/

function LoadMusicInfo() {
    let musics = getMusics();
    let musicInfo = musics[getMusicIndex()];

    // hide the main content if there are no music avaialble
    if (musicInfo == null) {
        mainContent.style.display = "none";
        // change the music player object to empty, so it stop the song when got removed
        let playerTemplate = document.getElementById("music-player");
        var newPlayer = playerTemplate.cloneNode(true);
        var mainPlayer = newPlayer.querySelector("#music-player param[name='movie']");
        var mainEmbed = newPlayer.querySelector("#music-player embed");
        let embedId = "";
        mainPlayer.value = embedId;
        mainEmbed.src = embedId;
        mainPlayerContainer.removeChild(playerTemplate);
        mainPlayerContainer.insertBefore(newPlayer, mainPlayerContainer.getElementsByTagName("button")[1]);
        return;
    } else {
        mainContent.style.display = "flex";
    }

    // change the content accorded to data
    mainName.innerText = musicInfo.name;
    mainAuthor.href = musicInfo.authorURL;
    mainAuthor.innerText = musicInfo.author;
    mainImage.src = musicInfo.imgURL;

    // change music player (it hard to explain, but what I doing here is delete the existed player, then add the new one with a new link, so it can change the song when load this function)
    let playerTemplate = document.getElementById("music-player");
    var newPlayer = playerTemplate.cloneNode(true);
    var mainPlayer = newPlayer.querySelector("#music-player param[name='movie']");
    var mainEmbed = newPlayer.querySelector("#music-player embed");
    let embedId = "https://www.youtube.com/embed/" + musicInfo.link.split("=")[1];
    mainPlayer.value = embedId;
    mainEmbed.src = embedId;
    mainPlayerContainer.removeChild(playerTemplate);
    mainPlayerContainer.insertBefore(newPlayer, mainPlayerContainer.getElementsByTagName("button")[1]);
}
LoadMusicInfo();

function LoadSongList() {
    // clear all the song list
    while (songList.firstChild)
        songList.removeChild(songList.lastChild);

    // get all the musics data
    let musics = getMusics();

    for (let i = 0; i < musics.length; i++) {
        // get current index music info
        let musicData = musics[i];

        // clone music list and fill information in
        let newMusic = songListTemplate.cloneNode(true);
        newMusic.getElementsByTagName("img")[0].src = musicData.imgURL;
        newMusic.getElementsByTagName("img")[0].alt = musicData.name;
        newMusic.getElementsByTagName("figcaption")[0].innerText = musicData.name;

        // style the music list (make it visible)
        newMusic.removeAttribute("id");
        newMusic.style.display = "flex";

        // user able to play selected music by clicking the thumbnail icon
        let thumbnail = newMusic.getElementsByTagName("figure")[0];
        thumbnail.addEventListener("click", function(event) {
            // get the current music index
            let musicIndex = getMusicIndex();

            // if it the same index as this music list then do nothing
            if (musicIndex == i) return;

            // otherwise change current music index to this song in local storage
            let newIndex = JSON.stringify(i);
            localStorage.setItem("musicIndex", newIndex);

            // reload the page again to the user
            LoadMusicInfo();
        })

        // user also able to delete song from the song list if they want to
        let delButton = newMusic.querySelector("#delete-button");
        delButton.addEventListener("click", function(event) {
            // get current musics data
            let currentData = getMusics();

            // modify it by delete the current index
            currentData.splice(i, 1);

            // update it on local storage
            currentData = JSON.stringify(currentData);
            localStorage.setItem("musics", currentData);

            // if the current index is place higher than deleted index, move current index down by 1 (except 0)
            let oldIndex = getMusicIndex();
            if (i <= oldIndex)
                localStorage.setItem("musicIndex", JSON.stringify(Math.max(oldIndex-1, 0))); // it will never be less than 0

            // render new song list to user
            LoadSongList();

            // if the song that got deleted is the current song that user played, then reload song info
            if (oldIndex == i)
                LoadMusicInfo();
        })

        // at last, add the song to song list
        songList.appendChild(newMusic);
    }
}
LoadSongList();


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

    // get JSON link information from that YouTube link
    let jsonLink = "https://www.youtube.com/oembed?url=" + link + "&format=json"

    // Create new request for data and store as variable
    var request = new XMLHttpRequest();

    // Open a connection to the API endpoint,
    //  passing in the arguments: (HTTP METHOD, URL ENDPOINT)
    request.open('GET', jsonLink);

    // When the URL loads
    request.onload = function() {

        // Parse the response from the API as JSON data and store in a variable
        let data = JSON.parse(this.response);
        console.log(data); // Uncomment to see the returned response

        // Check the status codes to see if the request was successful
        if (request.status >= 200 && request.status < 400) {

            // update tomato
            let updateTomato = JSON.stringify(getTomato()-1);
            localStorage.setItem("tomato", updateTomato);
            LoadTomato();

            // craete music JSON object
            let newMusic = {
                "link": link,
                "name": data.title,
                "author": data.author_name,
                "authorURL": data.author_url,
                "imgURL": data.thumbnail_url
            };

            // get old music data and add it to the music list
            let musics = getMusics();
            let arrayLength = musics.length;
            musics.push(newMusic);

            // add new music data to local storage
            musics = JSON.stringify(musics);
            localStorage.setItem('musics', musics);

            // empty the input box
            urlInput.value = "";
            urlInput.innerText = "";

            // render new update to user
            LoadSongList();

            // if it's the first song then reload music page
            if (arrayLength == 0)
                LoadMusicInfo();

        } else {
            warnText.innerText = "Embed failled, please try again later";
            return;
        }
    }

    // Send request for processing - important that this is after the onload function
    request.send();
})

/* Skip song
User able to skip song to the left or right of its playlist. In case if they
want to skip to another song if they don't like. Which might be more eaiser
for the mobile user
*/

skipLeftButton.addEventListener("click", function(event) {
    // get the current song index
    let musicIndex = getMusicIndex();

    // if the next left of its index is below 0 then it do nothing
    let newIndex = musicIndex-1;
    if (newIndex < 0) return;

    // otherwise update new index to local storage
    newIndex = JSON.stringify(newIndex);
    localStorage.setItem("musicIndex", newIndex);

    // render the new music page to user
    LoadMusicInfo();
})

skipRightButton.addEventListener("click", function(event) {
    // get the current song index
    let musicIndex = getMusicIndex();
    let musicsLenght = getMusics().length;

    // if the next right of its index is exceed the musics array lenght then do nothing
    let newIndex = musicIndex+1;
    if (newIndex >= musicsLenght) return;

    // otherwise update new index to local storage
    newIndex = JSON.stringify(newIndex);
    localStorage.setItem("musicIndex", newIndex);

    // render the new music page to user
    LoadMusicInfo();
})