import Phaser from 'phaser';
import CookingStation from '../entities/CookingStation.js';
import Player from '../entities/Player.js';
export default class Kitchen extends Phaser.Scene {
    constructor() {
        super('Kitchen');
        this.orders = [];
        this.currentOrder = null;
        this.disasters = ['earthquake', 'fire', 'flood', 'mouseInvasion'];
    }

    preload() {
        this.load.spritesheet('player', 'assets/sprites/kitchen/player.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('counter', 'assets/sprites/kitchen/counter.png');
        this.load.image('fryer', 'assets/sprites/kitchen/appliance_fryer.png');
        this.load.image('chicken', 'assets/sprites/kitchen/ingredient_chicken.png');
    }

    create() {
        this.createKitchenLayout();
        this.player = new Player(this, 100, 100);
        
        // Game systems
        this.setupCookingStations();
        this.setupOrders();
        this.setupDisasters();
        
        // Overcooked-style mechanics
        this.time.addEvent({
            delay: 30000,
            callback: this.increaseDifficulty,
            callbackScope: this,
            loop: true
        });
    }

    createKitchenLayout() {
        this.add.tileSprite(0, 0, 2048, 1536, 'kitchen_tiles').setOrigin(0);
        
        this.counters = this.physics.add.staticGroup();
        this.counters.create(300, 400, 'counter');
        this.counters.create(500, 400, 'counter');
        
        this.fryer = new CookingStation(this, 700, 400, 'fryer');
    }

    setupCookingStations() {
        this.physics.add.overlap(this.player, this.fryer, (player, station) => {
            if (player.carrying && station.canCook(player.carrying)) {
                station.startCooking(player.carrying);
                player.dropItem();
            }
        });
    }

    setupOrders() {
        this.orderTimer = this.time.addEvent({
            delay: 45000,
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
        
        const recipeKeys = Object.keys(recipes);
        const randomRecipe = recipeKeys[Phaser.Math.Between(0, recipeKeys.length - 1)];
        
        this.orders.push({
            recipe: randomRecipe,
            ingredients: recipes[randomRecipe],
            timer: this.time.delayedCall(30000, () => this.failOrder())
        });
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
                            if (child.body) child.body.velocity.y += Phaser.Math.Between(-50, 50);
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
                fire.setScale(0).play('fire_anim');
                this.tweens.add({
                    targets: fire,
                    scale: 1,
                    duration: 1000
                });
                break;
        }
    }

    increaseDifficulty() {
        this.timeBetweenOrders *= 0.9;
        this.disasterTimer.delay *= 0.85;
        this.orderTimer.delay = Phaser.Math.Clamp(this.orderTimer.delay, 15000, 45000);
    }
}
