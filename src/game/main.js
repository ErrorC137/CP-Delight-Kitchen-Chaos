import Phaser from 'phaser';
import Boot from './scenes/Boot.js';
import Kitchen from './scenes/Kitchen.js';
import HUD from './scenes/HUD.js';

// Game configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 2048,
  height: 1536,
  backgroundColor: '#000000',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [Boot, Kitchen, HUD]
};

// Initialize game instance
const game = new Phaser.Game(config);

// ⚡ FIX: Phaser’s 'ready' event doesn't exist — use DOMContentLoaded + Boot scene
window.addEventListener('load', () => {
  if (game.isBooted) {
    initializeSocketIO(game);
  } else {
    game.events.once('boot', () => {
      initializeSocketIO(game);
    });
  }
});

// ✅ WebSocket initializer
function initializeSocketIO(gameInstance) {
  try {
    const shouldInit =
      process.env.NODE_ENV === 'production' || process.env.ENABLE_SOCKETIO === 'true';

    if (!shouldInit) return;

    const socket = io('wss://your-game-server.com', {
      transports: ['websocket'],
      secure: true,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    gameInstance.registry.set('socket', socket);

    socket.on('connect', () => {
      console.log('Socket connected');
      const hud = gameInstance.scene.get('HUD');
      if (hud?.handleConnection) hud.handleConnection(true);
    });

    socket.on('disconnect', reason => {
      console.warn('Socket disconnected:', reason);
      const hud = gameInstance.scene.get('HUD');
      if (hud?.handleConnection) hud.handleConnection(false);
    });

    socket.on('connect_error', err => {
      console.error('Socket error:', err.message);
      const hud = gameInstance.scene.get('HUD');
      if (hud?.showNetworkError) hud.showNetworkError(err.message);
    });

    gameInstance.events.once('destroy', () => {
      socket.disconnect();
      gameInstance.registry.remove('socket');
    });
  } catch (err) {
    console.error('Socket.io init failed:', err);
    const hud = gameInstance.scene.get('HUD');
    if (hud?.showNetworkError) hud.showNetworkError('Socket disabled');
  }
}

// Debug Exposure
if (process.env.NODE_ENV === 'development') {
  window.game = game;
  window.__GAME__ = game;
}
