const {Piece} = require("./Piece");
const {Tiles} = require("../enums/Tiles");
const {Movements, MovementsPositions} = require("../enums/Movements");

class Player {
    constructor(username, socketId) {
        this.username = username;
        this.socketId = socketId;
        this.isMaster = false;
        this.board = Array.from({ length: 10 * 20 }, (_, index) => Tiles.EMPTY);
        this.nextPiece = null;
        this.currentPiece = null;
        this.pieceId = 0;
        this.updatedTime = null;
        this.needANewPiece = false;
    }

    reset() {
        this.board = Array.from({ length: 10 * 20 }, (_, index) => Tiles.EMPTY);
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

    isRowCompleted(row) {
        return row.every(element => element !== Tiles.EMPTY && element !== Tiles.BLOCKED);
    }

    deleteCompletedRows() {
        let y = 0;
        while (y < 20) {
            if (this.isRowCompleted(this.board.slice(y * 10, (y + 1) * 10))) {
                this.board = [
                    ...Array.from({ length: 10 }, (_, index) => Tiles.EMPTY),
                    ...this.board.slice(0, (y * 10)),
                    ...this.board.slice((y + 1) * 10, 10*20)
                ]
            }
            y++;
        }
    };

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

    moveCurrentPieceWrapper(direction) {
        const hasReachBottom = this.moveCurrentPiece(direction.x, direction.y);
        console.log('has reach bottom: ' + hasReachBottom);
        if (hasReachBottom) {
            console.log('lock the piece');
            this.lockThePiece();
        }
        this.deleteCompletedRows();
    };

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

    periodicMovementDown() {
        if (Date.now() - this.updatedTime >= 1000) {
            console.log('update time and position');
            this.updatedTime = Date.now();
            this.moveCurrentPieceWrapper(MovementsPositions.DOWN);
        }
    }

    sendCurrentBoard(io) {
        const temporaryBoard = this.renderTemporaryBoard();
        console.log('sent board to ' + this.username);
        let y = 19;
        while (y >= 0) {
            console.log(temporaryBoard.slice(y * 10, (y + 1) * 10));
            y--;
        }
        io.to(this.socketId).emit('current_board', {board: temporaryBoard});
    }

    sendNextPiece(io) {
        io.to(this.socketId).emit('next_piece', {piece: this.nextPiece});
    }
}

module.exports = {Player};