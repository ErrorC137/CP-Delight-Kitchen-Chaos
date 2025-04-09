import { game } from './main.js';
export default class HUD extends Phaser.Scene {
  constructor() {
    super('HUD');
  }

  create() {
    this.orderText = this.add.text(20, 20, 'Current Order:', { fontSize: '24px', fill: '#FFF' });
    this.timerText = this.add.text(20, 50, 'Time Remaining:', { fontSize: '24px', fill: '#FFF' });
    
    this.registry.events.on('updateorder', this.updateOrder, this);
  }

  updateOrder(order) {
    this.orderText.setText(`Order: ${order.recipe}\nIngredients: ${order.ingredients.join(', ')}`);
  }
}
