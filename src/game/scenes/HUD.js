export default class HUD extends Phaser.Scene {
  constructor() {
    super({ key: 'HUD', active: true });
    this.score = 0;
  }

  create() {
    const { width, height } = this.sys.game.config;
    
    // Connection Status
    this.connectionStatus = this.add.text(width - 200, 20, 'Connecting...', {
      font: '20px Arial',
      fill: '#FFA500'
    }).setScrollFactor(0);

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

    // Handle window resize
    this.scale.on('resize', this.handleResize, this);
  }

  handleConnection(isConnected) {
    this.connectionStatus
      .setText(isConnected ? 'Online' : 'Offline')
      .setFillStyle(isConnected ? '#00FF00' : '#FF0000');
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
    this.scoreText.setColor(points > 0 ? '#22FF22' : '#FF2222');
  }

  addOrder(order) {
    if (!this.textures.exists('order_ticket')) {
      console.error('Order ticket texture missing!');
      return;
    }

    const yPosition = this.currentOrders.length * 60;
    const orderTicket = this.add.image(0, yPosition, 'order_ticket')
      .setOrigin(0)
      .setScale(0.9);

    const orderText = this.add.text(20, yPosition + 10, order.description, {
      font: '16px Arial',
      fill: '#000000',
      wordWrap: { width: 200 }
    }).setOrigin(0);

    this.ordersPanel.add([orderTicket, orderText]);
    this.currentOrders.push(order);
  }

  handleResize(gameSize) {
    const { width } = gameSize;
    
    // Update positions
    this.connectionStatus.setX(width - 200);
    this.timerText.setX(width - 120);
    
    // Update score text if needed
    this.scoreText.setX(20);
    
    // Center orders panel if desired
    this.ordersPanel.setX((width - 240) / 2);
  }

  shutdown() {
    this.scale.off('resize', this.handleResize);
    super.shutdown();
  }
}
