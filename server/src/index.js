const {Game} = require('./game/Game.js');
const {User} = require('./game/User.js');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:8080", // Allow requests from the client
        methods: ["GET", "POST"]
    }
});

const games = new Map();

app.use(express.static(path.join(__dirname, '../client/public')));

app.get(['/', '/home'], (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Say hi to a new user !!');

    socket.on('join', ({ roomName, username }) => {

        if (!games.has(roomName)) {
            games.set(roomName, new Game(roomName));
        }

        const currentGame = games.get(roomName);
        const user = new User(username, socket.id);
        currentGame.addUser(user);
        socket.join(roomName);

        console.log(roomName + ' new user : ' + username);
        io.to(socket.id).emit('report_error', {message : "test error"});
        currentGame.sendUpdatedUsersList(io);

    });

    socket.on('disconnect', () => {
        games.forEach((game, roomName) => {
            game.removeUser(socket.id);
            game.sendUpdatedUsersList(io);
            console.log('Bye bye user see yoo later in ' + roomName);
        });

    });
});



// Démarrer le serveur
const PORT = 3004;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
