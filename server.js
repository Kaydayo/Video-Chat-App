const express = require('express')
const app = express()
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use('/peerjs', peerServer)
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
})
app.get("/:room", (req, res) => {
    res.render('room', { roomID: req.params.room })
})
const port = process.env.PORT || 5000
io.on('connection', (socket) => {
    socket.on('join - room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user - connected', userId);
    });
});

server.listen(port, () => {
    console.log(`server is currently listening on port ${port}`)
})