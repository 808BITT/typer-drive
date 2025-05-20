import Phaser from 'phaser';
import { getContrastingTextColor } from '../utils/ColorUtils';

// Interface for mob configuration
export interface MobConfig {
  id: string;
  letters: string[];
  speed: number;
  backgroundColor?: string;
  onTyped?: (letter: string) => void;
  onReachPlayer?: () => void;
}

export class Mob extends Phaser.GameObjects.Container {
  private id: string;
  private letters: string[];
  private currentLetterIndex: number = 0;
  private speed: number;
  private textObjects: Phaser.GameObjects.Text[] = [];
  private background: Phaser.GameObjects.Rectangle;
  private backgroundColor: string;
  private onTypedCallback?: (letter: string) => void;
  private onReachPlayerCallback?: () => void;
  
  // Default colors if none specified
  private static readonly DEFAULT_BG_COLOR = '#4287f5';
  private static readonly LETTER_PADDING = 10;
  private static readonly FONT_SIZE = 28;
  
  constructor(scene: Phaser.Scene, x: number, y: number, config: MobConfig) {
    super(scene, x, y);
    
    this.id = config.id;
    this.letters = [...config.letters]; // Clone the array
    this.speed = config.speed;
    this.backgroundColor = config.backgroundColor || Mob.DEFAULT_BG_COLOR;
    this.onTypedCallback = config.onTyped;
    this.onReachPlayerCallback = config.onReachPlayer;
    
    this.createVisuals();
    
    // Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
  
  private createVisuals(): void {
    // Calculate width based on letters
    const letterWidth = Mob.FONT_SIZE * 0.8;
    const boxWidth = (this.letters.length * letterWidth) + (Mob.LETTER_PADDING * 2);
    const boxHeight = Mob.FONT_SIZE * 1.5;
    
    // Create background
    this.background = this.scene.add.rectangle(
      0, 
      0, 
      boxWidth, 
      boxHeight, 
      parseInt(this.backgroundColor.replace('#', '0x'))
    );
    this.add(this.background);
    
    // Get contrasting text color based on background color
    const textColor = getContrastingTextColor(this.backgroundColor);
    
    // Create text for each letter
    this.letters.forEach((letter, index) => {
      const xPos = ((index - (this.letters.length - 1) / 2) * letterWidth);
      
      const textObject = this.scene.add.text(
        xPos, 
        0, 
        letter, 
        { 
          fontSize: `${Mob.FONT_SIZE}px`,
          color: textColor, // Using contrasting color
          fontFamily: 'Arial',
          fontStyle: 'bold'
        }
      ).setOrigin(0.5);
      
      this.textObjects.push(textObject);
      this.add(textObject);
    });
  }
  
  update(time: number, delta: number): void {
    // Move mob left
    this.x -= this.speed * (delta / 1000);
    
    // Check if mob reached left side
    if (this.x < 0 && this.onReachPlayerCallback) {
      this.onReachPlayerCallback();
      this.destroy();
    }
  }
  
  onTyped(letter: string): boolean {
    // Check if letter matches the current target
    if (this.currentLetterIndex < this.letters.length && 
        this.letters[this.currentLetterIndex].toLowerCase() === letter.toLowerCase()) {
      
      // Highlight the typed letter
      this.highlightLetter(this.currentLetterIndex);
      
      // Move to next letter
      this.currentLetterIndex++;
      
      // Call the callback if provided
      if (this.onTypedCallback) {
        this.onTypedCallback(letter);
      }
      
      // If all letters typed, destroy the mob
      if (this.currentLetterIndex >= this.letters.length) {
        this.playDestroyAnimation();
      }
      
      return true;
    }
    
    return false;
  }
  
  private highlightLetter(index: number): void {
    // Make the letter disappear or change appearance
    if (index < this.textObjects.length) {
      this.textObjects[index].setAlpha(0.3);
      
      // Add small particle effect
      this.scene.add.particles(1, 2, 'particle', {
        x: this.x + this.textObjects[index].x,
        y: this.y,
        speed: 50,
        lifespan: 300,
        scale: { start: 0.5, end: 0 },
        quantity: 5,
        blendMode: 'ADD'
      });
    }
  }
  
  private playDestroyAnimation(): void {
    // Add explosion effect
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      onComplete: () => {
        this.destroy();
      }
    });
  }
  
  // Getters
  public getLetters(): string[] {
    return this.letters;
  }
  
  public getCurrentLetterIndex(): number {
    return this.currentLetterIndex;
  }
  
  public getSpeed(): number {
    return this.speed;
  }
  
  public getMobId(): string {
    return this.id;
  }
}

