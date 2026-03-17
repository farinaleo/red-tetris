const {Game} = require('./game/Game.js');
const {Player} = require('./game/Player.js');
const {Tools} = require('./tools/Tools.js');
const {GameStatus} = require('./enums/GameStatus.js');
const {Movements, MovementsPositions} = require('./enums/Movements.js');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

/**
 * @namspace Server
 */

const app = express();
const server = http.createServer(app);

// INIT
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const games = new Map();

app.use(express.static(path.join(__dirname, '../client/public')));

app.get(['/', '/home'], (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});

// DEFINE NOTIFICATION FUNCTIONS

io.on('connection', (socket) => {
    // Handle first connexion.
    socket.on('join', ({ roomName, username }) => {
        // Block connexion with bad username nor roomName
        if (!Tools.isAlphanumeric(username) || !Tools.isAlphanumeric(roomName)) {
            Tools.sendErrorRedirection(io, socket.id, 'Connexion', 'Username and room name must be alphanumeric (only letters and numbers, no spaces or special characters).');
            return ;
        }

        if (!games.has(roomName)) {
            games.set(roomName, new Game(roomName));
        }

        const currentGame = games.get(roomName);

        // Block connexion if the username is taken.
        if (currentGame.usernameExists(username)) {
            Tools.sendErrorRedirection(io, socket.id, 'Connexion', 'Username already used.');
            return ;
        // Block connexion if the room is full.
        } else if (currentGame.players.length >= 4) {
            Tools.sendErrorRedirection(io, socket.id, 'Connexion', 'Room is full (max 4 players).');
            return ;
        // Block connexion if the game is running.
        } else if (currentGame.status === GameStatus.STARTED) {
            Tools.sendErrorRedirection(io, socket.id, 'Game', 'Cant join, the game is running.');
            return ;
        } else {
            // Join.
            const player = new Player(username, socket.id);
            currentGame.addPlayer(player);
            socket.join(roomName);

            currentGame.sendUpdatedPlayersList(io);
            currentGame.sendGameStatus(io);
        }
    });

    // Handle disconnection.
    socket.on('disconnect', () => {
        games.forEach((game) => {
            game.removePlayer(socket.id);
            game.sendUpdatedPlayersList(io);

            if (game.players.length === 0) {
                game.destroy();
            }
        });
    });

    // Handle starting game.
    socket.on('start_game', ({roomName}) => {
       if (games.has(roomName)) {
           const currentGame = games.get(roomName);
           // Check if the player can launch the game.
           if (currentGame.isMaster(socket.id)) {
                const isGameLaunched = currentGame.launchGame();
                if (!isGameLaunched) {
                    Tools.sendErrorNotification(io, socket.id, 'Game Status', 'Game running.');
                } else {
                    currentGame.sendGameStatus(io);
                    currentGame.gameLoop(io);
                }
           } else {
               Tools.sendErrorNotification(io, socket.id, 'Player status', 'You are not the master.')
           }
       }
    });

    // handle piece movements.
    socket.on('move_piece', ({movement}) =>{
        games.forEach((game, _) => {
           if (game.socketIdExists(socket.id)) {
               if (game.status === GameStatus.STARTED) {
                   const player = game.getPlayerBySocketId(socket.id);

                   // Manage simple movements from hard drop.
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



// Start the server only when run directly (not when required by tests)
if (require.main === module) {
    const PORT = process.env.SERVER_PORT;
    server.listen(PORT, '0.0.0.0', () => {});
}

module.exports = { app, server };