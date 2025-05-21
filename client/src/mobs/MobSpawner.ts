import Phaser from 'phaser';
import { MobConfig } from './Mob';
import { NormalLetterMob, WordMob } from './MobTypes';

export interface WaveConfig {
  waveNumber: number;
  mobCount: number;
  spawnInterval: number;
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
  private mobTypePercentages: { letter: number; word: number } = { letter: 100, word: 0 };

  constructor(scene: Phaser.Scene, config: {
    totalWaves: number;
    initialSpawnInterval: number;
    gameWidth: number;
    gameHeight: number;
    mobTypePercentages?: { letter: number; word: number };
    onWaveComplete?: (waveNumber: number) => void;
  }) {
    this.scene = scene;
    this.waveCount = config.totalWaves || 5;
    this.spawnInterval = config.initialSpawnInterval || 2000;
    this.gameWidth = config.gameWidth;
    this.gameHeight = config.gameHeight;
    this.onWaveComplete = config.onWaveComplete || (() => {});
    if (config.mobTypePercentages) {
      this.mobTypePercentages = config.mobTypePercentages;
    }
    
    // Setup wave configurations
    this.setupWaves();
  }

  private getDynamicSpawnInterval(waveNumber: number): number {
    // Exponential decay for smoother scaling
    const minInterval = 400; // ms, minimum spawn interval
    const decayRate = 0.13; // how quickly it ramps up
    return Math.max(
      minInterval,
      this.spawnInterval * Math.exp(-decayRate * waveNumber)
    );
  }

  private setupWaves(): void {
    // Smooth spawn interval scaling using getDynamicSpawnInterval
    this.wavesConfig = Array.from({ length: this.waveCount }, (_, i) => ({
      waveNumber: i + 1,
      mobCount: 5 + i * 2, // Example scaling
      spawnInterval: this.getDynamicSpawnInterval(i),
      difficulty: i + 1,
    }));
  }

  start(): void {
    this.currentWave = 0;
    this.startNextWave();
  }

  private selectMobType(): 'letter' | 'word' {
    const rand = Math.random() * 100;
    if (rand < this.mobTypePercentages.letter) return 'letter';
    return 'word';
  }

  private startNextWave(): void {
    if (this.currentWave >= this.wavesConfig.length) {
      this.onWaveComplete(this.currentWave);
      return;
    }
    const wave = this.wavesConfig[this.currentWave];
    this.spawnQueue = this.generateMobs(wave.mobCount, wave.difficulty);
    this.isSpawning = true;
    this.spawnTimer = this.scene.time.addEvent({
      delay: wave.spawnInterval,
      repeat: this.spawnQueue.length - 1,
      callback: this.spawnMobFromQueue,
      callbackScope: this,
    });
  }

  private generateMobs(count: number, difficulty: number): MobConfig[] {
    const mobs: MobConfig[] = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const words = ['SPACE', 'TYPER', 'DRIVE', 'PHASER', 'GAME', 'LEVEL', 'MOB', 'BOSS', 'SPEED', 'POWER'];
    for (let i = 0; i < count; i++) {
      const mobType = this.selectMobType();
      if (mobType === 'letter') {
        const letter = letters[Math.floor(Math.random() * letters.length)];
        mobs.push({
          id: `mob_${this.currentWave}_${i}`,
          letters: [letter],
          speed: 50 + difficulty * 10,
          x: Math.random() * (this.gameWidth - 100) + 50,
          y: 0,
          scene: this.scene,
        });
      } else {
        const word = words[Math.floor(Math.random() * words.length)];
        mobs.push({
          id: `mob_${this.currentWave}_${i}`,
          letters: word.split(''),
          speed: 40 + difficulty * 8,
          x: Math.random() * (this.gameWidth - 100) + 50,
          y: 0,
          scene: this.scene,
        });
      }
    }
    return mobs;
  }

  private spawnMobFromQueue(): void {
    if (this.spawnQueue.length === 0) {
      this.isSpawning = false;
      this.currentWave++;
      this.onWaveComplete(this.currentWave);
      this.startNextWave();
      return;
    }
    const mobConfig = this.spawnQueue.shift();
    if (mobConfig) {
      let mob;
      if (mobConfig.letters.length === 1) {
        mob = new NormalLetterMob(mobConfig);
      } else {
        mob = new WordMob(mobConfig);
      }
      this.activeMobs.set(mobConfig.id, mob);
    }
  }

  getActiveMobs(): Map<string, any> {
    return this.activeMobs;
  }

  removeMob(id: string): void {
    this.activeMobs.delete(id);
  }
}

// Contains AI-generated edits.
