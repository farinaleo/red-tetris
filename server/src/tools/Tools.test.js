const { Tools } = require('./Tools');

describe('Tools', () => {

    // ─── Instantiation ───────────────────────────────────────────────────────

    describe('constructor', () => {
        it('should throw an error when instantiated', () => {
            expect(() => new Tools()).toThrow('Tools is a static class and cannot be instantiated');
        });
    });

    // ─── sendErrorNotification ───────────────────────────────────────────────

    describe('sendErrorNotification', () => {
        let io, emitMock, toMock;

        beforeEach(() => {
            emitMock = jest.fn();
            toMock = jest.fn().mockReturnValue({ emit: emitMock });
            io = { to: toMock };
        });

        it('should call io.to with the correct room name', () => {
            Tools.sendErrorNotification(io, 'room1', 'someTopic', 'someMessage');
            expect(toMock).toHaveBeenCalledWith('room1');
        });

        it('should emit the notify_error event', () => {
            Tools.sendErrorNotification(io, 'room1', 'someTopic', 'someMessage');
            expect(emitMock).toHaveBeenCalledWith('notify_error', {
                topic: 'someTopic',
                message: 'someMessage',
            });
        });

        it('should pass topic and message correctly in the payload', () => {
            Tools.sendErrorNotification(io, 'gameRoom', 'AUTH_ERROR', 'Invalid token');
            expect(emitMock).toHaveBeenCalledWith('notify_error', {
                topic: 'AUTH_ERROR',
                message: 'Invalid token',
            });
        });

        it('should handle empty strings for topic and message', () => {
            Tools.sendErrorNotification(io, 'room1', '', '');
            expect(emitMock).toHaveBeenCalledWith('notify_error', { topic: '', message: '' });
        });
    });

    // ─── sendErrorRedirection ────────────────────────────────────────────────

    describe('sendErrorRedirection', () => {
        let io, emitMock, toMock;

        beforeEach(() => {
            emitMock = jest.fn();
            toMock = jest.fn().mockReturnValue({ emit: emitMock });
            io = { to: toMock };
        });

        it('should call io.to with the correct room name', () => {
            Tools.sendErrorRedirection(io, 'room2', 'someTopic', 'someMessage');
            expect(toMock).toHaveBeenCalledWith('room2');
        });

        it('should emit the redirect_error event', () => {
            Tools.sendErrorRedirection(io, 'room2', 'someTopic', 'someMessage');
            expect(emitMock).toHaveBeenCalledWith('redirect_error', {
                topic: 'someTopic',
                message: 'someMessage',
            });
        });

        it('should pass topic and message correctly in the payload', () => {
            Tools.sendErrorRedirection(io, 'lobby', 'ACCESS_DENIED', 'You are not allowed here');
            expect(emitMock).toHaveBeenCalledWith('redirect_error', {
                topic: 'ACCESS_DENIED',
                message: 'You are not allowed here',
            });
        });

        it('should handle empty strings for topic and message', () => {
            Tools.sendErrorRedirection(io, 'room2', '', '');
            expect(emitMock).toHaveBeenCalledWith('redirect_error', { topic: '', message: '' });
        });
    });

    // ─── isAlphanumeric ──────────────────────────────────────────────────────

    describe('isAlphanumeric', () => {
        it('should return true for a lowercase alphabetic string', () => {
            expect(Tools.isAlphanumeric('hello')).toBe(true);
        });

        it('should return true for an uppercase alphabetic string', () => {
            expect(Tools.isAlphanumeric('HELLO')).toBe(true);
        });

        it('should return true for a numeric string', () => {
            expect(Tools.isAlphanumeric('12345')).toBe(true);
        });

        it('should return true for a mixed alphanumeric string', () => {
            expect(Tools.isAlphanumeric('Hello123')).toBe(true);
        });

        it('should return false for a string with spaces', () => {
            expect(Tools.isAlphanumeric('hello world')).toBe(false);
        });

        it('should return false for a string with special characters', () => {
            expect(Tools.isAlphanumeric('hello!')).toBe(false);
        });

        it('should return false for a string with hyphens', () => {
            expect(Tools.isAlphanumeric('hello-world')).toBe(false);
        });

        it('should return false for a string with underscores', () => {
            expect(Tools.isAlphanumeric('hello_world')).toBe(false);
        });

        it('should return false for an empty string', () => {
            expect(Tools.isAlphanumeric('')).toBe(false);
        });

        it('should return false for a string with accented characters', () => {
            expect(Tools.isAlphanumeric('héllo')).toBe(false);
        });
    });
});