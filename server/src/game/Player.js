const {Piece} = require("./Piece");

class Player {
    constructor(username, socketId) {
        this.username = username;
        this.socketId = socketId;
        this.isMaster = false;
        this.board = Array.from({ length: 10 * 20 }, (_, index) => 0);;
        this.currentPiece = null;
        this.pieceId = 0;
    }

    switchMasterStatus(status) {
        this.isMaster = status;
    }
}

module.exports = {Player};