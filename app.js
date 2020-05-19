const fs = require('fs');
const util = require("util");
let express = require("express");
let path = require("path");
var bodyParser = require("body-parser");
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
let app = express();
let PORT = process.env.PORT || 3000;

var allNotes = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(express.static('public'));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    readFile("./db/db.json", "utf8").then(function(data) {
        allNotes = JSON.parse(data);
        return res.json(allNotes);
      }).catch(function(err) {
        console.log(err);
    });
});

app.post('/api/notes', function (req, res) {
    var note = req.body;
    note.id = allNotes.length + 1;
    allNotes.unshift(note);
    writeFile("./db/db.json", JSON.stringify(allNotes) + "\n");
    res.json(note);
});

app.delete('/api/notes/:id', function(req, res){
    allNotes = allNotes.filter(o => o.id != req.params.id)
    writeFile("./db/db.json", JSON.stringify(allNotes) + "\n");
    res.json(allNotes);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


// starts server to begin listening
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});