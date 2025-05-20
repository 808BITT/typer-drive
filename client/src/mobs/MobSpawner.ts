import Phaser from 'phaser';
import { MobConfig } from './Mob';
import { 
  NormalLetterMob, 
  TankWordMob, 
  ArmoredLetterMob,
  ShieldedWordMob,
  RegeneratorMob,
  SplitWordMob,
  StealthLetterMob,
  SpeedsterMob,
  BossMob
} from './MobTypes';

export interface WaveConfig {
  waveNumber: number;
  mobCount: number;
  mobTypes: string[];
  spawnInterval: number;
  hasBoss: boolean;
  difficulty: number;
}

export class MobSpawner {
  private scene: Phaser.Scene;
  private spawnInterval: number = 2000; // ms
  private waveCount: number = 0;
  private currentWave: number = 0;
  private spawnQueue: MobConfig[] = [];
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  private waveTimer: Phaser.Time.TimerEvent | null = null;
  private activeMobs: Map<string, any> = new Map();
  private gameWidth: number;
  private gameHeight: number;
  private isSpawning: boolean = false;
  private wavesConfig: WaveConfig[] = [];
  private onWaveComplete: (waveNumber: number) => void;

  constructor(scene: Phaser.Scene, config: {
    totalWaves: number;
    initialSpawnInterval: number;
    gameWidth: number;
    gameHeight: number;
    onWaveComplete?: (waveNumber: number) => void;
  }) {
    this.scene = scene;
    this.waveCount = config.totalWaves || 5;
    this.spawnInterval = config.initialSpawnInterval || 2000;
    this.gameWidth = config.gameWidth;
    this.gameHeight = config.gameHeight;
    this.onWaveComplete = config.onWaveComplete || (() => {});
    
    // Setup wave configurations
    this.setupWaves();
    
    // Listen for split mob spawning
    this.scene.events.on('spawn-split-mobs', this.handleSplitMobs, this);
  }

  private setupWaves(): void {
    // Generate wave configurations with increasing difficulty
    for (let i = 1; i <= this.waveCount; i++) {
      const isBossWave = i % 5 === 0 || i === this.waveCount;
      const difficulty = Math.min(1, 0.3 + (i / this.waveCount) * 0.7);
      
      let mobTypes = ['normal'];
      
      // Add more mob types as waves progress
      if (i >= 2) mobTypes.push('tank');
      if (i >= 3) mobTypes.push('armored');
      if (i >= 4) mobTypes.push('speedster');
      if (i >= 5) mobTypes.push('shielded');
      if (i >= 6) mobTypes.push('stealth');
      if (i >= 7) mobTypes.push('regenerator');
      if (i >= 8) mobTypes.push('split');
      
      this.wavesConfig.push({
        waveNumber: i,
        mobCount: isBossWave ? 1 : Math.floor(5 + i * 1.5),
        mobTypes,
        spawnInterval: Math.max(700, this.spawnInterval - (i * 100)),
        hasBoss: isBossWave,
        difficulty
      });
    }
  }

  startWave(waveNumber: number = 1): void {
    if (waveNumber > this.waveCount || waveNumber < 1) {
      console.error(`Wave number ${waveNumber} is out of range (1-${this.waveCount})`);
      return;
    }
    
    this.stopSpawning();
    this.currentWave = waveNumber;
    
    const waveConfig = this.wavesConfig[waveNumber - 1];
    this.spawnInterval = waveConfig.spawnInterval;
    
    // Generate spawn queue
    this.generateSpawnQueue(waveConfig);
    
    // Display wave start text
    const waveText = this.scene.add.text(
      this.gameWidth / 2, 
      this.gameHeight / 2, 
      `WAVE ${waveNumber}`,
      { 
        fontSize: '64px', 
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 5, stroke: true, fill: true }
      }
    );
    waveText.setOrigin(0.5);
    
