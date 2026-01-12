const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:8080", // Allow requests from the client
        methods: ["GET", "POST"]
    }
});

const userSockets = new Map();


// Servir les fichiers statiques de la SPA
app.use(express.static(path.join(__dirname, '../client/public')));



// Gérer les routes dynamiques pour les salles de chat
app.get(['/', '/home'], (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});



io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');
    const userId = socket.handshake.query.userId;
    userSockets.set(userId, socket.id);

    socket.on('join', ({ roomName, username }) => {
        socket.join(roomName);
        console.log(roomName + ' new user : ' + username);
        // io.to(roomName).emit('report_error', "test error");

        const socketId = userSockets.get(userId);
        if (socketId) {
            io.to(socketId).emit('report_error', { message: "test error " + username});
        }
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
        userSockets.delete(userId);
    });
});



// Démarrer le serveur
const PORT = 3004;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
