const {Piece} = require('./Piece.js');
const {GameStatus} = require('../enums/GameStatus.js');
const {PlayerStatus} = require("../enums/PlayerStatus");
const {MovementsPositions} = require('../enums/Movements.js');

/**
 * @namspace Server
 */

/**
 * Main class, used to handle an entire game.
 */
class Game {

    /**
     * Initialise a new game with its name.
     * @param roomName
     */
    constructor(roomName) {
        this.roomName = roomName;
        this.players = [];
        this.status = GameStatus.WAITING;
        this.pieceIndex = 0;
        this.pieces = Array.from({ length: 10 }, (_, index) => new Piece(index));
        this.gameInterval = null;
        this.speed = {speed: 1000};
        this.initialTime = null;
        this.isMultuPlayers = false;
    }

    /**
     * Clear interval.
     */
    destroy() {
        clearInterval(this.gameInterval);
        this.status = GameStatus.WAITING;
        this.gameInterval = null;
    }

    /**
     * Add the player to the game.
     * @param player Player element.
     */
    addPlayer(player) {
        this.players.push(player);
        this.promoteAMasterIfMissing();
    }

    /**
     * check if the username is used by another user.
     * @param username The username to check.
     * @returns {boolean}
     */
    usernameExists(username) {
        const players = this.players.filter(player => player.username === username);
        return (players.length !== 0);
    }

    /**
     * Check if the socket id is used by another user.
     * @param socketId The socket id to check.
     * @returns {boolean}
     */
    socketIdExists(socketId) {
        const players = this.players.filter(player => player.socketId === socketId);
        return (players.length !== 0);
    }

    /**
     * Get a player by its socket id.
     * @param socketId The socket id.
     * @returns {*}
     */
    getPlayerBySocketId(socketId) {
        const player = this.players.find(player => player.socketId === socketId);
        return player;
    }

    /**
     * Delete a player from the current game.
     * @param socketId The player socket id.
     */
    removePlayer(socketId) {
        this.players = this.players.filter(player => player.socketId !== socketId);
        this.promoteAMasterIfMissing();
    }

    /**
     * Send to current players the new list of players.
     * @param io The socket io.
     */
    sendUpdatedPlayersList(io) {
        io.to(this.roomName).emit('update_players', this.players)
    }

    /**
     * Send to current players the new game status.
     * @param io The socket io.
     */
    sendGameStatus(io) {
        io.to(this.roomName).emit('game_status', {status:this.status})
    }

    /**
     * If a master is missing promote the first player in the current
     * game to master.
     */
    promoteAMasterIfMissing() {
        const masters = this.players.filter(player => player.isMaster);
        if (!(Array.isArray(masters) && masters.length !== 0)) {
            if (Array.isArray(this.players) && this.players.length !==0) {
                const firstPlayer = this.players[0];
                firstPlayer.switchMasterStatus(true);
            }
        }
    }

    /**
     * Check if the player, with its socket id, is the master of the current game.
     * @param socketId The player socket id.
     * @returns {*}
     */
    isMaster(socketId) {
        const player = this.players.find(player => player.socketId === socketId);
        return (player ? player.isMaster : false);
    }

    /**
     * Get the next piece to play based on the current index.
     * Add more pieces to the list if needed.
     * @param index The current piece index.
     * @returns {*}
     */
    getNextPiece(index) {
        if (index >= this.pieces.length) {
            this.pieces.push(...Array.from({ length: 10 }, (_, index) => new Piece(index)));
        }
        return this.pieces[index];
    }

    /**
     * Block a row for each player of the game but not the one identified by its username.
     * @param username The player username to not block.
     */
    bockRowForOthersPlayers(username) {
        this.players.forEach(player => {
            if (player.username !== username) {
                player.blockARow();
            }
        });
    }

    /**
     * Check if the game is finished.
     * If the game is played in multiplayer, wait until only one player has the PLAYING status.
     * Otherwise, check if the current player has the LOST status.
     * @returns {boolean}
     */
    isGameFinished() {
        if (!this.isMultyPlayers && this.players[0].status === PlayerStatus.LOST) {
            return true;
        } else if (this.isMultyPlayers) {
            const playingPlayers = this.players.filter(player => player.status === PlayerStatus.PLAYING);
            return playingPlayers.length === 1;
        }
        return false;
    }

    /**
     * Set the winner and notify each player.
     * @param io The socket io.
     */
    setTheWinner(io) {
        if (this.isMultyPlayers) {
            const winner = this.players.find(player => player.status === PlayerStatus.PLAYING);
            winner.changeStatusAndNotify(PlayerStatus.WON, io);
        }
    }

