export default class CookingStation extends Phaser.GameObjects.Container {
    constructor(scene, x, y, type) {
      super(scene, x, y);
      
      // Station setup
      this.stationType = type;
      this.isBusy = false;
      this.currentItem = null;
      
      // Visual elements
      this.base = scene.add.sprite(0, 0, type);
      this.progressBar = this.createProgressBar(scene);
      
      this.add([this.base, this.progressBar]);
      scene.add.existing(this);
      
      // Physics setup
      scene.physics.add.existing(this.base);
      this.base.body.setSize(80, 60);
    }
  
    createProgressBar(scene) {
      const bar = scene.add.graphics();
      const fill = scene.add.graphics();
      
      bar.fillStyle(0x444444, 1);
      bar.fillRect(-40, 50, 80, 8);
      
      return bar;
    }
  
    updateProgress(progress) {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x00FF00, 1);
      this.progressBar.fillRect(-40, 50, 80 * progress, 8);
    }
  
    startCooking(player) {
      if (this.isBusy || !player.carrying) return;
  
      this.isBusy = true;
      this.currentItem = player.carrying;
      player.carrying = null;
      
      // Cooking process
      this.scene.time.addEvent({
        delay: 3000,
        callback: () => {
          this.completeCooking();
          this.isBusy = false;
        },
        callbackScope: this
      });
    }
  
    completeCooking() {
      this.currentItem.destroy();
      this.scene.hud.updateScore(100);
      this.scene.sound.play('bell');
      this.progressBar.clear();
    }
  }