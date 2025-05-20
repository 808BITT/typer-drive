import Phaser from 'phaser';
import { MobSpawner } from '../entities/MobSpawner';
import { TypingInputHandler } from '../entities/TypingInputHandler';

export class MobGameScene extends Phaser.Scene {
  private mobSpawner!: MobSpawner;
  private typingHandler!: TypingInputHandler;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private healthBar!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private wpmText!: Phaser.GameObjects.Text;
  private gameState: 'playing' | 'paused' | 'gameover' | 'victory' = 'playing';
  
  private score: number = 0;
  private health: number = 100;
  private typedKeys: number = 0;
  private startTime: number = 0;
  private wpm: number = 0;
  
  constructor() {
    super({ key: 'MobGameScene' });
  }

  preload(): void {
    // Load game assets
    this.load.image('player', 'assets/images/player.png');
    this.load.image('hit-particle', 'assets/images/hit-particle.png');
    this.load.image('explosion-particle', 'assets/images/explosion-particle.png');
    this.load.image('regeneration-particle', 'assets/images/regeneration-particle.png');
    this.load.image('split-particle', 'assets/images/split-particle.png');
    this.load.image('phase-particle', 'assets/images/phase-particle.png');
    this.load.image('miss-particle', 'assets/images/miss-particle.png');
    this.load.image('background', 'assets/images/space-background.png');
    
    // Load sounds
    this.load.audio('hit', 'assets/audio/hit.mp3');
    this.load.audio('miss', 'assets/audio/miss.mp3');
    this.load.audio('explosion', 'assets/audio/explosion.mp3');
    this.load.audio('player-damage', 'assets/audio/player-damage.mp3');
    this.load.audio('game-over', 'assets/audio/game-over.mp3');
    this.load.audio('victory', 'assets/audio/victory.mp3');
    this.load.audio('wave-start', 'assets/audio/wave-start.mp3');
  }

  create(): void {
    // Set start time for WPM calculation
    this.startTime = Date.now();
    
    // Add background
    const bg = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'background');
    bg.setOrigin(0, 0);
    
    // Add player on the left side
    this.playerSprite = this.add.sprite(100, this.game.canvas.height / 2, 'player');
    
    // Initialize UI elements
    this.createUI();
    
    // Initialize mob spawner
    this.mobSpawner = new MobSpawner(this, {
      totalWaves: 5,
      initialSpawnInterval: 2000,
      gameWidth: this.game.canvas.width,
      gameHeight: this.game.canvas.height,
      onWaveComplete: (waveNumber) => {
        // Maybe give a bonus score or health for completing a wave
        this.updateScore(waveNumber * 50);
        this.updateHealth(10); // Heal a bit between waves
        this.sound.play('wave-start');
      }
    });
    
    // Initialize typing input handler
    this.typingHandler = new TypingInputHandler(this, {
      mobGetter: () => this.mobSpawner.getMobs(),
      missCallback: () => {
        // Penalty for miss
        this.updateScore(-5);
        this.sound.play('miss');
      },
      typedCallback: (letter, success) => {
        // Track typing stats
        this.typedKeys++;
        this.calculateWPM();
        
        if (success) {
          this.sound.play('hit');
        }
      }
    });
    
    // Listen for player damage
    this.events.on('player-damaged', this.onPlayerDamaged, this);
    
    // Listen for score updates
    this.events.on('score-updated', this.updateScore, this);
    
    // Listen for game win/lose conditions
    this.events.on('game-won', this.onGameWon, this);
    
    // Start the first wave
    this.mobSpawner.startWave(1);
    
