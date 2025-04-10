import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    // Set asset path for GitHub Pages
    this.load.setBaseURL('./assets/');

    // Visual loading UI
    this.createLoadingScreen();

    // Global error handler for assets
    this.load.on('loaderror', (file) => {
      console.error(`Failed to load asset: ${file.key}`);
      this.handleLoadError(file);
    });

    // Load everything
    this.loadAssets();
  }

  createLoadingScreen() {
    const { width, height } = this.sys.game.config;

    // Loading text
    this.add.text(width / 2, height / 2 - 40, 'Loading Kitchen...', {
      font: '24px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Progress bar background
    this.add.rectangle(width / 2, height / 2 + 25, 320, 30, 0x222222, 0.8).setOrigin(0.5);

    // Progress bar
    const progressBar = this.add.rectangle(width / 2 - 150, height / 2 + 25, 0, 30, 0xffffff)
      .setOrigin(0, 0.5);

    // Dynamic width update
    this.load.on('progress', (value) => {
      progressBar.width = 300 * value;
    });
  }

  loadAssets() {
    // Tileset + tilemap
    this.load.image('kitchen_tiles', 'sprites/kitchen/kitchen_tiles.png');
    this.load.tilemapTiledJSON('level1', 'config/level1.json');

    // Player sprite
    this.load.spritesheet('player', 'sprites/chefs/chef_red.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    // Kitchen appliances + ingredients
    this.load.image('counter', 'sprites/kitchen/counter.png');
    this.load.image('fryer', 'sprites/kitchen/appliance_fryer.png');
    this.load.image('ingredient_chicken', 'sprites/kitchen/ingredient_chicken.png');

    // UI
    this.load.image('order_ticket', 'sprites/ui/order_ticket.png');
    this.load.image('timer_bg', 'sprites/ui/timer_background.png');

    // Audio
    this.load.audio('bell', 'audio/sfx/bell.mp3');
    this.load.audio('sizzle', 'audio/sfx/sizzle.mp3');

    // Fire sprite for disasters (placeholder)
    this.load.spritesheet('fire', 'sprites/kitchen/kitchen_tiles.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.createAnimations();
    this.scene.start('Kitchen');
    this.scene.launch('HUD');
  }

  createAnimations() {
    // Player walking
    this.anims.create({
      key: 'player_walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Fire animation used in disasters
    this.anims.create({
      key: 'fire_anim',
      frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1
    });
  }

  handleLoadError(file) {
    console.warn(`Falling back: ${file.key} (${file.type})`);
    if (file.type === 'image') {
      this.textures.addBase64(file.key, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
  }
}
