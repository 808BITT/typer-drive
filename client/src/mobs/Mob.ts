import Phaser from 'phaser';

export interface MobConfig {
  id: string;
  letters: string[];
  speed: number;
  x: number;
  y: number;
  scene: Phaser.Scene;
}

export interface IMob {
  id: string;
  letters: string[];
  speed: number;
  active: boolean;
  mobPosition: Phaser.Math.Vector2;
  onTyped(letter: string): boolean;
  onReachPlayer(): void;
  render(): void;
  update(delta: number): void;
  destroy(): void;
}

export abstract class BaseMob extends Phaser.GameObjects.Container implements IMob {
  id: string;
  letters: string[];
  speed: number;
  active: boolean = true;
  protected currentLetterIndex: number = 0;
  protected textObjects: Phaser.GameObjects.Text[] = [];
  protected playerPosition: number;

  constructor(config: MobConfig) {
    super(config.scene, config.x, config.y);
    
    this.id = config.id;
    this.letters = config.letters;
    this.speed = config.speed;
    this.mobPosition = new Phaser.Math.Vector2(config.x, config.y);
    this.playerPosition = 100; // Default player position on the left
    
    config.scene.add.existing(this);
    this.render();
  }
    get mobPosition(): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(this.x, this.y);
    }

    set mobPosition(value: Phaser.Math.Vector2) {
        this.x = value.x;
        this.y = value.y;
    }


  abstract onTyped(letter: string): boolean;

  onReachPlayer(): void {
    // Default behavior is to damage player (will be implemented by HUD system)
    if (this.scene.events) {
      this.scene.events.emit('player-damaged', 1);
    }
    this.destroy();
  }

  protected renderBackground(): void {
    // Subclasses can override to add backgrounds before text
  }

  render(): void {
    // Clear any existing text objects
    this.textObjects.forEach(text => text.destroy());
    this.textObjects = [];
    // Clear any background objects (if needed in future)
    // Call background hook before adding text
    this.renderBackground();
    // Create new text objects for each letter
    this.letters.forEach((letter, index) => {
      const textObject = this.scene.add.text(index * 20, 0, letter, {
        fontSize: '24px',
        color: index === this.currentLetterIndex ? '#ffffff' : '#aaaaaa',
        fontFamily: 'monospace',
      });
      // Add a black stroke for visibility
      textObject.setStroke('#000000', 4);
      // Add a subtle shadow for extra contrast
      textObject.setShadow(2, 2, '#000000', 2, true, true);
      this.textObjects.push(textObject);
      this.add(textObject);
    });
  }

  update(delta: number): void {
    // Move left toward player
    this.x -= this.speed * delta / 1000;
    this.mobPosition.x = this.x;
    
    // Check if reached player
    if (this.x <= this.playerPosition) {
      this.onReachPlayer();
    }
  }

  destroy(): void {
    this.active = false;
    super.destroy();
  }

  setPlayerPosition(x: number): void {
    this.playerPosition = x;
  }
}

// Effects for mob hit/destruction
export class MobEffects {
  static createHitEffect(scene: Phaser.Scene, x: number, y: number): void {
    const particles = scene.add.particles(x, y, 'hit-particle', {
      lifespan: 300,
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      quantity: 5,
      emitting: false
    });
    
    particles.explode();
    
    scene.time.delayedCall(300, () => {
      particles.destroy();
    });
  }
  
  static createDestroyEffect(scene: Phaser.Scene, x: number, y: number): void {
    const particles = scene.add.particles(x, y, 'explosion-particle', {
      lifespan: 500,
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      quantity: 15,
      emitting: false
    });
    
    particles.explode();
    
    scene.time.delayedCall(500, () => {
      particles.destroy();
    });
  }
}
