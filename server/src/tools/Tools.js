/**
 * Simple class to manage common notification functions and
 * string verifications.
 */
class Tools {
    constructor() {
        throw new Error("Tools is a static class and cannot be instantiated");
    }

    /**
     * Send error notification to the appropriate channel.
     * @param io The socket io.
     * @param roomName The room name.
     * @param topic The error topic.
     * @param message The message.
     */
    static  sendErrorNotification(io, roomName, topic, message) {
        io.to(roomName).emit('notify_error', {topic:topic, message:message});
    }

    /**
     * Send error notification with redirection  to / to the appropriate channel.
     * @param io The socket io.
     * @param roomName The room name.
     * @param topic The error topic.
     * @param message The message.
     */
    static sendErrorRedirection(io, roomName, topic, message) {
        io.to(roomName).emit('redirect_error', {topic:topic, message:message});
    }

    /**
     * Check if the given string is a valid room/player name:
     * alphanumeric only, between 3 and 20 characters.
     * @param string The string to check.
     * @returns {boolean}
     */
    static isAlphanumeric(string) {
        if (!string || string.length < 3 || string.length > 20) return false;
        return /^[a-zA-Z0-9]+$/.test(string);
    }
}

module.exports = {Tools};