const { time } = require('console');
const express = require('express');
const app = express();

const http = require("http").Server(app)
const io = require("socket.io")(http)
const mysql = require("mysql");
const { validateNoteName, validateNoteMessage } = require('../shared/constants');

const { randomString } = require("../shared/essentials")

const isDev = process.env.NODE_ENV !== "production"

app.use(express.static('dist'));

//api example
//app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

let connectionData = process.env.JAWSDB_URL
if (isDev) connectionData = {
    host: "localhost",
    user: "root",
    password: "",
    database: "stickynoteswall"
}

var connection = mysql.createConnection(connectionData)

connection.connect()

connection.query("SELECT data FROM notesdata WHERE id='notes'", (error, results, fields) => {
    if(error) throw error

    notes = JSON.parse(results[0].data)
})

setInterval(() => {
    if(!notesDirty) return
    notesDirty = false

    connection.query("UPDATE notesdata SET data=? WHERE id='notes'", [JSON.stringify(notes)], (error, results, fields) => {
        if (error) throw error
    })
}, 30 * 1000)

let notes = {}
let notesDirty = false

let emitNotes = (target) => {
    target.emit("allNotes", notes)
}

io.on("connection", socket => {
    socket.emit("getId", socket.id)

    emitNotes(socket)

    socket.on("createNote", data => {
        notes[randomString()] = {
            position: data.position,
            name: validateNoteName(data.name),
            message: validateNoteMessage(data.message),
            created: new Date().getTime()
        }
        notesDirty = true

        emitNotes(io)
    })
})

http.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));