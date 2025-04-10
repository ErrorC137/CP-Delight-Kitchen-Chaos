import Phaser from 'phaser';

export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
    this.hasAudioContext = false;
  }

  preload() {
    // Set base URL for assets (matches GitHub Pages structure)
    this.load.setBaseURL('./assets/');
    
    // Create loading screen
    this.createLoadingScreen();

    // Error handling
    this.load.on('loaderror', (file) => {
      console.error('Failed to load:', file.key);
      this.handleLoadError(file);
    });

    // Load assets
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
    this.add.rectangle(width / 2, height / 2 + 25, 320, 30, 0x222222, 0.8)
      .setOrigin(0.5);

    // Progress bar
    const progressBar = this.add.rectangle(
      width / 2 - 150, 
      height / 2 + 25, 
      0, 30, 0xffffff, 1
    ).setOrigin(0, 0.5);

    this.load.on('progress', (value) => {
      progressBar.width = 300 * value;
    });
  }

  loadAssets() {
    try {
      // Load spritesheets with frame validation
      this.load.spritesheet('player', 'sprites/kitchen/player.png', {
        frameWidth: 32,
        frameHeight: 32,
        endFrame: 15
      });

      this.load.spritesheet('chef_red', 'sprites/chefs/chef_red.png', {
        frameWidth: 64,
        frameHeight: 64,
        endFrame: 19
      });

      // Kitchen assets
      this.load.image('counter', 'sprites/kitchen/counter.png');
      this.load.image('fryer', 'sprites/kitchen/appliance_fryer.png');
      this.load.image('kitchen_tiles', 'sprites/kitchen/kitchen_tiles.png');
      this.load.image('ingredient_chicken', 'sprites/kitchen/ingredient_chicken.png');
      this.load.image('fire', 'sprites/kitchen/fire.png');

      // UI elements
      this.load.image('timer_bg', 'sprites/ui/timer_background.png');
      this.load.image('order_ticket', 'sprites/ui/order_ticket.png');
      this.load.image('button_play', 'sprites/ui/button_play.png');

      // Audio with fallback
      this.load.audio('sizzle', [
        'audio/sfx/sizzle.mp3',
        'audio/sfx/sizzle.ogg'
      ]);
      this.load.audio('bell', [
        'audio/sfx/bell.mp3',
        'audio/sfx/bell.ogg'
      ]);

      // Level data
      this.load.json('level1', 'config/level1.json');

      // Fallback texture
      this.textures.addBase64('missing', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

    } catch (error) {
      console.error('Critical asset error:', error);
      this.scene.start('Error', { message: 'Failed to load game assets' });
    }
  }

  create() {
    // Create animations
    this.createAnimations();

    // Audio context unlock
    this.setupAudio();

    // Start game scenes
    this.scene.start('Kitchen');
    this.scene.launch('HUD');
  }

  createAnimations() {
    // Player animations
    this.anims.create({
      key: 'player_walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Chef animations
    ['down', 'up', 'right', 'left'].forEach((direction, index) => {
      this.anims.create({
        key: `chef_walk_${direction}`,
        frames: this.anims.generateFrameNumbers('chef_red', {
          start: index * 5,
          end: index * 5 + 4
        }),
        frameRate: 10,
        repeat: -1,
        yoyo: true
      });
    });

    // Fire animation
    this.anims.create({
      key: 'fire_anim',
      frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
  }

  setupAudio() {
    const handleUserGesture = () => {
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume().then(() => {
          this.hasAudioContext = true;
          console.log('Audio context resumed');
        });
      }
      document.removeEventListener('click', handleUserGesture);
      document.removeEventListener('touchend', handleUserGesture);
    };

    // Initial attempt
    handleUserGesture();

    // Fallback for mobile
    document.addEventListener('click', handleUserGesture);
    document.addEventListener('touchend', handleUserGesture);

    // Audio settings
    this.sound.pauseOnBlur = false;
    this.sound.volume = 0.5;
  }

  handleLoadError(file) {
    if (file.type === 'image') {
      console.warn(`Using fallback texture for ${file.key}`);
      this.textures.addBase64(file.key, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
  }
}
