// import express package
const express = require('express');

// initialise the express framework
const app = express();

// server static file from public folder
app.use(express.static('public'));

// serve the index file to user
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
})

// let server listen to port 8888
let server = app.listen(8888, function(){
    console.log("App server is running on port 8888");
});