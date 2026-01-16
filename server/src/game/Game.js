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
        const masters = this.players.filter(player => player.isMaster);
        if (!(Array.isArray(masters) && masters.length !== 0)) {
            if (Array.isArray(this.players) && this.players.length !==0) {
                const firstPlayer = this.players[0];
                firstPlayer.switchMasterStatus(true);
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

    terminateGame(io) {
        if (this.players.length > 1) {
            const winner = this.players.find(player => player.status === PlayerStatus.PLAYING);
            winner.changeStatusAndNotify(PlayerStatus.WON, io);
        }
        this.status = GameStatus.FINISHED;
    }

    initiatePlayers(io) {
        const initialTime = Date.now();
        this.players.forEach(player => {
            player.setInitialTime(initialTime);
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

    gameLoop(io) {
        this.initiatePlayers(io);
        this.gameInterval = setInterval(() => {
            if (this.status === GameStatus.STARTED) {
                try {
                    this.players.forEach((player) => {
                        if (player.status === PlayerStatus.PLAYING) {
                            if (player.needANewPiece) {
                                const nextPiece = this.getNextPiece(player.pieceId + 1);
                                player.newPiece(nextPiece.copy(), player.pieceId + 1);
                                player.sendCurrentBoard(io);
                                player.sendNextPiece(io);
                            }
                            const event = player.periodicMovementDown();
                            player.sendCurrentBoard(io);
                            if (event === PlayerEvents.DELETE_ROW) {
                                this.bockRowForOthersPlayers(player.username);
                            }
                        }
                    });
                    this.sendUpdatedPlayersList(io);
                    if (this.isGameFinished()) {
                        this.terminateGame(io);
                        this.sendGameStatus(io);
                        this.players.forEach(player => player.reset());
                        clearInterval(this.gameInterval);
                    }
                } catch (error) {
                    console.log(error);
                    this.status = GameStatus.FINISHED;
                    this.sendGameStatus(io);
                    this.players.forEach(player => player.reset());
                    clearInterval(this.gameInterval);
                }
            }
        }, 500);
    }

}

module.exports = {Game};