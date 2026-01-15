const {Piece} = require("./Piece");

class Player {
    constructor(username, socketId) {
        this.username = username;
        this.socketId = socketId;
        this.isMaster = false;
        this.board = Array.from({ length: 10 * 20 }, (_, index) => 0);
        this.currentPiece = null;
        this.pieceId = 0;
        this.updatedTime = null;
    }

    setInitialTime(initialTime) {
        this.updatedTime = initialTime;
    }

    setInitialPiece(piece) {
        this.currentPiece = piece;
    }

    switchMasterStatus(status) {
        this.isMaster = status;
    }

    hasElementCollision() {
        return this.currentPiece.shape.some((element, index) => {
            if (element !== 0) {
                const x = Number(index % 4 + this.currentPiece.x);
                const y = Number((Math.floor(index / 4) + this.currentPiece.y));
                if (this.board[x + (10 * y)] !== 0) {
                    return true;
                }
            }
            return false;
        });
    }

    hasCollisionX() {
        return this.currentPiece.shape.some((element, index) => {
            if (element !== 0) {
                const x = Number(index % 4 + this.currentPiece.x);
                if (x < 0 || x > 9) {
                    return true;
                }
            }
            return false;
        });
    }

    hasCollisionY() {
        return this.currentPiece.shape.some((element, index) => {
            if (element !== 0) {
                const y = Number((Math.floor(index / 4) + this.currentPiece.y));
                if (y < 0 || y > 19) {
                    return true;
                }
            }
            return false;
        });
    }

    moveCurrentPiece(x = 0, y = 0) {
        this.currentPiece.updateCoordinates(this.currentPiece.x + x, this.currentPiece.y + y);
        if (this.hasCollisionX()) {
            this.currentPiece.updateCoordinates(this.currentPiece.x - x, this.currentPiece.y);
        }
        if (this.hasCollisionY()) {
            this.currentPiece.updateCoordinates(this.currentPiece.x, this.currentPiece.y - y);
        }
    }

    sendCurrentBoard(io) {
        if (Date.now() - this.updatedTime >= 1000) {
            console.log('update time and position');
            this.updatedTime = Date.now();
            this.moveCurrentPiece(0, 1);
        }
        const currentBoard = Array.from(this.board);
        console.log(this.currentPiece);
        this.currentPiece.shape.forEach((element, index) => {
           currentBoard[Number(index % 4 + this.currentPiece.x) + Number(10 * (Math.floor(index / 4) + this.currentPiece.y))] = element;
        });
        console.log('sent board to ' + this.username);
        io.to(this.socketId).emit('current_board', {board: currentBoard});
    }
}

module.exports = {Player};