const {Player} = require('./Player.js');
const {Piece} = require('./Piece.js');
const {GameStatus} = require('../enums/GameStatus.js');
const {piecesArray, PiecesShapes} = require("../enums/Pieces");
const {PlayerStatus} = require("../enums/PlayerStatus");
const {PlayerEvents} = require("../enums/PlayerEvents");
class Game {
    constructor(roomName) {
        this.roomName = roomName;
        this.players = [];
        this.status = GameStatus.WAITING;
        this.pieceIndex = 0;
        this.pieces = Array.from({ length: 10 }, (_, index) => new Piece(index));
        this.gameInterval = null;
        this.speed = {speed: 1000};
        this.initialTime = null;
    }

    destroy() {
        clearInterval(this.gameInterval);
    }

    addPlayer(player) {
        this.players.push(player);
        this.promoteAMasterIfMissing();
    }

    usernameExists(username) {
        const players = this.players.filter(player => player.username === username);
        return (players.length !== 0);
    }

    socketIdExists(socketId) {
        const players = this.players.filter(player => player.socketId === socketId);
        return (players.length !== 0);
    }

    getPlayerBySocketId(socketId) {
        const player = this.players.find(player => player.socketId === socketId);
        return player;
    }

    removePlayer(socketId) {
        this.players = this.players.filter(player => player.socketId !== socketId);
        this.promoteAMasterIfMissing();
    }

    sendUpdatedPlayersList(io) {
        io.to(this.roomName).emit('update_players', this.players)
    }

    sendGameStatus(io) {
        io.to(this.roomName).emit('game_status', {status:this.status})
    }

    promoteAMasterIfMissing() {
        console.log("Promote master");
        console.log(this.players);
        const masters = this.players.filter(player => player.isMaster);
        console.log(masters);
        if (!(Array.isArray(masters) && masters.length !== 0)) {
            if (Array.isArray(this.players) && this.players.length !==0) {
                console.log("Promote master !!!");
                const firstPlayer = this.players[0];
                firstPlayer.switchMasterStatus(true);
                console.log(firstPlayer);
            }
        }
    }

    isMaster(socketId) {
        const player = this.players.find(player => player.socketId === socketId);
        return (player.isMaster);
    }

    getNextPiece(index) {
        if (index >= this.pieces.length) {
            this.pieces.push(...Array.from({ length: 10 }, (_, index) => new Piece(index)));
        }
        return this.pieces[index];
    }

    bockRowForOthersPlayers(username) {
        console.log("Block row");
        this.players.forEach(player => {
            if (player.username !== username) {
                player.blockARow();
            }
        });
    }

    isGameFinished() {
        if (this.players.length === 1 && this.players[0].status === PlayerStatus.LOST) {
            return true;
        } else if (this.players.length > 1) {
            const playingPlayers = this.players.filter(player => player.status === PlayerStatus.PLAYING);
            return playingPlayers.length === 1;
        }
        return false;
    }

    setTheWinner(io) {
        if (this.players.length > 1) {
            const winner = this.players.find(player => player.status === PlayerStatus.PLAYING);
            winner.changeStatusAndNotify(PlayerStatus.WON, io);
        }
    }

    terminateGame(io, hasError = false) {
        this.status = GameStatus.FINISHED;
        if (!hasError) {
            this.setTheWinner(io);
        }
        this.sendGameStatus(io);
        this.players.forEach(player => player.reset());
        clearInterval(this.gameInterval);
    }

    initiatePlayers(io) {
        const initialTime = Date.now();
        this.initialTime = initialTime;
        this.players.forEach(player => {
            player.setInitialTime(initialTime);
            player.setInitialSpeed(this.speed);
            player.setInitialPieces(this.pieces[0].copy(), this.pieces[1].copy());
            player.sendNextPiece(io);
            player.status = PlayerStatus.PLAYING;
            player.sendCurrentBoard(io);
        });
        this.sendUpdatedPlayersList(io);
    }

    launchGame() {
        if (this.status !== GameStatus.STARTED) {
            this.status = GameStatus.STARTED;
            this.pieces = Array.from({ length: 10 }, (_, index) => new Piece(index));
            return true;
        } else {
            return false;
        }
    }

    singlePlayerGameLogic(io, player, isPeriodic = true, direction = null) {
        if (player.status === PlayerStatus.PLAYING) {
            if (player.needANewPiece) {
                const nextPiece = this.getNextPiece(player.pieceId + 1);
                player.newPiece(nextPiece.copy(), player.pieceId + 1);
                player.sendCurrentBoard(io);
                player.sendNextPiece(io);
            }
            let event = PlayerEvents.NOTHING;

            if (isPeriodic) {
                event = player.periodicMovementDown();
            } else {
                event = player.moveCurrentPieceWrapper(direction);
            }
            player.sendCurrentBoard(io);
            if (event === PlayerEvents.DELETE_ROW) {
                this.bockRowForOthersPlayers(player.username);
            }
        }
    }

    updateSpeed() {
        const highestLevel = Math.max(...this.players.map(player => player.level));
        if (highestLevel < 5) {
            this.speed.speed = 1000;
        } else if (highestLevel < 10) {
            this.speed.speed = 850;
        } else if (highestLevel < 15) {
            this.speed.speed = 700;
        } else if (highestLevel < 20){
            this.speed.speed = 550;
        } else {
            this.speed.speed = 400;
        }
    }

    gameLoop(io) {
        this.initiatePlayers(io);
        this.gameInterval = setInterval(() => {
            if (this.status === GameStatus.STARTED) {
                try {
                    this.updateSpeed();
                    this.players.forEach((player) => {
                        this.singlePlayerGameLogic(io, player);
                    });
                    this.sendUpdatedPlayersList(io);
                    if (this.isGameFinished()) {
                        this.terminateGame(io);
                    }
                } catch (error) {
                    console.log(error);
                    this.terminateGame(io, true);
                }
            }
        }, 10);
    }

}

module.exports = {Game};