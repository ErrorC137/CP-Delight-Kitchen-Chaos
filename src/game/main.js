import Phaser from 'phaser';
import BootScene from './scenes/Boot.js';
import KitchenScene from './scenes/Kitchen.js';
import HUDScene from './scenes/HUD.js';
import io from 'socket.io-client'; // Make sure to import socket.io-client

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    width: 1024,
    height: 768
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
    roundPixels: true,
    powerPreference: 'high-performance'
  },
  textures: {
    generateMipMaps: false
  },
  scene: [BootScene, KitchenScene, HUDScene],
  dom: {
    createContainer: true
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
