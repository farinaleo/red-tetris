const {Game} = require('./game/Game.js');
const {Player} = require('./game/Player.js');
const {GameStatus} = require('./enums/GameStatus.js');
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
    io.to(roomName).emit('notify_error', {topic:topic, message:message});
}

function sendErrorRedirection(io, roomName, topic, message) {
    io.to(roomName).emit('redirect_error', {topic:topic, message:message});
}

io.on('connection', (socket) => {
    console.log('Say hi to a new user !!');

    socket.on('join', ({ roomName, username }) => {
        console.log(username + ' ask to join ' + roomName);

        if (!games.has(roomName)) {
            games.set(roomName, new Game(roomName));
        }

        const currentGame = games.get(roomName);

        if (currentGame.usernameExists(username)) {
            console.log('error redirect username used');
            sendErrorRedirection(io, socket.id, 'Username', 'Username already used.');
            return ;
        } else if (currentGame.status === GameStatus.STARTED) {
            console.log('error game started...');
            sendErrorRedirection(io, socket.id, 'Game', 'Can t join, a game is running.');
            return ;
        } else {
            const player = new Player(username, socket.id);
            currentGame.addPlayer(player);
            socket.join(roomName);

            console.log(roomName + ' new user : ' + username);
            sendErrorNotification(io, socket.id, 'test', 'test error 1 2 1 2')
            currentGame.sendUpdatedPlayersList(io);
            currentGame.sendGameStatus(io);
        }
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
                    currentGame.gameLoop(io);
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
