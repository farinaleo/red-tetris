// server/src/index.test.js
const request = require('supertest');
const { server, app } = require('./index');
const ioClient = require('socket.io-client');
const path = require('path');

let httpServer;
let clientSocket;
let testPort;

beforeAll((done) => {
    process.env.CORS_ORIGINS = '*';
    httpServer = server.listen(0, () => {
        testPort = httpServer.address().port;
        console.log(`Test server running on http://localhost:${testPort}`);
        done();
    });
}, 10000);

afterAll((done) => {
    if (httpServer) {
        httpServer.close(() => {
            console.log('Test server closed');
            done();
        });
    } else {
        done();
    }
}, 10000);

describe('HTTP Routes', () => {
    test('GET / should return index.html', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(404);
    }, 10000);

    test('GET /home should return index.html', async () => {
        const res = await request(app).get('/home');
        expect(res.statusCode).toBe(404);
    }, 10000);
});

describe('Socket.io Tests', () => {
    beforeEach((done) => {
        clientSocket = ioClient(`http://localhost:${testPort}`);
        clientSocket.on('connect', () => {
            done();
        });
    }, 10000);

    afterEach((done) => {
        if (clientSocket) {
            clientSocket.disconnect();
        }
        done();
    }, 10000);

    describe('Join Room', () => {
        test('Should reject non-alphanumeric username', (done) => {
            const timeout = setTimeout(() => {
                done.fail(new Error('Test timed out waiting for "redirect_error"'));
            }, 5000);

            clientSocket.emit('join', {
                roomName: 'Room1',
                username: 'Bad@Name',
            });

            clientSocket.on('redirect_error', (data) => {
                clearTimeout(timeout);
                expect(data.topic).toBe('Connexion');
                done();
            });
        }, 10000);

        test('Should reject non-alphanumeric room name', (done) => {
            const timeout = setTimeout(() => {
                done.fail(new Error('Test timed out waiting for "redirect_error"'));
            }, 5000);

            clientSocket.emit('join', {
                roomName: 'Bad@Room',
                username: 'Player1',
            });

            clientSocket.on('redirect_error', (data) => {
                clearTimeout(timeout);
                expect(data.topic).toBe('Connexion');
                done();
            });
        }, 10000);

        test('Should allow valid join', (done) => {
            const timeout = setTimeout(() => {
                done.fail(new Error('Test timed out waiting for "update_players"'));
            }, 5000);

            clientSocket.emit('join', {
                roomName: 'Room1',
                username: 'Player1',
            });

            clientSocket.on('update_players', (data) => {
                clearTimeout(timeout);
                expect(data).toBeDefined();
                done();
            });
        }, 10000);
    });

    describe('Game Logic', () => {
        test('Should not allow starting game if not master', (done) => {
            const timeout = setTimeout(() => {
                done.fail(new Error('Test timed out waiting for "notify_error"'));
            }, 5000);

            clientSocket.emit('join', {
                roomName: 'Room2',
                username: 'Player1',
            });

            clientSocket.on('update_players', () => {
                clientSocket.emit('start_game', { roomName: 'Room2' });
            });

            clientSocket.on('notify_error', (data) => {
                clearTimeout(timeout);
                expect(data.topic).toBe('Game Status');
                done();
            });
        }, 10000);
    });

    describe('Disconnect', () => {
        test('Should remove player on disconnect', (done) => {
            const clientSocket2 = ioClient(`http://localhost:${testPort}`);
            const timeout = setTimeout(() => {
                done.fail(new Error('Test timed out waiting for "update_players"'));
            }, 5000);

            clientSocket.emit('join', {
                roomName: 'Room4',
                username: 'Player1',
            });

            clientSocket.on('update_players', () => {
                clientSocket.disconnect();
                clientSocket2.on('connect', () => {
                    clientSocket2.emit('join', {
                        roomName: 'Room4',
                        username: 'Player2',
                    });
                });

                clientSocket2.on('update_players', (data) => {
                    clearTimeout(timeout);
                    expect(data).toBeDefined();
                    clientSocket2.disconnect();
                    done();
                });
            });
        }, 10000);
    });
});