    // Add a simple animation to the player
    this.tweens.add({
      targets: this.playerSprite,
      y: this.playerSprite.y + 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createUI(): void {
    // Health bar
    this.healthBar = this.add.graphics();
    this.updateHealthBar();
    
    // Score text
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    
    // WPM text
    this.wpmText = this.add.text(20, 50, 'WPM: 0', {
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
  }

  private updateHealthBar(): void {
    this.healthBar.clear();
    
    // Background of health bar
    this.healthBar.fillStyle(0x333333, 1);
    this.healthBar.fillRect(20, this.game.canvas.height - 40, 200, 20);
    
    // Health remaining
    const healthPercentage = this.health / 100;
    const healthColor = 
      healthPercentage > 0.6 ? 0x00ff00 : 
      healthPercentage > 0.3 ? 0xffff00 : 
      0xff0000;
    
    this.healthBar.fillStyle(healthColor, 1);
    this.healthBar.fillRect(20, this.game.canvas.height - 40, 200 * healthPercentage, 20);
  }

  private onPlayerDamaged(amount: number = 10): void {
    if (this.gameState !== 'playing') return;
    
    this.sound.play('player-damage');
    this.updateHealth(-amount);
    
    // Flash the player red
    this.tweens.add({
      targets: this.playerSprite,
      tint: 0xff0000,
      alpha: 0.7,
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.playerSprite.clearTint();
        this.playerSprite.setAlpha(1);
      }
    });
    
    // Check for game over
    if (this.health <= 0) {
      this.onGameOver();
    }
  }

  private updateScore(points: number): void {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
    
    // Show floating score text for positive points
    if (points > 0) {
      const floatingText = this.add.text(
        this.playerSprite.x + 50, 
        this.playerSprite.y, 
        `+${points}`, 
        {
          fontSize: '18px',
          color: '#00ff00',
          stroke: '#000000',
          strokeThickness: 3
        }
      );
      
      this.tweens.add({
        targets: floatingText,
        y: floatingText.y - 50,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          floatingText.destroy();
        }
      });
    }
  }

  private updateHealth(amount: number): void {
    this.health = Math.min(100, Math.max(0, this.health + amount));
    this.updateHealthBar();
  }

  private calculateWPM(): void {
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    this.wpm = Math.round(this.typedKeys / 5 / elapsedMinutes); // Standard WPM calculation
    this.wpmText.setText(`WPM: ${this.wpm}`);
  }

  private onGameOver(): void {
    this.gameState = 'gameover';
    this.sound.play('game-over');
    this.mobSpawner.stopSpawning();
    
    const gameOverText = this.add.text(
      this.game.canvas.width / 2, 
      this.game.canvas.height / 2, 
      'GAME OVER', 
      {
        fontSize: '64px',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 6,
        shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 5, stroke: true, fill: true }
      }
    );
    gameOverText.setOrigin(0.5);
    
    const finalScoreText = this.add.text(
      this.game.canvas.width / 2, 
      this.game.canvas.height / 2 + 70, 
      `Final Score: ${this.score} | WPM: ${this.wpm}`, 
      {
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    finalScoreText.setOrigin(0.5);
    
    const restartText = this.add.text(
      this.game.canvas.width / 2, 
      this.game.canvas.height / 2 + 120, 
      'Press SPACE to restart', 
      {
        fontSize: '18px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    restartText.setOrigin(0.5);
    
    // Add restart listener
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.restart();
    });
  }

  private onGameWon(): void {
    this.gameState = 'victory';
    this.sound.play('victory');
    this.mobSpawner.stopSpawning();
    
    const victoryText = this.add.text(
      this.game.canvas.width / 2, 
      this.game.canvas.height / 2, 
      'VICTORY!', 
      {
        fontSize: '64px',
        color: '#00ff00',
        stroke: '#000000',
        strokeThickness: 6,
        shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 5, stroke: true, fill: true }
      }
    );
    victoryText.setOrigin(0.5);
    
    const finalScoreText = this.add.text(
      this.game.canvas.width / 2, 
      this.game.canvas.height / 2 + 70, 
      `Final Score: ${this.score} | WPM: ${this.wpm}`, 
      {
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    finalScoreText.setOrigin(0.5);
    
    const continueText = this.add.text(
      this.game.canvas.width / 2, 
      this.game.canvas.height / 2 + 120, 
      'Press SPACE to continue', 
      {
        fontSize: '18px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    continueText.setOrigin(0.5);
    
    // Add continue listener
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('MainMenuScene');
    });
  }

  update(time: number, delta: number): void {
    if (this.gameState !== 'playing') return;
    
    // Update the mob spawner
    this.mobSpawner.update(time, delta);
    
    // Update background (parallax effect)
    const bg = this.children.getByName('background') as Phaser.GameObjects.TileSprite;
    if (bg) {
      bg.tilePositionX += 0.5;
    }
  }

  shutdown(): void {
    // Clean up
    this.mobSpawner.cleanup();
    this.typingHandler.cleanup();
    
    // Remove event listeners
    this.events.off('player-damaged', this.onPlayerDamaged, this);
    this.events.off('score-updated', this.updateScore, this);
    this.events.off('game-won', this.onGameWon, this);
  }
}

// Contains AI-generated edits.
