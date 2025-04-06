export default class Boot extends Phaser.Scene {
    constructor() {
      super({ key: 'Boot' });
    }
  
    preload() {
      // Show loading progress
      const { width, height } = this.sys.game.config;
      const loadingText = this.add.text(width/2, height/2 - 30, 'Loading...', { 
        font: '20px Arial', 
        fill: '#ffffff' 
      }).setOrigin(0.5);
      
      // Progress bar
      const progressBar = this.add.graphics();
      this.load.on('progress', (value) => {
        progressBar.clear();
        progressBar.fillStyle(0xFFFFFF, 1);
        progressBar.fillRect(
          width/2 - 150, 
          height/2, 
          300 * value, 
          20
        );
      });
  
      // Load assets
      this.loadAssets();
    }
  
    loadAssets() {
      // Chef Characters
      this.load.spritesheet('chef_red', '/assets/sprites/chefs/chef_red.png', {
        frameWidth: 64,
        frameHeight: 64,
        endFrame: 19
      });
  
      // Kitchen Elements
      this.load.image('counter', '/assets/sprites/kitchen/counter.png');
      this.load.image('fryer', '/assets/sprites/kitchen/appliance_fryer.png');
      this.load.image('ingredient_chicken', '/assets/sprites/kitchen/ingredient_chicken.png');
  
      // UI Elements
      this.load.image('timer_bg', '/assets/sprites/ui/timer_background.png');
      this.load.image('order_ticket', '/assets/sprites/ui/order_ticket.png');
  
      // Audio
      this.load.audio('sizzle', '/assets/audio/sfx_sizzle.wav');
      this.load.audio('bell', '/assets/audio/sfx_bell.wav');
    }
  
    create() {
      // Start next scene
      this.scene.start('Kitchen');
      this.scene.launch('HUD');
    }
  }