import Phaser from 'phaser';
import Boot from './scenes/Boot';
import Kitchen from './scenes/Kitchen';
import HUD from './scenes/HUD';

// Game configuration
const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 2048,
  height: 1536,
  pixelArt: true,
  scene: [Boot, Kitchen, HUD],
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
  }
};

// Initialize game instance
const game = new Phaser.Game(config);

// Socket.io initialization wrapper
function initializeSocketIO(gameInstance) {
  try {
    // Only initialize in production or if explicitly enabled
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_SOCKETIO === 'true') {
      const socket = io('wss://your-game-server.com', {
        transports: ['websocket'],
        secure: true,
        reconnectionAttempts: 5,
        timeout: 10000
      });

      // Store socket in game registry
      gameInstance.registry.set('socket', socket);

      // Connection handlers
      socket.on('connect', () => {
        console.log('Socket connected');
        if (gameInstance.scene.isActive('HUD')) {
          gameInstance.scene.get('HUD').handleConnection(true);
        }
      });

      socket.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
        if (gameInstance.scene.isActive('HUD')) {
          gameInstance.scene.get('HUD').handleConnection(false);
        }
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        if (gameInstance.scene.isActive('HUD')) {
          gameInstance.scene.get('HUD').showNetworkError(err.message);
        }
      });

      // Cleanup on game destroy
      gameInstance.events.once('destroy', () => {
        socket.disconnect();
        gameInstance.registry.remove('socket');
      });
    }
  } catch (error) {
    console.error('Socket.io initialization failed:', error);
    if (gameInstance.scene.isActive('HUD')) {
      gameInstance.scene.get('HUD').showNetworkError('Connection features disabled');
    }
  }
}

// Initialize socket when game is ready
game.events.once('ready', () => {
  initializeSocketIO(game);
});

// Export for debugging purposes
if (process.env.NODE_ENV === 'development') {
  window.game = game;
}

export { game };
