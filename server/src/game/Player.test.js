const { Player } = require('./Player');
const { Piece } = require('./Piece');
const { Tiles, MovementsPositions } = require('../enums/Tiles');
const { PlayerStatus } = require('../enums/PlayerStatus');
const {piecesArray, PiecesShapes} = require("../enums/Pieces");

describe('Player', () => {
    let player;
    let ioMock;

    beforeEach(() => {
        ioMock = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };
        player = new Player('Léo', 'socket123');
    });

    test('Constructor initializes player correctly', () => {
        expect(player.username).toBe('Léo');
        expect(player.socketId).toBe('socket123');
        expect(player.isMaster).toBe(false);
        expect(player.status).toBe(PlayerStatus.WAITING);
        expect(player.board.length).toBe(200);
        expect(player.board.every(tile => tile === Tiles.EMPTY)).toBe(true);
        expect(player.nextPiece).toBeNull();
        expect(player.currentPiece).toBeNull();
        expect(player.pieceId).toBe(0);
        expect(player.speed).toEqual({ speed: 1000 });
        expect(player.updatedTime).toBeNull();
        expect(player.needANewPiece).toBe(false);
        expect(player.level).toBe(0);
    });

    test('Reset resets player state', () => {
        player.status = PlayerStatus.PLAYING;
        player.board[0] = Tiles.FILLED;
        player.reset();
        expect(player.status).toBe(PlayerStatus.WAITING);
        expect(player.board.every(tile => tile === Tiles.EMPTY)).toBe(true);
        expect(player.nextPiece).toBeNull();
        expect(player.currentPiece).toBeNull();
        expect(player.pieceId).toBe(0);
        expect(player.speed).toEqual({ speed: 1000 });
        expect(player.updatedTime).toBeNull();
        expect(player.needANewPiece).toBe(false);
        expect(player.level).toBe(0);
    });

    test('Set initial time and speed', () => {
        const initialTime = Date.now();
        player.setInitialTime(initialTime);
        player.setInitialSpeed({ speed: 500 });
        expect(player.updatedTime).toBe(initialTime);
        expect(player.speed).toEqual({ speed: 500 });
    });

    test('Set initial pieces', () => {
        const piece = new Piece(1);
        const nextPiece = new Piece(2);
        player.setInitialPieces(piece, nextPiece);
        expect(player.currentPiece).toBe(piece);
        expect(player.nextPiece).toBe(nextPiece);
        expect(player.pieceId).toBe(1);
    });

    test('Set hard drop', () => {
        player.currentPiece = new Piece(1);
        player.setHardDrop();
        expect(player.currentPiece.hardDrop).toBe(true);
    });

    test('Move hard drop to bottom', () => {
        player.currentPiece = new Piece(1);
        player.setHardDrop();
        let hasReachBottom;
        for (let i = 0; i < 20; i++) {
            hasReachBottom = player.moveCurrentPiece(0, 1, 0);
        }
        expect(hasReachBottom).toBe(true);
    });

    test('Move hard drop to bottom', () => {
        player.currentPiece = new Piece(1);
        let event;
        for (let i = 0; i < 20; i++) {
            event = player.moveCurrentPieceWrapper({x:0, y:1, rotation:0});
        }
        expect(event.hasReachBottom).toBe(true);
    });

    test('New piece updates current and next pieces', () => {
        const piece = new Piece(1);
        const nextPiece = new Piece(2);
        player.nextPiece = nextPiece;
        player.newPiece(piece, 2);
        expect(player.currentPiece).toBe(nextPiece);
        expect(player.nextPiece).toBe(piece);
        expect(player.pieceId).toBe(2);
        expect(player.needANewPiece).toBe(false);
    });

    test('Switch master status', () => {
        player.switchMasterStatus(true);
        expect(player.isMaster).toBe(true);
    });

    test('Change status and notify', () => {
        player.changeStatusAndNotify(PlayerStatus.PLAYING, ioMock);
        expect(player.status).toBe(PlayerStatus.PLAYING);
        expect(ioMock.to).toHaveBeenCalledWith('socket123');
        expect(ioMock.emit).toHaveBeenCalledWith('player_status', { status: PlayerStatus.PLAYING });
    });

    test('Has element collision', () => {
        player.currentPiece = new Piece(1);
        player.currentPiece.x = 0;
        player.currentPiece.y = 0;
        player.board[0] = Tiles.Z;
        player.board[1] = Tiles.Z;
        player.board[2] = Tiles.Z;
        player.board[10] = Tiles.Z;
        player.board[11] = Tiles.Z;
        player.board[12] = Tiles.Z;
        const hasCollision = player.hasElementCollision();
        expect(hasCollision).toBe(true);
    });

    test('Has element collision and loose', () => {
        player.currentPiece = new Piece(1);
        player.board[3] = Tiles.Z;
        player.board[4] = Tiles.Z;
        player.board[5] = Tiles.Z;
        player.board[13] = Tiles.Z;
        player.board[14] = Tiles.Z;
        player.board[15] = Tiles.Z;
        const hasCollision = player.hasElementCollision();
        expect(hasCollision).toBe(true);
        player.sendCurrentBoard(ioMock);
        expect(player.status).toBe(PlayerStatus.LOST);
    });

    test('Has collision X', () => {
        player.currentPiece = new Piece(1);
        player.currentPiece.x = -1;
        const hasCollision = player.hasCollisionX();
        expect(hasCollision).toBe(true);
    });

    test('Has collision Y', () => {
        player.currentPiece = new Piece(1);
        player.currentPiece.y = 20;
        const hasCollision = player.hasCollisionY();
        expect(hasCollision).toBe(true);
    });

    test('Is row completed', () => {
        const row = Array(10).fill(Tiles.Z);
        const isCompleted = player.isRowCompleted(row);
        expect(isCompleted).toBe(true);
    });

    test('Count completed rows', () => {
        player.board = Array(200).fill(Tiles.Z);
        const completedRows = player.countCompletedRows();
        expect(completedRows).toBe(20);
    });

    test('Delete a completed row', () => {
        player.board = Array(200).fill(Tiles.Z);
        player.deleteACompletedRow();
        expect(player.board.slice(0, 10).every(tile => tile === Tiles.EMPTY)).toBe(true);
        expect(player.level).toBe(1);
    });

    test('Is row blocked', () => {
        const row = Array(10).fill(Tiles.BLOCKED);
        const isBlocked = player.isRowBlocked(row);
        expect(isBlocked).toBe(true);
    });

    test('Block a row', () => {
        player.board = Array(200).fill(Tiles.EMPTY);
        player.blockARow();
        expect(player.board.slice(190, 200).every(tile => tile === Tiles.BLOCKED)).toBe(true);
    });

    test('Move current piece', () => {
        player.currentPiece = new Piece(1);
        const hasReachBottom = player.moveCurrentPiece(1, 1, 0);
        expect(hasReachBottom).toBe(false);
    });

    test('Move current piece with element collision', () => {
        player.currentPiece = new Piece(1);
        player.currentPiece.x = 0;
        player.currentPiece.y = 0;
        player.currentPiece.type = piecesArray[0].type;
        player.currentPiece.shape = PiecesShapes[player.currentPiece.type];
        player.needANewPiece = false;
        player.board[0] = Tiles.Z;
        player.board[1] = Tiles.Z;
        player.board[2] = Tiles.Z;
        player.board[10] = Tiles.Z;
        player.board[11] = Tiles.Z;
        player.board[12] = Tiles.Z;
        const hasReachBottom = player.moveCurrentPiece(1, 1, 0);
        expect(hasReachBottom).toBe(true);
    });

    test('Move current piece with x', () => {
        player.currentPiece = new Piece(1);
        player.needANewPiece = false;
        const hasReachBottom = player.moveCurrentPiece(10, 0, 0);
        expect(hasReachBottom).toBe(false);
    });

    test('Move current piece with y', () => {
        player.currentPiece = new Piece(1);
        player.needANewPiece = false;
        const hasReachBottom = player.moveCurrentPiece(0, 18, 0);
        expect(hasReachBottom).toBe(false);
    });

    test('Lock the piece', () => {
        player.currentPiece = new Piece(1);
        player.lockThePiece();
        expect(player.needANewPiece).toBe(true);
    });

    test('Render temporary board', () => {
        player.currentPiece = new Piece(1);
        const tempBoard = player.renderTemporaryBoard();
        expect(tempBoard.length).toBe(200);
    });

    test('Periodic movement down', () => {
        player.updatedTime = Date.now() - 1000;
        player.speed = { speed: 500 };
        player.currentPiece = new Piece(1);
        const event = player.periodicMovementDown();
        expect(event.hasReachBottom).toBe(false);
    });

    test('Send current board', () => {
        player.currentPiece = new Piece(1);
        player.sendCurrentBoard(ioMock);
        expect(ioMock.to).toHaveBeenCalledWith('socket123');
        expect(ioMock.emit).toHaveBeenCalledWith('current_board', { board: expect.any(Array) });
    });

    test('Send next piece', () => {
        player.nextPiece = new Piece(1);
        player.sendNextPiece(ioMock);
        expect(ioMock.to).toHaveBeenCalledWith('socket123');
        expect(ioMock.emit).toHaveBeenCalledWith('next_piece', { piece: player.nextPiece });
    });
});
