import Phaser from 'phaser';
export default class CookingStation extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.type = type;
        this.isCooking = false;
        this.progress = 0;
    }

    canCook(item) {
        const validIngredients = {
            fryer: ['chicken', 'fish'],
            oven: ['dough', 'meat'],
            mixer: ['lettuce', 'tomato']
        };
        return validIngredients[this.type].includes(item.texture.key);
    }

    startCooking(ingredient) {
        this.isCooking = true;
        this.scene.time.addEvent({
            delay: 5000,
            callback: () => this.finishCooking(ingredient),
            callbackScope: this
        });
    }

    finishCooking(ingredient) {
        this.isCooking = false;
        const cookedItem = this.scene.add.sprite(this.x, this.y, `${ingredient.texture.key}_cooked`);
        cookedItem.setData('value', ingredient.getData('value') * 2);
    }
}
