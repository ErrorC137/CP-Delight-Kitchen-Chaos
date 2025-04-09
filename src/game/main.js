import Phaser from 'phaser';
import Boot from './scenes/Boot';
import Kitchen from './scenes/Kitchen';
import HUD from './scenes/HUD';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 2048, // Match level1.json dimensions
  height: 1536,
  pixelArt: true,
  scene: [Boot, Kitchen, HUD],
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  }
};

// Initialize game instance
const game = new Phaser.Game(config);

// Socket.io initialization and handling
game.events.once('ready', () => {
  // Create socket connection
  const socket = io('wss://your-game-server.com', {
    transports: ['websocket'],
    secure: true,
    reconnectionAttempts: 5,
    timeout: 10000
  });

  // Store socket in game registry
  game.registry.set('socket', socket);

  // Connection handlers
  socket.on('connect', () => {
    if (game.scene.isActive('HUD')) {
      game.scene.getScene('HUD').handleConnection(true);
    }
  });

  socket.on('disconnect', (reason) => {
    if (game.scene.isActive('HUD')) {
      game.scene.getScene('HUD').handleConnection(false);
      console.warn('Disconnected:', reason);
    }
  });

  socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
    game.scene.getScene('HUD').showNetworkError(err.message);
  });

  // Cleanup on game destroy
  game.events.on('destroy', () => {
    socket.disconnect();
    game.registry.remove('socket');
  });
});
