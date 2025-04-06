const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../../public')));

// Game state
const gameState = {
  players: {},
  orders: [],
  hazards: []
};

io.on('connection', (socket) => {
  const playerId = uuidv4();
  
  console.log(`Player connected: ${playerId}`);
  gameState.players[playerId] = {
    x: 300,
    y: 400,
    anim: 'idle_down',
    carrying: null
  };

  // Send initial game state
  socket.emit('init', {
    playerId,
    level: require('../../public/assets/config/level1.json'),
    state: gameState
  });

  // Broadcast player movement
  socket.on('move', (data) => {
    if (!gameState.players[playerId]) return;
    
    gameState.players[playerId] = {
      ...gameState.players[playerId],
      x: data.x,
      y: data.y,
      anim: data.anim
    };
    
    socket.broadcast.emit('playerMoved', {
      playerId,
      ...data
    });
  });

  // Handle interactions
  socket.on('interact', (data) => {
    io.emit('interaction', {
      playerId,
      type: data.type,
      position: data.position
    });
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    delete gameState.players[playerId];
    io.emit('playerDisconnected', playerId);
    console.log(`Player disconnected: ${playerId}`);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});