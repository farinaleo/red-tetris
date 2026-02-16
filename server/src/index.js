const {Game} = require('./game/Game.js');
const {Player} = require('./game/Player.js');
const {GameStatus} = require('./enums/GameStatus.js');
const {Movements, MovementsPositions} = require('./enums/Movements.js');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const {PlayerEvents} = require("./enums/PlayerEvents");
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const allowedOrigins = process.env.CORS_ORIGINS.split(',');


const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
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
        if (!games.has(roomName)) {
            games.set(roomName, new Game(roomName));
        }

        const currentGame = games.get(roomName);

        if (currentGame.usernameExists(username)) {
            console.log('error redirect username used');
            sendErrorRedirection(io, socket.id, 'Connexion', 'Username already used.');
            return ;
        } else if (currentGame.status === GameStatus.STARTED) {
            console.log('error game started...');
            sendErrorRedirection(io, socket.id, 'Game', 'Cant join, the game is running.');
            return ;
        } else {
            const player = new Player(username, socket.id);
            currentGame.addPlayer(player);
            socket.join(roomName);

            console.log(roomName + ' new user : ' + username);
            currentGame.sendUpdatedPlayersList(io);
            currentGame.sendGameStatus(io);
        }
    });

    socket.on('disconnect', () => {
        games.forEach((game, roomName) => {
            game.removePlayer(socket.id);
            game.sendUpdatedPlayersList(io);
            console.log('Bye bye user see yoo later in ' + roomName);

            if (game.players.length === 0) {
                game.destroy();
                 console.log(games.delete(roomName));
                console.log(`Room ${roomName} has been removed as it is now empty.`);
            }
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
               sendErrorNotification(io, socket.id, 'Player status', 'You are not the master.')
           }
       }
    });

    socket.on('move_piece', ({movement}) =>{
        games.forEach((game, roomName) => {
           if (game.socketIdExists(socket.id)) {
               if (game.status === GameStatus.STARTED) {
                   const player = game.getPlayerBySocketId(socket.id);

                    if (movement !== Movements.FAST_DOWN) {
                        const coor = MovementsPositions[movement];
                        game.singlePlayerGameLogic(io, player, false, coor);
                    } else if (movement === Movements.FAST_DOWN) {
                        game.hardDrop(io, player);
                    }
               }
           }
        });
    });

});



// Démarrer le serveur
const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