    // Scale animation
    this.scene.tweens.add({
      targets: waveText,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 500,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: waveText,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            waveText.destroy();
            
            // Start spawning after the animation
            this.isSpawning = true;
            this.startSpawning();
          }
        });
      }
    });
  }

  private generateSpawnQueue(waveConfig: WaveConfig): void {
    this.spawnQueue = [];
    
    // Add regular mobs
    for (let i = 0; i < waveConfig.mobCount; i++) {
      const mobType = waveConfig.mobTypes[Math.floor(Math.random() * waveConfig.mobTypes.length)];
      const mobConfig = this.createMobConfig(mobType, waveConfig.difficulty);
      this.spawnQueue.push(mobConfig);
    }
    
    // Add boss if this is a boss wave
    if (waveConfig.hasBoss) {
      const bossConfig = this.createBossConfig(waveConfig.difficulty);
      this.spawnQueue.push(bossConfig);
    }
  }

  private createMobConfig(mobType: string, difficulty: number): MobConfig {
    const x = this.gameWidth + 50;
    const y = Math.random() * (this.gameHeight - 100) + 50;
    const baseSpeed = 50 + (difficulty * 30);
    
    // Helper function to generate random letters
    const getRandomLetters = (count: number): string[] => {
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(letters[Math.floor(Math.random() * letters.length)]);
      }
      return result;
    };
    
    switch (mobType) {
      case 'normal':
        return {
          id: `normal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(1),
          speed: baseSpeed,
          x,
          y,
          scene: this.scene
        };
        
      case 'tank':
        return {
          id: `tank-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(3 + Math.floor(Math.random() * 3)), // 3-5 letters
          speed: baseSpeed * 0.8, // Slower
          x,
          y,
          scene: this.scene
        };
        
      case 'armored':
        return {
          id: `armored-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(2),
          speed: baseSpeed * 0.9,
          x,
          y,
          scene: this.scene
        };
        
      case 'shielded':
        return {
          id: `shielded-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(4 + Math.floor(Math.random() * 3)), // 4-6 letters
          speed: baseSpeed * 0.85,
          x,
          y,
          scene: this.scene
        };
        
      case 'regenerator':
        return {
          id: `regenerator-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(3 + Math.floor(Math.random() * 3)), // 3-5 letters
          speed: baseSpeed * 0.9,
          x,
          y,
          scene: this.scene
        };
        
      case 'split':
        return {
          id: `split-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(6),
          speed: baseSpeed * 0.8,
          x,
          y,
          scene: this.scene
        };
        
      case 'stealth':
        return {
          id: `stealth-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(1),
          speed: baseSpeed,
          x,
          y,
          scene: this.scene
        };
        
      case 'speedster':
        return {
          id: `speedster-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(2),
          speed: baseSpeed * 0.5, // Actually doubled in the SpeedsterMob constructor
          x,
          y,
          scene: this.scene
        };
        
      default:
        return {
          id: `default-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          letters: getRandomLetters(1),
          speed: baseSpeed,
          x,
          y,
          scene: this.scene
        };
    }
  }

  private createBossConfig(difficulty: number): MobConfig {
    const x = this.gameWidth + 100;
    const y = this.gameHeight / 2;
    
    // Create a longer word/sentence for the boss
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const length = 8 + Math.floor(Math.random() * 5); // 8-12 letters
    const bossLetters = [];
    
    for (let i = 0; i < length; i++) {
      bossLetters.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    
    return {
      id: `boss-${Date.now()}`,
      letters: bossLetters,
      speed: 30 + (difficulty * 20), // Bosses are slower but tougher
      x,
      y,
      scene: this.scene
    };
  }

  private startSpawning(): void {
    if (!this.isSpawning || this.spawnQueue.length === 0) return;
    
    // Start spawn timer
    this.spawnTimer = this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnNextMob,
      callbackScope: this,
      loop: true
    });
    
    // Spawn first mob immediately
    this.spawnNextMob();
    
    // Set wave completion timer if there are no more mobs to spawn
    this.waveTimer = this.scene.time.delayedCall(
      this.spawnInterval * (this.spawnQueue.length + 2), // Extra time to ensure all mobs are processed
      () => {
        this.checkWaveCompletion();
      }
    );
  }

  private spawnNextMob(): void {
    if (this.spawnQueue.length === 0) {
      if (this.spawnTimer) {
        this.spawnTimer.remove();
        this.spawnTimer = null;
      }
      return;
    }
    
    const mobConfig = this.spawnQueue.shift();
    
    if (!mobConfig) return;
    
    let mob;
    
    // Determine which mob type to create
    if (mobConfig.id.startsWith('normal')) {
      mob = new NormalLetterMob(mobConfig);
    } else if (mobConfig.id.startsWith('tank')) {
      mob = new TankWordMob(mobConfig);
    } else if (mobConfig.id.startsWith('armored')) {
      mob = new ArmoredLetterMob(mobConfig);
    } else if (mobConfig.id.startsWith('shielded')) {
      mob = new ShieldedWordMob(mobConfig);
    } else if (mobConfig.id.startsWith('regenerator')) {
      mob = new RegeneratorMob(mobConfig);
    } else if (mobConfig.id.startsWith('split')) {
      mob = new SplitWordMob(mobConfig);
    } else if (mobConfig.id.startsWith('stealth')) {
      mob = new StealthLetterMob(mobConfig);
    } else if (mobConfig.id.startsWith('speedster')) {
      mob = new SpeedsterMob(mobConfig);
    } else if (mobConfig.id.startsWith('boss')) {
      mob = new BossMob(mobConfig);
    }
    
    if (mob) {
      this.activeMobs.set(mobConfig.id, mob);
    }
  }

  private handleSplitMobs(mobConfigs: MobConfig[]): void {
    if (!mobConfigs || !Array.isArray(mobConfigs)) return;
    
    mobConfigs.forEach(config => {
      const mob = new TankWordMob(config);
      this.activeMobs.set(config.id, mob);
    });
  }

  private checkWaveCompletion(): void {
    // If all mobs are destroyed and no more to spawn, wave is complete
    if (this.activeMobs.size === 0 && this.spawnQueue.length === 0) {
      if (this.currentWave < this.waveCount) {
        // Call the wave complete callback
        this.onWaveComplete(this.currentWave);
        
        // Start the next wave
        this.startWave(this.currentWave + 1);
      } else {
        // All waves completed, game won
        this.scene.events.emit('game-won');
      }
    } else {
      // Check again after a delay
      this.scene.time.delayedCall(1000, () => {
        this.checkWaveCompletion();
      });
    }
  }

  stopSpawning(): void {
    this.isSpawning = false;
    
    if (this.spawnTimer) {
      this.spawnTimer.remove();
      this.spawnTimer = null;
    }
    
    if (this.waveTimer) {
      this.waveTimer.remove();
      this.waveTimer = null;
    }
  }

  update(time: number, delta: number): void {
    // Update all active mobs
    this.activeMobs.forEach((mob, id) => {
      if (mob.active) {
        mob.update(delta);
      } else {
        this.activeMobs.delete(id);
      }
    });
    
    // Check if wave is complete
    if (this.activeMobs.size === 0 && this.spawnQueue.length === 0 && !this.spawnTimer && this.isSpawning) {
      this.checkWaveCompletion();
    }
  }

  getMobs(): Map<string, any> {
    return this.activeMobs;
  }

  cleanup(): void {
    this.stopSpawning();
    
    // Clean up all mobs
    this.activeMobs.forEach(mob => {
      if (mob.destroy) {
        mob.destroy();
      }
    });
    
    this.activeMobs.clear();
    this.spawnQueue = [];
    
    // Remove event listeners
    this.scene.events.off('spawn-split-mobs', this.handleSplitMobs, this);
  }
}
