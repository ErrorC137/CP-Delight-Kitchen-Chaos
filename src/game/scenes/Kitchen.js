export default class KitchenScene extends Phaser.Scene {
  constructor() {
    super('Kitchen');
    this.lastDirection = 'down';
  }

  preload() {
    // Chef sprite loading should be in Boot scene
  }

  create() {
    // Initialize physics
    this.physics.world.setBounds(0, 0, 2048, 1536);
    
    // Create chef - moved inside create()
    this.chef = this.physics.add.sprite(512, 384, 'chef');
    this.chef.setCollideWorldBounds(true);
    
    // Camera setup
    this.cameras.main.setBounds(0, 0, 2048, 1536);
    this.cameras.main.startFollow(this.chef, true, 0.08, 0.08);
    
    // Input handling
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (!this.chef || !this.cursors) return;

    const speed = 200;
    const velocity = new Phaser.Math.Vector2();
    
    // Movement logic
    if (this.cursors.left.isDown) velocity.x -= 1;
    if (this.cursors.right.isDown) velocity.x += 1;
    if (this.cursors.up.isDown) velocity.y -= 1;
    if (this.cursors.down.isDown) velocity.y += 1;

    velocity.normalize().scale(speed);
    this.chef.setVelocity(velocity.x, velocity.y);

    // Animation handling
    if (velocity.length() > 0) {
      this.chef.anims.play(`walk_${this.lastDirection}`, true);
    } else {
      this.chef.anims.stop();
      this.setIdleFrame();
    }
  }

  setIdleFrame() {
    const frameMap = { down: 0, up: 5, right: 10, left: 15 };
    this.chef.setFrame(frameMap[this.lastDirection]);
  }
}