// Factory function to create different types of mobs
export function createMob(scene: Phaser.Scene, x: number, y: number, type: string): Mob {
  switch (type.toLowerCase()) {
    case 'normal':
      return createNormalMob(scene, x, y);
    case 'tank':
      return createTankMob(scene, x, y);
    case 'armored':
      return createArmoredMob(scene, x, y);
    case 'shielded':
      return createShieldedMob(scene, x, y);
    case 'regenerator':
      return createRegeneratorMob(scene, x, y);
    case 'split':
      return createSplitMob(scene, x, y);
    case 'stealth':
      return createStealthMob(scene, x, y);
    case 'speedster':
      return createSpeedsterMob(scene, x, y);
    case 'boss':
      return createBossMob(scene, x, y);
    default:
      return createNormalMob(scene, x, y);
  }
}

// Individual mob type creators
function createNormalMob(scene: Phaser.Scene, x: number, y: number): Mob {
  return new Mob(scene, x, y, {
    id: `normal-${Date.now()}`,
    letters: [String.fromCharCode(97 + Math.floor(Math.random() * 26))], // Random letter
    speed: 100,
    backgroundColor: '#4287f5' // Blue
  });
}

function createTankMob(scene: Phaser.Scene, x: number, y: number): Mob {
  // Generate random word (3-5 letters)
  const wordLength = Math.floor(Math.random() * 3) + 3; // 3-5 letters
  const letters = [];
  for (let i = 0; i < wordLength; i++) {
    letters.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
  }
  
  return new Mob(scene, x, y, {
    id: `tank-${Date.now()}`,
    letters: letters,
    speed: 80,
    backgroundColor: '#f54242' // Red
  });
}

function createArmoredMob(scene: Phaser.Scene, x: number, y: number): Mob {
  return new Mob(scene, x, y, {
    id: `armored-${Date.now()}`,
    letters: [
      String.fromCharCode(97 + Math.floor(Math.random() * 26)),
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ],
    speed: 90,
    backgroundColor: '#42f569' // Green
  });
}

function createShieldedMob(scene: Phaser.Scene, x: number, y: number): Mob {
  // Generate random word (4-6 letters) with # prefix
  const wordLength = Math.floor(Math.random() * 3) + 4; // 4-6 letters
  const letters = ['#']; // Shield key
  for (let i = 0; i < wordLength; i++) {
    letters.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
  }
  
  return new Mob(scene, x, y, {
    id: `shielded-${Date.now()}`,
    letters: letters,
    speed: 75,
    backgroundColor: '#9c42f5' // Purple
  });
}

function createRegeneratorMob(scene: Phaser.Scene, x: number, y: number): Mob {
  // Generate random word (3-5 letters)
  const wordLength = Math.floor(Math.random() * 3) + 3; // 3-5 letters
  const letters = [];
  for (let i = 0; i < wordLength; i++) {
    letters.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
  }
  
  return new Mob(scene, x, y, {
    id: `regenerator-${Date.now()}`,
    letters: letters,
    speed: 70,
    backgroundColor: '#f5a742' // Orange
  });
}

function createSplitMob(scene: Phaser.Scene, x: number, y: number): Mob {
  // Generate 6-letter word
  const letters = [];
  for (let i = 0; i < 6; i++) {
    letters.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
  }
  
  return new Mob(scene, x, y, {
    id: `split-${Date.now()}`,
    letters: letters,
    speed: 85,
    backgroundColor: '#42f5f5' // Cyan
  });
}

function createStealthMob(scene: Phaser.Scene, x: number, y: number): Mob {
  return new Mob(scene, x, y, {
    id: `stealth-${Date.now()}`,
    letters: [String.fromCharCode(97 + Math.floor(Math.random() * 26))],
    speed: 120,
    backgroundColor: '#666666' // Dark Grey
  });
}

function createSpeedsterMob(scene: Phaser.Scene, x: number, y: number): Mob {
  return new Mob(scene, x, y, {
    id: `speedster-${Date.now()}`,
    letters: [
      String.fromCharCode(97 + Math.floor(Math.random() * 26)),
      String.fromCharCode(97 + Math.floor(Math.random() * 26))
    ],
    speed: 200,
    backgroundColor: '#f542f2' // Pink
  });
}

function createBossMob(scene: Phaser.Scene, x: number, y: number): Mob {
  // Generate longer word (8-12 letters)
  const wordLength = Math.floor(Math.random() * 5) + 8; // 8-12 letters
  const letters = [];
  for (let i = 0; i < wordLength; i++) {
    letters.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
  }
  
  return new Mob(scene, x, y, {
    id: `boss-${Date.now()}`,
    letters: letters,
    speed: 50,
    backgroundColor: '#ff0000' // Bright Red
  });
}

// Contains AI-generated edits.
