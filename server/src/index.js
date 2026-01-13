const {Game} = require('./game/Game.js');
const {Player} = require('./game/Player.js');
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

function sendErrorNotification(io, roomName, topic, message) {
    io.to(roomName).emit('report_error', {topic:topic, message:message});
}

io.on('connection', (socket) => {
    console.log('Say hi to a new user !!');

    socket.on('join', ({ roomName, username }) => {
        console.log(username + ' ask to join ' + roomName);

        if (!games.has(roomName)) {
            games.set(roomName, new Game(roomName));
        }

        const currentGame = games.get(roomName);
        const player = new Player(username, socket.id);
        currentGame.addPlayer(player);
        socket.join(roomName);

        console.log(roomName + ' new user : ' + username);
        sendErrorNotification(io, socket.id, 'test', 'test error 1 2 1 2')
        currentGame.sendUpdatedPlayersList(io);
        currentGame.sendGameStatus(io);

    });

    socket.on('disconnect', () => {
        games.forEach((game, roomName) => {
            game.removePlayer(socket.id);
            game.sendUpdatedPlayersList(io);
            console.log('Bye bye user see yoo later in ' + roomName);
        });

    });

    socket.on('start_game', ({roomName}) => {
       console.log(socket.id + ' try to launch game ' + roomName);
       if (games.has(roomName)) {
           const currentGame = games.get(roomName);
           if (currentGame.isMaster(socket.id)) {
                const isGameLaunched = currentGame.launchGame();
                if (!isGameLaunched) {
                    sendErrorNotification(io, socket.id, 'Game Status', 'Game running.');
                } else {
                    currentGame.sendGameStatus(io);
                }
           } else {
               sendErrorNotification(io, socket.id, 'Player status', 'you are not the master.')
           }
       }
    });

});



// Démarrer le serveur
const PORT = 3004;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
