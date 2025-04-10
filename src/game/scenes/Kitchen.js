import Phaser from 'phaser';
import CookingStation from '../entities/CookingStation.js';
import Player from '../entities/Player.js';

export default class Kitchen extends Phaser.Scene {
  constructor() {
    super('Kitchen');
    this.orders = [];
    this.currentOrder = null;
    this.disasters = ['earthquake', 'fire', 'flood', 'mouseInvasion'];
    this.timeBetweenOrders = 45000; // initialize to avoid undefined
  }

  preload() {
    // Map + Tileset
    this.load.tilemapTiledJSON('level1', 'assets/config/level1.json');
    this.load.image('kitchen_tiles', 'assets/sprites/kitchen/kitchen_tiles.png');

    // Game assets
    this.load.image('counter', 'assets/sprites/kitchen/counter.png');
    this.load.image('fryer', 'assets/sprites/kitchen/appliance_fryer.png');
    this.load.image('chicken', 'assets/sprites/kitchen/ingredient_chicken.png');

    // Player
    this.load.spritesheet('player', 'assets/sprites/chefs/chef_red.png', {
      frameWidth: 32,
      frameHeight: 32
    });

    // Disaster sprite fallback (add your own fire sprite to replace this!)
    this.load.spritesheet('fire', 'assets/sprites/kitchen/kitchen_tiles.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.createKitchenLayout();

    // Player setup
    this.player = new Player(this, this.playerStart.x, this.playerStart.y);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Game systems
    this.setupCookingStations();
    this.setupOrders();
    this.setupDisasters();

    this.time.addEvent({
      delay: 30000,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true
    });
  }

  createKitchenLayout() {
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('kitchen_tiles', 'kitchen_tiles');
    map.createLayer('Floor', tileset, 0, 0);

    const objectLayer = map.getObjectLayer('Objects');
    this.counters = this.physics.add.staticGroup();

    objectLayer.objects.forEach(obj => {
      switch (obj.type) {
        case 'spawn':
          this.playerStart = { x: obj.x, y: obj.y };
          break;
        case 'counter':
          this.counters.create(obj.x, obj.y, 'counter').setOrigin(0);
          break;
        case 'fryer':
          this.fryer = new CookingStation(this, obj.x, obj.y, 'fryer');
          break;
        case 'ingredient':
          this.add.image(obj.x, obj.y, 'chicken').setOrigin(0);
          break;
        default:
          console.warn('Unknown object type:', obj.type);
      }
    });

    if (!this.playerStart) {
      this.playerStart = { x: 100, y: 100 };
    }
  }

  update() {
    if (!this.player || !this.cursors) return;
    this.player.update(this.cursors);
  }

  setupCookingStations() {
    if (this.fryer) {
      this.physics.add.overlap(this.player, this.fryer, (player, station) => {
        if (player.carrying && station.canCook(player.carrying)) {
          station.startCooking(player.carrying);
          player.dropItem();
        }
      });
    }
  }

  setupOrders() {
    this.orderTimer = this.time.addEvent({
      delay: this.timeBetweenOrders,
      callback: () => {
        this.generateOrder();
        this.orderTimer.delay = Phaser.Math.Between(30000, 45000);
      },
      loop: true
    });
  }

  setupDisasters() {
    this.disasterTimer = this.time.addEvent({
      delay: 60000,
      callback: this.triggerDisaster,
      callbackScope: this,
      loop: true
    });
  }

  generateOrder() {
    const recipes = {
      friedChicken: ['chicken', 'oil'],
      salad: ['lettuce', 'tomato'],
      burger: ['patty', 'bun', 'lettuce']
    };

    const keys = Object.keys(recipes);
    const randomRecipe = keys[Phaser.Math.Between(0, keys.length - 1)];

    this.orders.push({
      recipe: randomRecipe,
      ingredients: recipes[randomRecipe],
      timer: this.time.delayedCall(30000, () => this.failOrder())
    });

    this.registry.events.emit('updateorder', this.orders[this.orders.length - 1]);
  }

  triggerDisaster() {
    const disaster = Phaser.Math.RND.pick(this.disasters);

    switch (disaster) {
      case 'earthquake':
        this.cameras.main.shake(3000, 0.02);
        this.time.addEvent({
          delay: 100,
          callback: () => {
            this.children.each(child => {
              if (child.body) {
                child.body.velocity.y += Phaser.Math.Between(-50, 50);
              }
            });
          },
          repeat: 30
        });
        break;

      case 'fire':
        const fire = this.add.sprite(
          Phaser.Math.Between(100, 700),
          Phaser.Math.Between(100, 500),
          'fire'
        );
        fire.setScale(1);
        fire.play('fire_anim'); // You should define this animation in Boot.js
        break;

      default:
        console.warn(`Disaster ${disaster} not implemented.`);
        break;
    }
  }

  increaseDifficulty() {
    this.timeBetweenOrders *= 0.9;
    this.disasterTimer.delay *= 0.85;
    this.orderTimer.delay = Phaser.Math.Clamp(this.orderTimer.delay, 15000, 45000);
  }

  failOrder() {
    // Placeholder fail logic
    console.log('Order failed!');
  }
}
