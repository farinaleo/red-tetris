const {Player} =require('./Player.js');
class Game {
    constructor(roomName) {
        this.roomName = roomName;
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
        console.log(this.players);
        this.promoteAMasterIfMissing();
    }

    removePlayer(socketId) {
        this.players = this.players.filter(player => player.socketId !== socketId);
        console.log('by by player');
        this.promoteAMasterIfMissing();
    }

    sendUpdatedPlayersList(io) {
        io.to(this.roomName).emit('update_players', this.players)
    }

    promoteAMasterIfMissing() {
        const masters = this.players.filter(player => player.isMaster);
        if (!(Array.isArray(masters) && masters.length !== 0)) {
            if (Array.isArray(this.players) && this.players.length !==0) {
                const firstPlayer = this.players[0];
                firstPlayer.switchMasterStatus(true);
            }
        }
        console.log(this.players);
    }

}

module.exports = {Game};