    /**
     * Stop properly the game.
     * @param io The socket io.
     * @param hasError If the game has error.
     */
    terminateGame(io, hasError = false) {
        this.status = GameStatus.FINISHED;
        if (!hasError) {
            this.setTheWinner(io);
        }
        this.sendGameStatus(io);
        this.players.forEach(player => player.reset());
        clearInterval(this.gameInterval);
    }

    /**
     * Initialise players and game properly.
     * @param io The socket io.
     */
    initiatePlayers(io) {
        const initialTime = Date.now();
        this.initialTime = initialTime;
        this.players.forEach(player => {
            player.setInitialTime(initialTime);
            player.setInitialSpeed(this.speed);
            player.setInitialPieces(this.pieces[0].copy(), this.pieces[1].copy());
            player.sendNextPiece(io);
            player.status = PlayerStatus.PLAYING;
            player.sendCurrentBoard(io);
        });
        this.sendUpdatedPlayersList(io);
    }

    /**
     * Start the game.
     * @returns {boolean}
     */
    launchGame() {
        if (this.status !== GameStatus.STARTED) {
            this.isMultyPlayers = this.players.length > 1;
            this.status = GameStatus.STARTED;
            this.pieces = Array.from({ length: 10 }, (_, index) => new Piece(index));
            return true;
        } else {
            return false;
        }
    }

    /**
     * Manage a single action for a specific player.
     * @param io The socket io.
     * @param player the player to manage.
     * @param isPeriodic is the function used in a periodic logic (recurrent down mvt).
     * @param direction the current direction to apply.
     * @returns {Promise<{hasReachBottom: boolean, blockedRow: number}>}
     */
    async singlePlayerGameLogic(io, player, isPeriodic = true, direction = null) {
        let event = {hasReachBottom: false, blockedRow: 0};
        // Only interact with playing players.
        if (player.status === PlayerStatus.PLAYING) {
            // Distribute a new piece if needed.
            if (player.needANewPiece) {
                const nextPiece = this.getNextPiece(player.pieceId + 1);
                player.newPiece(nextPiece.copy(), player.pieceId + 1);
                player.sendCurrentBoard(io);
                player.sendNextPiece(io);
            }

            // Apply movement to the player current piece.
            if (isPeriodic) {
                event = player.periodicMovementDown();
            } else {
                event = player.moveCurrentPieceWrapper(direction);
            }

            player.sendCurrentBoard(io);

            // Block rows for others if the player win a row.
            if (event.blockedRow > 0) {
                player.addScore(event.blockedRow);
            }
            for (let i = 0; i < event.blockedRow; i++) {
                this.bockRowForOthersPlayers(player.username);
                player.deleteACompletedRow();
                player.sendCurrentBoard(io);
                await new Promise(r => setTimeout(r, 10));
            }
        }
        return event;
    }

    /**
     * Handle a hard drop for a specific player.
     * @param io The socket io.
     * @param player The player to manage.
     * @returns {Promise<void>}
     */
    async hardDrop(io, player) {
        let event = {hasReachBottom: false, blockedRow: 0};
        player.setHardDrop();
        // Loop max 20 times as the board is 20 tiles high.
        for (let i = 0; i < 20; i++) {
            event = await this.singlePlayerGameLogic(io, player, false, MovementsPositions.DOWN);
            await new Promise(r => setTimeout(r, 10));
            if (event.hasReachBottom) {
                break;
            }
        }
    }

    /**
     * Update speed based on the highest score.
     */
    updateSpeed() {
        const highestLevel = Math.max(...this.players.map(player => player.level));
        if (highestLevel < 5) {
            this.speed.speed = 1000;
        } else if (highestLevel < 10) {
            this.speed.speed = 850;
        } else if (highestLevel < 15) {
            this.speed.speed = 700;
        } else if (highestLevel < 20){
            this.speed.speed = 550;
        } else {
            this.speed.speed = 400;
        }
    }

    /**
     * Manage the game loop logic.
     * @param io The socket io.
     */
    gameLoop(io) {
        this.initiatePlayers(io);
        this.gameInterval = setInterval(() => {
            if (this.status === GameStatus.STARTED) {
                try {
                    // Update speed and move players current pieces to one tile down.
                    this.updateSpeed();
                    this.players.forEach((player) => {
                        this.singlePlayerGameLogic(io, player);
                    });

                    // Handle lost and end of the game.
                    this.sendUpdatedPlayersList(io);
                    if (this.isGameFinished()) {
                        this.terminateGame(io);
                    }

                } catch {
                    // Clean the current game correctly.
                    this.terminateGame(io, true);
                }
            }
        }, 300);
    }

}

module.exports = {Game};