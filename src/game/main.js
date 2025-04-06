import Phaser from 'phaser';
import BootScene from './scenes/Boot.js';
import KitchenScene from './scenes/Kitchen.js';
import HUDScene from './scenes/HUD.js';

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
  scene: [BootScene, KitchenScene, HUDScene],
  dom: {
    createContainer: true
  },
  callbacks: {
    postBoot: (game) => {
      game.registry.set('socket', io('wss://your-game-server.com', { // Replace with actual WebSocket URL
        transports: ['websocket'],
        secure: true,
        reconnectionAttempts: 5
      }));
    }
  }
};

const game = new Phaser.Game(config);

// Handle socket events through scene system
game.events.on('ready', () => {
  const socket = game.registry.get('socket');
  
  socket.on('connect', () => {
    game.scene.getScene('HUD').handleConnection(true);
  });

  socket.on('disconnect', () => {
    game.scene.getScene('HUD').handleConnection(false);
  });
});
