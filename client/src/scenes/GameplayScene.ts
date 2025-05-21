import Phaser from 'phaser';
import { MobSpawner } from '../mobs/MobSpawner';
import { BaseMob as Mob } from '../mobs/Mob';

export default class GameplayScene extends Phaser.Scene {
  private mobSpawner: MobSpawner;
  private scoreText: Phaser.GameObjects.Text;
  private healthText: Phaser.GameObjects.Text;
  private wpmText: Phaser.GameObjects.Text;
  private score: number = 0;
  private health: number = 100;
  private gameOver: boolean = false;
  private playerShip: Phaser.GameObjects.Sprite;
  private keyboardInputDisabled: boolean = false;
  
  // Typing metrics
  private charactersTyped: number = 0;
  private startTime: number = 0;
  private wpm: number = 0;
  
  constructor() {
    super('GameplayScene');
  }
  
  preload(): void {
    // Load assets if needed here
    this.load.image('ship', 'assets/images/player-ship.png');
    this.load.image('particle', 'assets/images/particle.png');
    this.load.image('background', 'assets/images/space-bg.png');
    // Preload audio for feedback
    this.load.audio('hit', 'assets/audio/hit.mp3');
    this.load.audio('miss', 'assets/audio/miss.mp3');
  }
  
  create(): void {
    // Add background
    const bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background')
      .setOrigin(0, 0);
    
    // Create player ship at left side
    this.playerShip = this.add.sprite(100, this.scale.height / 2, 'ship');
    
    // Set up UI
    this.createUI();
    
    // Set up keyboard input
    this.setupKeyboardInput();
    
    // Create mob spawner
    this.mobSpawner = new MobSpawner({
      scene: this,
      spawnInterval: 2000,
      initialDelay: 3000,
      onWaveComplete: (waveNumber: number) => {
        // Give bonus points for completing a wave
        this.addScore(waveNumber * 100);
      },
      onAllWavesComplete: () => {
        this.showVictoryScreen();
      }
    });
    
    // Start first wave
    this.mobSpawner.startWave();
    
    // Start tracking typing time
    this.startTime = Date.now();
  }
  
  private createUI(): void {
    // Score
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff'
    });
    
    // Health
    this.healthText = this.add.text(20, 60, 'Health: 100', {
      fontSize: '24px',
      color: '#ffffff'
    });
    
    // WPM
    this.wpmText = this.add.text(20, 100, 'WPM: 0', {
      fontSize: '24px',
      color: '#ffffff'
    });
  }
  
  private setupKeyboardInput(): void {
    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (this.gameOver || this.keyboardInputDisabled) return;
      
      // Only process letter keys
      const key = event.key.toLowerCase();
      
      if (/^[a-z#]$/.test(key)) {
        // Process typing
        this.handleTyping(key);
      }
    });
  }
  
  private handleTyping(key: string): void {
    // Get all active mobs as array
    const mobsMap = this.mobSpawner.getActiveMobs();
    const mobs = Array.isArray(mobsMap) ? mobsMap : Array.from(mobsMap.values());
    
    // Sort mobs by proximity to player (left edge)
    mobs.sort((a, b) => (a && a.x ? a.x : 0) - (b && b.x ? b.x : 0));
    
    // Try to find a mob with the matching character
    let matched = false;
    
    for (const mob of mobs) {
      if (mob && typeof mob.onTyped === 'function' && mob.onTyped(key)) {
        matched = true;
        this.charactersTyped++;
        this.updateWPM();
        this.addScore(10);
        // Visual feedback for correct keypress
        this.showHitEffect();
        // Audio feedback for correct keypress
        this.sound.play('hit');
        break;
      }
    }
    
    // If no match, play error effect
    if (!matched) {
      this.showMissEffect();
      // Audio feedback for incorrect keypress
      this.sound.play('miss');
    }
  }
  
  private updateWPM(): void {
    // Calculate minutes elapsed
    const minutesElapsed = (Date.now() - this.startTime) / 60000;
    if (minutesElapsed > 0) {
      // Standard WPM formula: (characters / 5) / minutes
      this.wpm = Math.round((this.charactersTyped / 5) / minutesElapsed);
      this.wpmText.setText(`WPM: ${this.wpm}`);
    }
  }
  
  private showMissEffect(): void {
    // Visual feedback for incorrect typing
    const x = this.playerShip.x + 50;
    const y = this.playerShip.y;
    
    // Red flash to indicate a miss
    const flash = this.add.rectangle(x, y, 50, 50, 0xff0000, 0.7);
    
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        flash.destroy();
      }
    });
  }
  
  private showHitEffect(): void {
    // Visual feedback for correct typing
    const x = this.playerShip.x + 50;
    const y = this.playerShip.y;
    // Green flash to indicate a hit
    const flash = this.add.rectangle(x, y, 50, 50, 0x00ff00, 0.6);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => {
        flash.destroy();
      }
    });
  }
  
  private addScore(points: number): void {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
  }
  
  private damagePlayer(amount: number): void {
    this.health -= amount;
    
    if (this.health <= 0) {
      this.health = 0;
      this.gameOver = true;
      this.showGameOverScreen();
    }
    
    this.healthText.setText(`Health: ${this.health}`);
    
    // Visual feedback for taking damage
    this.cameras.main.shake(500, 0.01);
    this.playerShip.setTint(0xff0000);
    
    this.time.delayedCall(300, () => {
      this.playerShip.clearTint();
    });
  }
  
  private showGameOverScreen(): void {
    this.keyboardInputDisabled = true;
    this.mobSpawner.stopSpawning();
    
    const overlay = this.add.rectangle(
      0, 
      0, 
      this.scale.width, 
      this.scale.height, 
      0x000000, 
      0.7
    ).setOrigin(0);
    
    const gameOverText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      'GAME OVER',
      {
        fontSize: '64px',
        color: '#ff0000',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
    
    const scoreText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 50,
      `Final Score: ${this.score}`,
      {
        fontSize: '32px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);
    
    const retryButton = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 150,
      'Try Again',
      {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#222222',
        padding: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10
        }
      }
    )
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.restart();
    });
    
    // Add animation to make the UI elements more dynamic
    this.tweens.add({
      targets: [gameOverText, scoreText, retryButton],
      y: '+=10',
      duration: 1500,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
  
  private showVictoryScreen(): void {
    this.keyboardInputDisabled = true;
    
    const overlay = this.add.rectangle(
      0, 
      0, 
      this.scale.width, 
      this.scale.height, 
      0x000000, 
      0.7
    ).setOrigin(0);
    
    const victoryText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      'VICTORY!',
      {
        fontSize: '64px',
        color: '#00ff00',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
    
    const scoreText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 50,
      `Final Score: ${this.score}`,
      {
        fontSize: '32px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);
    
    const menuButton = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 150,
      'Main Menu',
      {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#222222',
        padding: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10
        }
      }
    )
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
  
  update(time: number, delta: number): void {
    if (this.gameOver) return;
    
    // Update mob spawner
    this.mobSpawner.update(time, delta);
    
    // Check for mobs that have reached the player
    const mobs = this.mobSpawner.getActiveMobs();
    for (const mob of mobs) {
      if (mob.x <= this.playerShip.x) {
        // Damage player when a mob reaches them
        this.damagePlayer(10);
        mob.destroy();
      }
    }
    
    // Update WPM display periodically
    if (time % 30 === 0) {
      this.updateWPM();
    }
  }
}

// Contains AI-generated edits.
