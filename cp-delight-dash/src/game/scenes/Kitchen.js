export default class KitchenScene extends Phaser.Scene {
    constructor() {
      super('Kitchen');
    }
  
    preload() {
      this.load.spritesheet('chef', '/assets/sprites/chefs/main_chef.png', {
        frameWidth: 64,
        frameHeight: 64,
        endFrame: 19 // Total frames - 1
      });
    }
  
    create() {
      this.chef = this.physics.add.sprite(512, 384, 'chef');
      this.cursors = this.input.keyboard.createCursorKeys();
  
      // Create animations for each direction
      this.anims.create({
        key: 'walk_down',
        frames: this.anims.generateFrameNumbers('chef', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
      });
  
      this.anims.create({
        key: 'walk_up',
        frames: this.anims.generateFrameNumbers('chef', { start: 5, end: 9 }),
        frameRate: 10,
        repeat: -1
      });
  
      this.anims.create({
        key: 'walk_right',
        frames: this.anims.generateFrameNumbers('chef', { start: 10, end: 14 }),
        frameRate: 10,
        repeat: -1
      });
  
      this.anims.create({
        key: 'walk_left',
        frames: this.anims.generateFrameNumbers('chef', { start: 15, end: 19 }),
        frameRate: 10,
        repeat: -1
      });
  
      this.cameras.main.startFollow(this.chef);
    }
  
    update() {
      const speed = 200;
      this.chef.setVelocity(0);
  
      // Handle diagonal movement priority
      if (this.cursors.left.isDown) {
        this.chef.setVelocityX(-speed);
        this.chef.anims.play('walk_left', true);
      } else if (this.cursors.right.isDown) {
        this.chef.setVelocityX(speed);
        this.chef.anims.play('walk_right', true);
      }
  
      if (this.cursors.up.isDown) {
        this.chef.setVelocityY(-speed);
        this.chef.anims.play('walk_up', true);
      } else if (this.cursors.down.isDown) {
        this.chef.setVelocityY(speed);
        this.chef.anims.play('walk_down', true);
      }
  
      // Stop animation when no movement
      if (this.chef.body.velocity.x === 0 && this.chef.body.velocity.y === 0) {
        this.chef.anims.stop();
        // Set to idle frame (first frame of down direction)
        this.chef.setFrame(0);
      }
    }
  }