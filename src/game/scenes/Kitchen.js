// src/game/scenes/Kitchen.js
export default class Kitchen extends Phaser.Scene {
  constructor() {
    super('Kitchen');
  }

  preload() {
    this.load.json('level1', '../../docs/assets/config/level1.json');
    this.load.spritesheet('kitchen', '../../docs/assets/sprites/kitchen/kitchen_tiles.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.spritesheet('chef', '../../docs/assets/sprites/characters/player.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    const levelData = this.cache.json.get('level1');
    this.createMap(levelData);
    this.createHazards(levelData);
    this.setupOrders(levelData);
    this.createPlayer(levelData);
  }

  createMap(levelData) {
    // Create tilemap layers from level1.json
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('kitchen');
    
    // Create layers
    const floorLayer = map.createLayer('floor', tileset);
    const counterLayer = map.createLayer('counters', tileset);
    
    // Set collision
    counterLayer.setCollisionByProperty({ collision: true });
  }

  createPlayer(levelData) {
    this.player = this.physics.add.sprite(
      levelData.playerStart.x,
      levelData.playerStart.y,
      'chef'
    ).setScale(2);
    
    // Player animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('chef', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Enable collision
    this.physics.add.collider(this.player, counterLayer);
  }

  setupOrders(levelData) {
    this.orders = levelData.initialOrders;
    this.currentOrder = this.orders[0];
    
    // Start order timer
    this.time.addEvent({
      delay: this.currentOrder.timeLimit,
      callback: this.failOrder,
      callbackScope: this
    });
  }

  update() {
    // Handle player movement
    const cursors = this.input.keyboard.createCursorKeys();
    
    if (cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play('walk', true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play('walk', true);
      this.player.flipX = false;
    } else {
      this.player.setVelocityX(0);
      this.player.anims.stop();
    }
  }
}
