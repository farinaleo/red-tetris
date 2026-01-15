const {Piece} = require("./Piece");
const {Tiles} = require("../enums/Tiles");

class Player {
    constructor(username, socketId) {
        this.username = username;
        this.socketId = socketId;
        this.isMaster = false;
        this.board = Array.from({ length: 10 * 20 }, (_, index) => 0);
        this.nextPiece = null;
        this.currentPiece = null;
        this.pieceId = 0;
        this.updatedTime = null;
        this.needANewPiece = false;
    }

    reset() {
        this.board = Array.from({ length: 10 * 20 }, (_, index) => 0);
        this.nextPiece = null;
        this.currentPiece = null;
        this.pieceId = 0;
        this.updatedTime = null;
        this.needANewPiece = false;
    }

    setInitialTime(initialTime) {
        this.updatedTime = initialTime;
    }

    setInitialPieces(piece, nextPiece) {
        this.currentPiece = piece;
        this.nextPiece = nextPiece;
    }

    newPiece(piece, pieceId) {
        this.currentPiece = this.nextPiece;
        this.nextPiece = piece;
        this.pieceId = pieceId;
        this.needANewPiece = false;
    }

    switchMasterStatus(status) {
        this.isMaster = status;
    }

    hasElementCollision() {
        return this.currentPiece.shape.some((element, index) => {
            if (element !== Tiles.EMPTY) {
                const x = Number(index % 4 + this.currentPiece.x);
                const y = Number((Math.floor(index / 4) + this.currentPiece.y));
                if (this.board[x + (10 * y)] !== Tiles.EMPTY) {
                    return true;
                }
            }
            return false;
        });
    }

    hasCollisionX() {
        return this.currentPiece.shape.some((element, index) => {
            if (element !== Tiles.EMPTY) {
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
            if (element !== Tiles.EMPTY) {
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
        if (this.hasElementCollision()) {
            this.currentPiece.updateCoordinates(this.currentPiece.x - x, this.currentPiece.y - y);
            return (y !== 0);
        }
        if (this.hasCollisionX()) {
            this.currentPiece.updateCoordinates(this.currentPiece.x - x, this.currentPiece.y);
        }
        if (this.hasCollisionY()) {
            this.currentPiece.updateCoordinates(this.currentPiece.x, this.currentPiece.y - y);
            return true;
        }
        return false;
    }

    lockThePiece() {
        this.currentPiece.shape.forEach((element, index) => {
            if (element !== Tiles.EMPTY) {
                this.board[
                    Number(index % 4 + this.currentPiece.x)
                    + Number(10 * (Math.floor(index / 4) + this.currentPiece.y))
                    ] = element;
            }
        });
        this.needANewPiece = true;
    }

    renderTemporaryBoard() {
        const temporaryBoard = Array.from(this.board);
        this.currentPiece.shape.forEach((element, index) => {
            if (element !== Tiles.EMPTY) {
                temporaryBoard[
                Number(index % 4 + this.currentPiece.x)
                + Number(10 * (Math.floor(index / 4) + this.currentPiece.y))
                    ] = element;
            }
        });
        return temporaryBoard;
    }

    sendCurrentBoard(io) {
        if (Date.now() - this.updatedTime >= 1000) {
            console.log('update time and position');
            this.updatedTime = Date.now();
            const hasReachBottom = this.moveCurrentPiece(0, 1);
            console.log('has reach bottom: ' + hasReachBottom);
            if (hasReachBottom) {
                console.log('lock the piece');
                this.lockThePiece();
            }
        }
        const temporaryBoard = this.renderTemporaryBoard();
        console.log('sent board to ' + this.username);
        io.to(this.socketId).emit('current_board', {board: temporaryBoard});
    }

    sendNextPiece(io) {
        io.to(this.socketId).emit('next_piece', {piece: this.nextPiece});
    }
}

module.exports = {Player};