const {Piece} = require("./Piece");
const {Tiles} = require("../enums/Tiles");
const {Movements, MovementsPositions} = require("../enums/Movements");
const {PlayerStatus} = require("../enums/PlayerStatus");
const {PlayerEvents} = require("../enums/PlayerEvents");

class Player {
    constructor(username, socketId) {
        this.username = username;
        this.socketId = socketId;
        this.isMaster = false;
        this.status = PlayerStatus.WAITING;
        this.board = Array.from({ length: 10 * 20 }, (_, index) => Tiles.EMPTY);
        this.nextPiece = null;
        this.currentPiece = null;
        this.pieceId = 0;
        this.speed = {speed: 1000};
        this.updatedTime = null;
        this.needANewPiece = false;
        this.level = 0;
    }

    reset() {
        this.status = PlayerStatus.WAITING;
        this.board = Array.from({ length: 10 * 20 }, (_, index) => Tiles.EMPTY);
        this.nextPiece = null;
        this.currentPiece = null;
        this.pieceId = 0;
        this.speed = {speed: 1000};
        this.updatedTime = null;
        this.needANewPiece = false;
        this.level = 0;
    }

    setInitialTime(initialTime) {
        this.updatedTime = initialTime;
    }

    setInitialSpeed(speed) {
        this.speed = speed;
    }

    setInitialPieces(piece, nextPiece) {
        this.currentPiece = piece;
        this.nextPiece = nextPiece;
        this.pieceId = 1;
    }

    setHardDrop() {
        this.currentPiece.hardDrop = true;
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

    changeStatusAndNotify(newStatus, io) {
        if (this.status !== newStatus)  {
            this.status = newStatus;
            this.sendPlayerStatus(io);
        }
    }

    hasElementCollision() {
        return this.currentPiece.getShape().some((element, index) => {
            if (element !== Tiles.EMPTY) {
                const x = Number(index % this.currentPiece.size + this.currentPiece.x);
                const y = Number((Math.floor(index / this.currentPiece.size) + this.currentPiece.y));
                if (this.board[x + (10 * y)] !== Tiles.EMPTY) {
                    return true;
                }
            }
            return false;
        });
    }

    hasCollisionX() {
        return this.currentPiece.getShape().some((element, index) => {
            if (element !== Tiles.EMPTY) {
                const x = Number(index % this.currentPiece.size + this.currentPiece.x);
                if (x < 0 || x > 9) {
                    return true;
                }
            }
            return false;
        });
    }

    hasCollisionY() {
        return this.currentPiece.getShape().some((element, index) => {
            if (element !== Tiles.EMPTY) {
                const y = Number((Math.floor(index / this.currentPiece.size) + this.currentPiece.y));
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

    countCompletedRows() {
        let completedRows = 0;
        for (let y = 0; y < 20; y++) {
            if (this.isRowCompleted(this.board.slice(y * 10, (y + 1) * 10))) {
                completedRows++;
            }
        }
        return completedRows;
    }

    deleteACompletedRow() {
        for (let y = 0; y < 20; y++) {
            if (this.isRowCompleted(this.board.slice(y * 10, (y + 1) * 10))) {
                this.board = [
                    ...Array.from({ length: 10 }, (_, index) => Tiles.EMPTY),
                    ...this.board.slice(0, (y * 10)),
                    ...this.board.slice((y + 1) * 10, 10*20)
                ]
                this.level++;
                return;
            }
        }
    }

    isRowBlocked(row) {
        return row.every(element => element === Tiles.BLOCKED);
    }

    blockARow() {
        for (let y = 19; y >= 0; y--) {
            if (!this.isRowBlocked(this.board.slice(y * 10, (y + 1) * 10))) {
                this.board = [
                    ...this.board.slice(0, (y * 10)),
                    ...Array.from({ length: 10 }, (_, index) => Tiles.BLOCKED),
                    ...this.board.slice((y + 1) * 10, 10*20)
                ]
                return;
            }
        }
    }

    moveCurrentPiece(x = 0, y = 0, rotation = 0) {
        if (this.currentPiece.hardDrop === true) {
            x = 0;
            rotation = 0;
        }
        this.currentPiece.updateCoordinates(this.currentPiece.x + x, this.currentPiece.y + y, rotation);
        if (this.hasElementCollision()) {
            this.currentPiece.updateCoordinates(this.currentPiece.x - x, this.currentPiece.y - y, -rotation);
            return (y !== 0);
        }
        if (this.hasCollisionX()) {
            this.currentPiece.updateCoordinates(this.currentPiece.x - x, this.currentPiece.y, -rotation);
        }
        if (this.hasCollisionY()) {
            this.currentPiece.updateCoordinates(this.currentPiece.x, this.currentPiece.y - y, -rotation);
            return true;
        } else if (y !== 0) {
            this.updatedTime = Date.now();
        }
        return false;
    }

    moveCurrentPieceWrapper(direction) {
        let event = {hasReachBottom: false, blockedRow: 0};
        if (!this.needANewPeice) {
            const hasReachBottom = this.moveCurrentPiece(direction.x, direction.y, direction.rotation);
            if (hasReachBottom) {
                this.lockThePiece();
                event.hasReachBottom = true;
            }
            event.blockedRow = this.countCompletedRows();
        }
        return event;
    };

    lockThePiece() {
        this.currentPiece.getShape().forEach((element, index) => {
            if (element !== Tiles.EMPTY) {
                this.board[
                    Number(index % this.currentPiece.size + this.currentPiece.x)
                    + Number(10 * (Math.floor(index / this.currentPiece.size) + this.currentPiece.y))
                    ] = element;
            }
        });
        this.needANewPiece = true;
    }

    renderTemporaryBoard() {
        const temporaryBoard = Array.from(this.board);
        if (!this.needANewPiece) {
            this.currentPiece.getShape().forEach((element, index) => {
                if (element !== Tiles.EMPTY) {
                    temporaryBoard[
                    Number(index % this.currentPiece.size + this.currentPiece.x)
                    + Number(10 * (Math.floor(index / this.currentPiece.size) + this.currentPiece.y))
                        ] = element;
                }
            });
        }
        return temporaryBoard;
    }

    periodicMovementDown() {
        let event = {hasReachBottom: false, blockedRow: 0};
        if (Date.now() - this.updatedTime >= this.speed.speed) {
            this.updatedTime = Date.now();
            event = this.moveCurrentPieceWrapper(MovementsPositions.DOWN);
        }
        return event;
    }

    sendCurrentBoard(io) {
        const temporaryBoard = this.renderTemporaryBoard();
        io.to(this.socketId).emit('current_board', {board: temporaryBoard});
        if (this.hasElementCollision() && this.currentPiece.x === 0 && this.currentPiece.y === 0) {
            this.changeStatusAndNotify(PlayerStatus.LOST, io);
        }
    }

    sendNextPiece(io) {
        io.to(this.socketId).emit('next_piece', {piece: this.nextPiece});
    }

    sendPlayerStatus(io) {
        io.to(this.socketId).emit('player_status', {status: this.status});
    }
}

module.exports = {Player};