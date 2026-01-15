const {piecesArray, PiecesShapes} = require('../enums/Pieces.js');
class Piece {
    constructor(index) {
        const randomIndex = Math.floor(Math.random() * piecesArray.length);
        this.index = index;
        this.type = piecesArray[randomIndex];
        this.shape = PiecesShapes[this.type];
        this.x = 0
        this.y = 0
        this.rotation = 0
    }

    copy() {
        const pieceCopy = new Piece(this.index);
        pieceCopy.type = this.type;
        pieceCopy.shape = PiecesShapes[this.type];

        return pieceCopy;
    }

    updateCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    rotatePiece(rotation) {
        this.rotation = rotation;
    }
}

module.exports = {Piece};