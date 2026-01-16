const {piecesArray, PiecesShapes} = require('../enums/Pieces.js');
class Piece {
    constructor(index) {
        const randomIndex = Math.floor(Math.random() * piecesArray.length);
        this.index = index;
        this.type = piecesArray[randomIndex].type;
        this.size = piecesArray[randomIndex].size;
        this.shape = PiecesShapes[this.type];
        this.x = 0
        this.y = 0
        this.rotation = 0
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
}

module.exports = {Piece};