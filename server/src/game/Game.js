const {User} =require('./User.js');
class Game {
    constructor(roomName) {
        this.roomName = roomName;
        this.users = [];
        this.master = null;
    }

    addUser(user) {
        this.users.push(user);
        console.log(this.users);
    }

    removeUser(socketId) {
        this.users = this.users.filter(u => u.socketId !== socketId);
        console.log('by by user');
    }

    sendUpdatedUsersList(io) {
        io.to(this.roomName).emit('update_users', this.users)
    }

}

module.exports = {Game};