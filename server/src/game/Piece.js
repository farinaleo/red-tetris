const {piecesArray, PiecesShapes} = require('../enums/Pieces.js');

let lastPieceIndex = 0;
const X_ORIGIN = 3;
const Y_ORIGIN = 0;

/**
 * @namspace Server
 */

/**
 * Class for game piece.
 */
class Piece {
    /**
     * Initialise the class with a specific index and select a random type.
     * @param index The index to associate.
     */
    constructor(index) {
        let randomIndex= 0;


        // generate a random piece but different from the previous one.
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
        this.placedTime = null;

        lastPieceIndex = randomIndex;
    }

    /**
     * Duplicate properly the current piece.
     * @returns {Piece}
     */
    copy() {
        const pieceCopy = new Piece(this.index);
        pieceCopy.type = this.type;
        pieceCopy.size = this.size;
        pieceCopy.shape = PiecesShapes[this.type];

        return pieceCopy;
    }

    /**
     * Update the piece coordinates
     * @param x X position.
     * @param y Y position.
     * @param rotation Rotation to apply, 1 for a right rotation, -1 for a left.
     */
    updateCoordinates(x, y, rotation) {
        this.x = x;
        this.y = y;
        this.rotation = (((this.rotation + rotation) % this.shape.length) + this.shape.length) % this.shape.length;
    }

    /**
     * Get the piece shape matrix based on the rotation.
     * @returns {*}
     */
    getShape() {
        return this.shape[this.rotation];
    }

    /**
     * Check if the piece is at its first position.
     * @returns {boolean}
     */
    isAtOrigin() {
        return this.x === X_ORIGIN && this.y === Y_ORIGIN;
    }

    /**
     * Initialise the placedTime to the current time.
     */
    setPlacedTime() {
        if (this.placedTime === null) {
            this.placedTime = Date.now();
        }
    }

    /**
     * Reset to null the placedTime.
     */
    resetPlacedTime() {
        this.placedTime === null;
    }

    /**
     * Check if the placedTime is set.
     * @returns {boolean}
     */
    isPlaced() {
        return this.placedTime !== null;
    }

    /**
     * Check if the placedTime is expired.
     * @returns {boolean}
     */
    isPlacedTimeExpired() {
        return Date.now() - this.placedTime > 500;
    }

}

module.exports = {Piece};