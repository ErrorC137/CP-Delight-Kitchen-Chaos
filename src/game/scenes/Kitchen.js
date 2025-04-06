export default class KitchenScene extends Phaser.Scene {
  constructor() {
    super('Kitchen');
    this.lastDirection = 'down';
  }

  preload() {
    // Load chef spritesheet with error handling
    this.load.spritesheet('chef', 'assets/sprites/chefs/main_chef.png', {
      frameWidth: 64,
      frameHeight: 64,
      endFrame: 19
    });
  }

  create() {
    // Initialize physics
    this.physics.world.setBounds(0, 0, 2048, 1536); // Set kitchen boundaries
    
    // Create chef character with physics
    this.chef = this.physics.add.sprite(512, 384, 'chef');
    this.chef.setCollideWorldBounds(true);
    
    // Set up camera
    this.cameras.main.setBounds(0, 0, 2048, 1536);
    this.cameras.main.startFollow(this.chef, true, 0.08, 0.08);
    
    // Input handling
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Animation checks
    if (!this.anims.exists('walk_down')) {
      console.error('Animations not found! Check Boot scene loading');
      this.scene.start('Boot');
    }
  }

  update() {
    if (!this.chef || !this.cursors) return;

    const speed = 200;
    const velocity = new Phaser.Math.Vector2();
    
    // Handle movement input
    if (this.cursors.left.isDown) {
      velocity.x -= 1;
      this.lastDirection = 'left';
    }
    if (this.cursors.right.isDown) {
      velocity.x += 1;
      this.lastDirection = 'right';
    }
    if (this.cursors.up.isDown) {
      velocity.y -= 1;
      this.lastDirection = 'up';
    }
    if (this.cursors.down.isDown) {
      velocity.y += 1;
      this.lastDirection = 'down';
    }

    // Normalize and scale velocity
    velocity.normalize().scale(speed);
    this.chef.setVelocity(velocity.x, velocity.y);

    // Handle animations
    if (velocity.length() > 0) {
      this.chef.anims.play(`walk_${this.lastDirection}`, true);
    } else {
      this.chef.anims.stop();
      this.setIdleFrame();
    }
  }

  setIdleFrame() {
    // Set idle frame based on last direction
    const frameMap = {
      down: 0,
      up: 5,
      right: 10,
      left: 15
    };
    this.chef.setFrame(frameMap[this.lastDirection]);
  }
}
