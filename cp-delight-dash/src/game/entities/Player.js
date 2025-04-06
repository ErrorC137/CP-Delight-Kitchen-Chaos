export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'chef_red');
      
      scene.add.existing(this);
      scene.physics.add.existing(this);
      
      // Player configuration
      this.speed = 200;
      this.carrying = null;
      this.setCollideWorldBounds(true);
      
      // Input setup
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      
      // Animation setup
      this.createAnimations();
    }
  
    createAnimations() {
      const anims = this.scene.anims;
      
      ['down', 'up', 'right', 'left'].forEach((direction, index) => {
        anims.create({
          key: `walk_${direction}`,
          frames: anims.generateFrameNumbers('chef_red', {
            start: index * 5,
            end: index * 5 + 4
          }),
          frameRate: 10,
          repeat: -1
        });
      });
    }
  
    update() {
      // Movement handling
      const body = this.body;
      body.setVelocity(0);
  
      if (this.cursors.left.isDown) {
        body.setVelocityX(-this.speed);
        this.anims.play('walk_left', true);
      } else if (this.cursors.right.isDown) {
        body.setVelocityX(this.speed);
        this.anims.play('walk_right', true);
      }
  
      if (this.cursors.up.isDown) {
        body.setVelocityY(-this.speed);
        this.anims.play('walk_up', true);
      } else if (this.cursors.down.isDown) {
        body.setVelocityY(this.speed);
        this.anims.play('walk_down', true);
      }
  
      // Interaction handling
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        this.handleInteraction();
      }
    }
  
    handleInteraction() {
      if (this.carrying) {
        this.dropItem();
      } else {
        this.pickUpItem();
      }
    }
  
    pickUpItem() {
      const nearbyItems = this.scene.physics.overlapRect(
        this.x - 32, this.y - 32, 64, 64, true
      );
      
      if (nearbyItems.length > 0) {
        this.carrying = nearbyItems[0].gameObject;
        this.carrying.setVisible(false);
        this.scene.hud.updateObjective('Item collected!');
      }
    }
  
    dropItem() {
      this.carrying.setPosition(this.x, this.y);
      this.carrying.setVisible(true);
      this.carrying = null;
    }
  }