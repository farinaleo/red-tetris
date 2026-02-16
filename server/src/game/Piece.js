const {piecesArray, PiecesShapes} = require('../enums/Pieces.js');

let lastPieceIndex = 0;
const X_ORIGIN = 3;
const Y_ORIGIN = 0;

class Piece {
    constructor(index) {
        let randomIndex= 0;


        do {
            randomIndex = Math.floor(Math.random() * piecesArray.length);
        } while (randomIndex === lastPieceIndex);

        const selectedPiece = piecesArray[randomIndex];

        this.index = index;
        this.type = selectedPiece.type;
        this.size = selectedPiece.size;
        this.shape = PiecesShapes[this.type];
        this.x = X_ORIGIN;
        this.y = Y_ORIGIN;
        this.rotation = 0;
        this.hardDrop = false;

        lastPieceIndex = randomIndex;
    }

    copy() {
        const pieceCopy = new Piece(this.index);
        pieceCopy.type = this.type;
        pieceCopy.size = this.size;
        pieceCopy.shape = PiecesShapes[this.type];

        return pieceCopy;
    }

    updateCoordinates(x, y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = (((this.rotation + rotation) % this.shape.length) + this.shape.length) % this.shape.length;
    }

    getShape() {
        return this.shape[this.rotation];
    }

    isAtOrigin() {
        return this.x === X_ORIGIN && this.y === Y_ORIGIN;
    }
}

module.exports = {Piece};