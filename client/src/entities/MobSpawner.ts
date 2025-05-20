import Phaser from 'phaser';
import { Mob, createMob } from './Mob';

export interface MobSpawnerConfig {
  scene: Phaser.Scene;
  spawnInterval: number;
  initialDelay?: number;
  yMin?: number;
  yMax?: number;
  xPos?: number;
  onWaveComplete?: (waveNumber: number) => void;
  onAllWavesComplete?: () => void;
}

export class MobSpawner {
  private scene: Phaser.Scene;
  private spawnInterval: number;
  private waveCount: number = 0;
  private currentWave: number = 0;
  private spawnTimer: Phaser.Time.TimerEvent;
  private mobs: Mob[] = [];
  private mobsInCurrentWave: number = 0;
  private mobsDestroyedInCurrentWave: number = 0;
  private waveConfig: any[] = [];
  private yMin: number;
  private yMax: number;
  private xPos: number;
  private onWaveComplete?: (waveNumber: number) => void;
  private onAllWavesComplete?: () => void;
  private isSpawning: boolean = false;
  
  constructor(config: MobSpawnerConfig) {
    this.scene = config.scene;
    this.spawnInterval = config.spawnInterval;
    this.yMin = config.yMin || 100;
    this.yMax = config.yMax || this.scene.scale.height - 100;
    this.xPos = config.xPos || this.scene.scale.width + 50;
    this.onWaveComplete = config.onWaveComplete;
    this.onAllWavesComplete = config.onAllWavesComplete;
    
    // Set up initial delay if provided
    if (config.initialDelay) {
      this.scene.time.delayedCall(config.initialDelay, () => {
        this.configureWaves();
      });
    } else {
      this.configureWaves();
    }
  }
  
  private configureWaves(): void {
    // Configure waves based on difficulty progression
    this.waveConfig = [
      // Wave 1: Just normal mobs
      {
        count: 5,
        types: ['normal'],
        weights: [1]
      },
      // Wave 2: Normal + few tank mobs
      {
        count: 8,
        types: ['normal', 'tank'],
        weights: [0.7, 0.3]
      },
      // Wave 3: Normal + tank + armored
      {
        count: 10,
        types: ['normal', 'tank', 'armored'],
        weights: [0.5, 0.3, 0.2]
      },
      // Wave 4: All basic types
      {
        count: 12,
        types: ['normal', 'tank', 'armored', 'speedster'],
        weights: [0.4, 0.3, 0.2, 0.1]
      },
      // Wave 5: Advanced mobs
      {
        count: 15,
        types: ['normal', 'tank', 'armored', 'speedster', 'shielded'],
        weights: [0.3, 0.3, 0.2, 0.1, 0.1]
      },
      // Wave 6: Boss wave
      {
        count: 1,
        types: ['boss'],
        weights: [1]
      }
    ];
    
    this.waveCount = this.waveConfig.length;
  }
  
  startWave(waveNumber: number = 0): void {
    if (waveNumber >= this.waveCount) {
      if (this.onAllWavesComplete) {
        this.onAllWavesComplete();
      }
      return;
    }
    
    this.currentWave = waveNumber;
    const wave = this.waveConfig[this.currentWave];
    this.mobsInCurrentWave = wave.count;
    this.mobsDestroyedInCurrentWave = 0;
    
    // Show wave start message
    const waveText = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      `Wave ${this.currentWave + 1}`,
      {
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6
      }
    ).setOrigin(0.5);
    
    // Fade out and remove the text
    this.scene.tweens.add({
      targets: waveText,
      alpha: 0,
      duration: 2000,
      onComplete: () => {
        waveText.destroy();
        this.startSpawning();
      }
    });
  }
  
  private startSpawning(): void {
    if (this.isSpawning) return;
    this.isSpawning = true;
    
    // Create and start a timer for spawning mobs
    this.spawnTimer = this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnMob,
      callbackScope: this,
      repeat: this.mobsInCurrentWave - 1
    });
  }
  
  stopSpawning(): void {
    if (this.spawnTimer) {
      this.spawnTimer.remove();
    }
    this.isSpawning = false;
  }
  
  private spawnMob(): void {
    if (!this.isSpawning) return;
    
    const wave = this.waveConfig[this.currentWave];
    
    // Select a random mob type based on weights
    const mobType = this.selectMobType(wave.types, wave.weights);
    
    // Random Y position within bounds
    const y = Math.random() * (this.yMax - this.yMin) + this.yMin;
    
    // Create the mob
    const mob = createMob(this.scene, this.xPos, y, mobType);
    
    // Add to tracking array
    this.mobs.push(mob);
    
    // Set up callback for when mob is destroyed
    const originalDestroy = mob.destroy;
    mob.destroy = () => {
      this.mobs = this.mobs.filter(m => m !== mob);
      this.mobsDestroyedInCurrentWave++;
      
      // Check if wave is complete
      if (this.mobsDestroyedInCurrentWave >= this.mobsInCurrentWave) {
        this.waveComplete();
      }
      
      // Call original destroy method
      originalDestroy.call(mob);
    };
  }
  
  private selectMobType(types: string[], weights: number[]): string {
    // Normalize weights if they don't sum to 1
    const sum = weights.reduce((a, b) => a + b, 0);
    const normalizedWeights = weights.map(w => w / sum);
    
    // Random selection based on weights
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < types.length; i++) {
      cumulativeWeight += normalizedWeights[i];
      if (random < cumulativeWeight) {
        return types[i];
      }
    }
    
    // Fallback
    return types[0];
  }
  
  private waveComplete(): void {
    this.isSpawning = false;
    
    if (this.onWaveComplete) {
      this.onWaveComplete(this.currentWave);
    }
    
    // Start next wave after delay
    this.scene.time.delayedCall(3000, () => {
      this.startWave(this.currentWave + 1);
    });
  }
  
  // Get active mobs for the typing system to find matches
  getActiveMobs(): Mob[] {
    return this.mobs;
  }
  
  update(time: number, delta: number): void {
    // Update all active mobs
    this.mobs.forEach(mob => mob.update(time, delta));
  }
}

// Contains AI-generated edits.
