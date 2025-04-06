import Phaser from 'phaser';
import BootScene from './scenes/Boot.js';
import KitchenScene from './scenes/Kitchen.js';
import HUDScene from './scenes/HUD.js';

// Initialize Socket.IO (using CDN version)
const socket = io('https://your-server-url.com'); // Replace with actual server URL

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
  }
};

// Global game reference
const game = new Phaser.Game(config);

// Socket.IO event handlers
socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
});

socket.on('disconnect', () => {
  game.scene.getScene('HUD').showDisconnectWarning();
});
