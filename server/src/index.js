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

const chatRooms = new Map();

// Servir les fichiers statiques de la SPA
app.use(express.static(path.join(__dirname, '../client/public')));



// Gérer les routes dynamiques pour les salles de chat
app.get(['/', '/home'], (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public', 'index.html'));
});



io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    socket.on('join', ({ channel }) => {
        socket.join(channel);
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});



// Démarrer le serveur
const PORT = 3004;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
