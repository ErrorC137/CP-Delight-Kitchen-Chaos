import Phaser from 'phaser';
import KitchenScene from './scenes/Kitchen.js';

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
    arcade: { debug: false }
  },
  scene: [KitchenScene]
};

new Phaser.Game(config);
