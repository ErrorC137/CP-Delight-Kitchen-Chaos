export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
    this.hasAudioContext = false;
  }

  preload() {
    // Set base URL for assets
    this.load.setBaseURL('assets/');
    
    // Show loading progress UI
    this.createLoadingScreen();

    // Configure file load error handling
    this.load.on('loaderror', (file) => {
      console.error('Failed to load:', file.key);
      this.handleLoadError(file);
    });

    // Load game assets
    this.loadAssets();
  }

  createLoadingScreen() {
    const { width, height } = this.sys.game.config;
    
    // Loading text
    this.add.text(width/2, height/2 - 40, 'Loading Kitchen...', { 
      font: '24px Arial', 
      fill: '#ffffff' 
    }).setOrigin(0.5);

    // Progress bar background
    this.add.graphics()
      .fillStyle(0x222222, 0.8)
      .fillRect(width/2 - 160, height/2, 320, 50);

    // Progress bar
    const progressBar = this.add.graphics();
    this.load.on('progress', (value) => {
      progressBar.clear()
        .fillStyle(0xffffff, 1)
        .fillRect(width/2 - 150, height/2 + 10, 300 * value, 30);
    });
  }

  loadAssets() {
    try {
      // Chef character with frame validation
      this.load.spritesheet('chef_red', 'sprites/chefs/chef_red.png', {
        frameWidth: 64,
        frameHeight: 64,
        endFrame: 19
      });

      // Kitchen assets with fallbacks
      this.loadAssetsWithFallback([
        { key: 'counter', path: 'sprites/kitchen/counter.png' },
        { key: 'fryer', path: 'sprites/kitchen/appliance_fryer.png' },
        { key: 'ingredient_chicken', path: 'sprites/kitchen/ingredient_chicken.png' }
      ]);

      // UI elements
      this.load.image('timer_bg', 'sprites/ui/timer_background.png');
      this.load.image('order_ticket', 'sprites/ui/order_ticket.png');

      // Audio with format fallback
      this.load.audio('sizzle', ['audio/sfx/sizzle.mp3', 'audio/sfx/sizzle.ogg']);
      this.load.audio('bell', ['audio/sfx/bell.mp3', 'audio/sfx/bell.ogg']);

      // Add fallback texture
      this.textures.addBase64('missing', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

    } catch (error) {
      console.error('Critical asset error:', error);
      this.scene.start('Error', { message: 'Failed to load game assets' });
    }
  }

  loadAssetsWithFallback(assets) {
    assets.forEach(({ key, path }) => {
      if (!this.textures.exists(key)) {
        this.load.image(key, path);
      }
    });
  }

  create() {
    // Create animations with validation
    this.createAnimations();

      const unlockAudio = () => {
    if (this.sound.context.state === 'suspended') {
      this.sound.context.resume();
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchend', unlockAudio);
  };

  // Initial unlock attempt
  unlockAudio();
  
  // User gesture fallback
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchend', unlockAudio);

  // Start game scenes
  this.scene.start('Kitchen');
  this.scene.launch('HUD');
  }

  createAnimations() {
    if (!this.textures.exists('chef_red')) return;

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
  }

  setupAudio() {
    const handleUserGesture = () => {
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume().then(() => {
          this.hasAudioContext = true;
        });
      }
      document.removeEventListener('click', handleUserGesture);
      document.removeEventListener('touchend', handleUserGesture);
    };

    // Initial attempt to unlock
    handleUserGesture();

    // Fallback user gesture handlers
    document.addEventListener('click', handleUserGesture);
    document.addEventListener('touchend', handleUserGesture);

    // Set audio preferences
    this.sound.pauseOnBlur = false;
    this.sound.volume = 0.5;
  }

  handleLoadError(file) {
    // Replace missing assets with fallback
    if (file.type === 'image') {
      this.textures.addBase64(file.key, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
    }
  }
}
