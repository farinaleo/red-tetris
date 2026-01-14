const {Player} = require('./Player.js');
const {Piece} = require('./Piece.js');
const {GameStatus} = require('../enums/GameStatus.js');
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
        console.log(this.players);
        this.promoteAMasterIfMissing();
    }

    usernameExists(username) {
        const players = this.players.filter(player => player.username === username);
        return (players.length !== 0);
    }

    removePlayer(socketId) {
        this.players = this.players.filter(player => player.socketId !== socketId);
        console.log('by by player');
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
        console.log(this.players);
    }

    isMaster(socketId) {
        const player = this.players.find(player => player.socketId === socketId);
        return (player.isMaster);
    }

    launchGame() {
        if (this.status !== GameStatus.STARTED) {
            this.status = GameStatus.STARTED;
            return true;
        } else {
            return false;
        }
    }

    gameLoop(io) {
            this.gameInterval = setInterval(() => {
                if (this.status === GameStatus.STARTED) {
                    if (this.pieceIndex < this.pieces.length - 1) {
                        io.to(this.roomName).emit('next_piece', {piece: this.pieces[this.pieceIndex]});
                        this.pieceIndex = this.pieceIndex + 1;
                    } else {
                        this.status = GameStatus.FINISHED;
                        this.sendGameStatus(io);
                        this.pieceIndex = 0;
                        clearInterval(this.gameInterval);
                    }
                    this.players.forEach((player) => {
                        player.sendCurrentBoard(io);
                    });
                }
            }, 3000);
    }

}

module.exports = {Game};