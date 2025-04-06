export default class HUD extends Phaser.Scene {
    constructor() {
      super({ key: 'HUD', active: true });
    }
  
    create() {
      const { width } = this.sys.game.config;
      
      // Timer Display
      this.timerText = this.add.text(width - 120, 20, '03:00', {
        font: '24px Arial',
        fill: '#FF2222'
      }).setScrollFactor(0);
  
      // Score Display
      this.scoreText = this.add.text(20, 20, 'Score: 0', {
        font: '24px Arial',
        fill: '#22FF22'
      }).setScrollFactor(0);
  
      // Orders Panel
      this.ordersPanel = this.add.container(20, 60);
      this.currentOrders = [];
    }
  
    updateTimer(timeLeft) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      this.timerText.setText(
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    }
  
    updateScore(points) {
      this.score += points;
      this.scoreText.setText(`Score: ${this.score}`);
    }
  
    addOrder(order) {
      const orderTicket = this.add.image(0, this.currentOrders.length * 60, 'order_ticket')
        .setOrigin(0);
      
      const orderText = this.add.text(20, 10, order.description, {
        font: '16px Arial',
        fill: '#000000'
      }).setOrigin(0);
      
      this.ordersPanel.add([orderTicket, orderText]);
      this.currentOrders.push(order);
    }
  }