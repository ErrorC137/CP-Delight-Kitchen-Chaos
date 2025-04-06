export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    // Set base URL for assets
    this.load.setBaseURL('assets/');
    
    // Show loading progress
    const { width, height } = this.sys.game.config;
    const loadingText = this.add.text(width/2, height/2 - 40, 'Loading Kitchen...', { 
      font: '24px Arial', 
      fill: '#ffffff' 
    }).setOrigin(0.5);

    // Progress bar container
    const progressBox = this.add.graphics()
      .fillStyle(0x222222, 0.8)
      .fillRect(width/2 - 160, height/2, 320, 50);

    // Progress bar
    const progressBar = this.add.graphics();
    this.load.on('progress', (value) => {
      progressBar.clear()
        .fillStyle(0xffffff, 1)
        .fillRect(width/2 - 150, height/2 + 10, 300 * value, 30);
    });

    // Load assets
    this.loadAssets();
  }

  loadAssets() {
    try {
      // Chef Characters (4 directions, 5 frames each)
      this.load.spritesheet('chef_red', 'sprites/chefs/chef_red.png', {
        frameWidth: 64,
        frameHeight: 64,
        endFrame: 19 // 4 directions × 5 frames each = 20 frames (0-19)
      });

      // Kitchen Elements
      this.load.image('counter', 'sprites/kitchen/counter.png');
      this.load.image('fryer', 'sprites/kitchen/appliance_fryer.png');
      this.load.image('ingredient_chicken', 'sprites/kitchen/ingredient_chicken.png');

      // UI Elements
      this.load.image('timer_bg', 'sprites/ui/timer_background.png');
      this.load.image('order_ticket', 'sprites/ui/order_ticket.png');

      // Audio
      this.load.audio('sizzle', 'audio/sfx/sizzle.mp3');
      this.load.audio('bell', 'audio/sfx/bell.mp3');

      // Fallback texture
      this.textures.addBase64('missing', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

    } catch (error) {
      console.error('Asset loading error:', error);
      this.scene.start('Error');
    }
  }

  create() {
    // Create chef animations
    this.createAnimations();

    // Handle audio context unlock
    this.unlockAudioContext();

    // Start game scenes
    this.scene.start('Kitchen');
    this.scene.launch('HUD');
  }

  createAnimations() {
    // Chef walking animations
    ['down', 'up', 'right', 'left'].forEach((direction, index) => {
      this.anims.create({
        key: `chef_walk_${direction}`,
        frames: this.anims.generateFrameNumbers('chef_red', {
          start: index * 5,
          end: index * 5 + 4
        }),
        frameRate: 10,
        repeat: -1
      });
    });
  }

  unlockAudioContext() {
    const handleUserGesture = () => {
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }
      document.removeEventListener('click', handleUserGesture);
      document.removeEventListener('touchend', handleUserGesture);
    };

    document.addEventListener('click', handleUserGesture);
    document.addEventListener('touchend', handleUserGesture);
  }
}
