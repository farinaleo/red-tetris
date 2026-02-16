const { piecesArray, PiecesShapes } = require('../enums/Pieces.js');
const { Piece } = require('./Piece.js'); // Assuming the class is exported from Piece.js

describe('Piece', () => {
    let piece;

    test('Constructor should create a piece with correct properties', () => {
        piece = new Piece(1);
        expect(piece.index).toBe(1);
        expect(piecesArray.some(p => p.type === piece.type)).toBeTruthy();
        expect(piece.size).toBeGreaterThan(0);
        expect(piece.x).toBe(3);
        expect(piece.y).toBe(0);
        expect(piece.rotation).toBe(0);
        expect(piece.hardDrop).toBe(false);
    });

    test('Copy should create a new piece with the same properties', () => {
        piece = new Piece(1);
        const copiedPiece = piece.copy();
        expect(copiedPiece.index).toBe(piece.index);
        expect(copiedPiece.type).toBe(piece.type);
        expect(copiedPiece.size).toBe(piece.size);
        expect(copiedPiece.x).toBe(piece.x);
        expect(copiedPiece.y).toBe(piece.y);
        expect(copiedPiece.rotation).toBe(piece.rotation);
        expect(copiedPiece.hardDrop).toBe(piece.hardDrop);
    });

    test('Update coordinates should update x, y, and rotation', () => {
        piece = new Piece(1);
        piece.updateCoordinates(5, 10, 1);
        expect(piece.x).toBe(5);
        expect(piece.y).toBe(10);
        expect(piece.rotation).toBe(1);
    });

    test('Get shape should return the correct shape for the current rotation', () => {
        piece = new Piece(1);
        const shape = piece.getShape();
        expect(shape).toEqual(PiecesShapes[piece.type][piece.rotation]);
    });

    test('Rotation should wrap around correctly', () => {
        piece = new Piece(1);

        piece.type = piecesArray['1'].type;
        piece.shape = PiecesShapes[piece.type];
        piece.updateCoordinates(0, 0, 1);
        expect(piece.rotation).toBe(1);
    });
});
