class Player {
    constructor(username, socketId) {
        this.username = username;
        this.socketId = socketId;
        this.isMaster = false;
    }

    switchMasterStatus(status) {
        this.isMaster = status;
    }
}

module.exports = {Player};