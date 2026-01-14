const {piecesArray} = require('../enums/Pieces.js');
class Piece {
    constructor(index) {
        const randomIndex = Math.floor(Math.random() * piecesArray.length);
        this.index = index;
        this.type = piecesArray[randomIndex];
    }
}

module.exports = {Piece};