const { Game } = require('./Game');
const { Player } = require('./Player');
const { Piece } = require('./Piece');
const { GameStatus } = require('../enums/GameStatus');
const { PlayerStatus } = require('../enums/PlayerStatus');
const {Tiles} = require("../enums/Tiles");


describe('Game', () => {
    let game;
    let ioMock;

    beforeEach(() => {
        ioMock = {
            to: jest.fn().mockReturnThis(),
            emit: jest.fn(),
        };
        game = new Game('room1');
    });

    test('Constructor initializes game correctly', () => {
        expect(game.roomName).toBe('room1');
        expect(game.players).toEqual([]);
        expect(game.status).toBe(GameStatus.WAITING);
        expect(game.pieceIndex).toBe(0);
        expect(game.pieces.length).toBe(10);
        expect(game.gameInterval).toBeNull();
        expect(game.speed).toEqual({ speed: 1000 });
        expect(game.initialTime).toBeNull();
        expect(game.isMultuPlayers).toBe(false);
    });

    test('Destroy clears game interval', () => {
        game.gameInterval = setInterval(() => {}, 1000);
        game.destroy();
        expect(game.gameInterval).toBeNull();
    });

    test('Add player adds a player and promotes a master if missing', () => {
        const player = new Player('Léo', 'socket123');
        game.addPlayer(player);
        expect(game.players).toContain(player);
        expect(player.isMaster).toBe(true);
    });

    test('Username exists returns true if username exists', () => {
        const player = new Player('Léo', 'socket123');
        game.players.push(player);
        expect(game.usernameExists('Léo')).toBe(true);
    });

    test('Socket ID exists returns true if socket ID exists', () => {
        const player = new Player('Léo', 'socket123');
        game.players.push(player);
        expect(game.socketIdExists('socket123')).toBe(true);
    });

    test('Get player by socket ID returns the correct player', () => {
        const player = new Player('Léo', 'socket123');
        game.players.push(player);
        expect(game.getPlayerBySocketId('socket123')).toBe(player);
    });

    test('Remove player removes the player and promotes a master if missing', () => {
        const player1 = new Player('Léo', 'socket123');
        const player2 = new Player('Alice', 'socket456');
        game.players.push(player1, player2);
        game.removePlayer('socket123');
        expect(game.players).not.toContain(player1);
        expect(player2.isMaster).toBe(true);
    });

    test('Send updated players list emits the players list', () => {
        game.sendUpdatedPlayersList(ioMock);
        expect(ioMock.to).toHaveBeenCalledWith('room1');
        expect(ioMock.emit).toHaveBeenCalledWith('update_players', game.players);
    });

    test('Send game status emits the game status', () => {
        game.sendGameStatus(ioMock);
        expect(ioMock.to).toHaveBeenCalledWith('room1');
        expect(ioMock.emit).toHaveBeenCalledWith('game_status', { status: game.status });
    });

    test('Promote a master if missing promotes the first player to master', () => {
        const player = new Player('Léo', 'socket123');
        game.players.push(player);
        game.promoteAMasterIfMissing();
        expect(player.isMaster).toBe(true);
    });

    test('Is master returns true if the player is master', () => {
        const player = new Player('Léo', 'socket123');
        player.isMaster = true;
        game.players.push(player);
        expect(game.isMaster('socket123')).toBe(true);
    });

    test('Get next piece returns the next piece', () => {
        const piece = game.getNextPiece(0);
        expect(piece).toBe(game.pieces[0]);
    });

    test('Block row for others players blocks a row for all players except the given one', () => {
        const player1 = new Player('Léo', 'socket123');
        const player2 = new Player('Alice', 'socket456');
        game.players.push(player1, player2);
        game.bockRowForOthersPlayers('Léo');
        expect(player2.board.slice(190, 200).every(tile => tile === Tiles.BLOCKED)).toBe(true);
    });

    test('Is game finished returns true if the game is finished', () => {
        const player = new Player('Léo', 'socket123');
        player.status = PlayerStatus.LOST;
        game.players.push(player);
        expect(game.isGameFinished()).toBe(true);
    });

    test('Set the winner status', () => {
        const player1 = new Player('Léo', 'socket123');
        const player2 = new Player('Alice', 'socket456');
        player1.status = PlayerStatus.LOST;
        player2.status = PlayerStatus.PLAYING;
        game.players.push(player1);
        game.players.push(player2);
        game.isMultyPlayers = true;
        game.setTheWinner(ioMock);
        expect(game.players[0].status).toBe(PlayerStatus.LOST);
        expect(game.players[1].status).toBe(PlayerStatus.WON);
    });

    test('Terminate game terminates the game', () => {
        const player = new Player('Léo', 'socket123');
        game.players.push(player);
        game.terminateGame(ioMock);
        expect(game.status).toBe(GameStatus.FINISHED);
        expect(player.currentPiece).toBe(null);
        expect(ioMock.emit).toHaveBeenCalledWith('game_status', { status: GameStatus.FINISHED });
    });

    test('Initiate players initializes players', () => {
        const player = new Player('Léo', 'socket123');
        game.players.push(player);
        game.speed = {speed: 100};
        game.initiatePlayers(ioMock);
        expect(player.updatedTime).not.toBe(null);
        expect(player.speed.speed).toBe(100);
        expect(player.currentPiece).not.toBe(null);
    });

    test('Launch game starts the game', () => {
        const result = game.launchGame();
        expect(result).toBe(true);
        expect(game.status).toBe(GameStatus.STARTED);
    });

    test('Single player game logic handles piece and movement logic', async () => {
        const player = new Player('Léo', 'socket123');
        game.players.push(player);
        const event = await game.singlePlayerGameLogic(ioMock, player);
        expect(event.hasReachBottom).toBe(false);
    });

    test('Hard drop performs a hard drop', async () => {
        const player = new Player('Léo', 'socket123');
        player.currentPiece = new Piece(1);
        game.players.push(player);
        await game.hardDrop(ioMock, player);
        expect(player.currentPiece.hardDrop).toBe(true);
    });

    test('Update speed updates the game speed based on player levels 550', () => {
        const player = new Player('Léo', 'socket123');
        player.level = 15;
        game.players.push(player);
        game.updateSpeed();
        expect(game.speed.speed).toBe(550);
    });

    test("Change speed to 400", () => {
        const player = new Player('Léo', 'socket123');
        player.level = 21;
        game.players.push(player);
        game.updateSpeed();
        expect(game.speed.speed).toBe(400);
    });

    test("Change speed to 1000", () => {
        const player = new Player('Léo', 'socket123');
        player.level = 4;
        game.players.push(player);
        game.updateSpeed();
        expect(game.speed.speed).toBe(1000);
    });

    test("Change speed to 850", () => {
        const player = new Player('Léo', 'socket123');
        player.level = 6;
        game.players.push(player);
        game.updateSpeed();
        expect(game.speed.speed).toBe(850);
    });

    test("Change speed to 700", () => {
        const player = new Player('Léo', 'socket123');
        player.level = 12;
        game.players.push(player);
        game.updateSpeed();
        expect(game.speed.speed).toBe(700);
    });


    test("single player logic ask for a new piece", async () => {
        const player = new Player('Léo', 'socket123');
        player.status = PlayerStatus.PLAYING;
        player.needANewPiece = true;
        game.players.push(player);
        game.initiatePlayers(ioMock);
        const event = await game.singlePlayerGameLogic(ioMock, player);
        expect(player.needANewPiece).toBe(false);
    });

    test("single player logic", async () => {
        const player = new Player('Léo', 'socket123');
        player.status = PlayerStatus.PLAYING;
        game.players.push(player);
        game.initiatePlayers(ioMock);
        player.board = [
            ...Array.from({ length: 10 * 19 }, (_, index) => Tiles.EMPTY),
            ...Array.from({ length: 10 * 1 }, (_, index) => Tiles.I)
        ]
        let event;
        for (let i = 0; i < 20; i++) {
            event = await game.singlePlayerGameLogic(ioMock, player);
            if (event.hasReachBottom || event.blockedRow !== 0) {
                console.log('out');
                break;
            }
        }
        expect(event.blockedRow).toBe(0);
    });


});
