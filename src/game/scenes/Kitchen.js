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

this.interactables = this.physics.add.group();
levelData.layers.counters.tiles.forEach(tile => {
  if(tile.properties?.interactable) {
    const station = this.add.sprite(tile.x * 64, tile.y * 64, 'appliance_fryer')
      .setInteractive()
      .on('pointerdown', () => this.handleStationInteraction(tile));
    this.interactables.add(station);
  }
});

createHazards(levelData) {
  levelData.hazards.forEach(hazard => {
    this.time.delayedCall(hazard.startTime, () => {
      const hazardZone = this.add.zone(
        hazard.area.x, 
        hazard.area.y,
        hazard.area.width,
        hazard.area.height
      );
      
      this.physics.add.existing(hazardZone);
      this.physics.add.overlap(this.player, hazardZone, () => {
        this.handleHazardEffect(hazard.type);
      });
    });
  });
}

handleHazardEffect(type) {
  switch(type) {
    case 'grease_spill':
      this.player.setVelocity(0);
      this.player.setTint(0xff0000);
      break;
    case 'fire':
      // Implement fire extinguishing mechanic
      break;
  }
}
