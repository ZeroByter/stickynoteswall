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

let cheatPassword = process.env.CHEATS_PASSWORD
if (isDev) cheatPassword = "meme"

var connection = mysql.createConnection(connectionData)

connection.connect()

connection.query("SELECT data FROM notesdata WHERE id='notes'", (error, results, fields) => {
    if (error) throw error

    notes = JSON.parse(results[0].data)
})

setInterval(() => {
    if (!notesDirty) return
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

let emitNewNote = (target, noteId) => {
    target.emit("newNote", noteId, notes[noteId])
}

let sockets = {}

io.on("connection", socket => {
    sockets[socket.id] = {
        socket,
        ip: socket.request.connection.remoteAddress,
        isAdmin: false,
        //all notes created by the user in the past second
        recentNotes: []
    }

    socket.emit("getId", socket.id)

    emitNotes(socket)

    socket.on("createNote", data => {
        let currentTime = new Date().getTime()

        let recentNotesCount = 0
        sockets[socket.id].recentNotes.forEach(noteId => {
            let note = notes[noteId]

            if (currentTime - note.created > 1000) {
                delete sockets[socket.id].recentNotes[noteId]
            } else {
                recentNotesCount += 1
            }
        })

        if (recentNotesCount == 0) {
            let newNoteId = randomString()

            sockets[socket.id].recentNotes.push(newNoteId)

            notes[newNoteId] = {
                position: data.position,
                name: validateNoteName(data.name),
                message: validateNoteMessage(data.message),
                created: currentTime
            }
            notesDirty = true

            emitNewNote(io, newNoteId)
        }
    })

    socket.on("cheats", data => {
        if (data.password == cheatPassword) {
            sockets[socket.id].isAdmin = true
        }
    })

    socket.on("disconnect", reason => {
        delete sockets[socket.id]
    })
})

http.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));