import { game } from './main.js';
export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.carrying = null;
        this.setCollideWorldBounds(true);
        
        // Pokémon-style movement
        this.createAnimations();
        this.setSize(16, 16).setOffset(8, 16);
    }

    createAnimations() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    }

    pickupItem(item) {
        if (!this.carrying) {
            this.carrying = item;
            item.setVisible(false);
            this.scene.physics.world.disableBody(item.body);
        }
    }

    dropItem() {
        if (this.carrying) {
            this.carrying.setVisible(true);
            this.carrying.body.enable = true;
            this.carrying = null;
        }
    }

    update(keys) {
        // Movement controls
        this.body.setVelocity(0);
        
        if (keys.left.isDown) {
            this.body.setVelocityX(-160);
            this.anims.play('walk', true);
            this.flipX = true;
        } else if (keys.right.isDown) {
            this.body.setVelocityX(160);
            this.anims.play('walk', true);
            this.flipX = false;
        }
        
        if (keys.up.isDown) {
            this.body.setVelocityY(-160);
            this.anims.play('walk', true);
        } else if (keys.down.isDown) {
            this.body.setVelocityY(160);
            this.anims.play('walk', true);
        }
        
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            this.anims.stop();
        }
    }
}
