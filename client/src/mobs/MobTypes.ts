import Phaser from 'phaser';
import { BaseMob, MobEffects } from '../mobs/Mob';

export class NormalLetterMob extends BaseMob {
  constructor(config: any) {
    super(config);
  }

  onTyped(letter: any) {
    if (this.letters[this.currentLetterIndex] === letter) {
      // Correct key was typed
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      MobEffects.createDestroyEffect(this.scene, this.x, this.y);

      // Award points
      this.scene.events.emit('score-updated', 10);
      
      // Destroy the mob
      this.destroy();
      return true;
    }
    
    // Wrong key was typed
    return false;
  }
}

export class TankWordMob extends BaseMob {
  constructor(config: any) {
    super(config);
  }

  onTyped(letter: any) {
    if (this.letters[this.currentLetterIndex] === letter) {
      // Correct key was typed
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      
      // Remove first letter
      this.currentLetterIndex++;
      
      // Check if all letters have been typed
      if (this.currentLetterIndex >= this.letters.length) {
        MobEffects.createDestroyEffect(this.scene, this.x, this.y);
        
        // Award points
        this.scene.events.emit('score-updated', 10 * this.letters.length);
        
        // Destroy the mob
        this.destroy();
      } else {
        // Render the updated text
        this.render();
      }
      
      return true;
    }
    
    // Wrong key was typed
    return false;
  }
}

export class ArmoredLetterMob extends BaseMob {
  armorIntact: boolean;

  constructor(config: any) {
    super(config);
    this.armorIntact = true;
  }

  onTyped(letter: any) {
    if (this.letters[this.currentLetterIndex] === letter) {
      // Correct key was typed
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      
      if (this.armorIntact) {
        // Break armor
        this.armorIntact = false;
        this.currentLetterIndex++;
        this.render();
        
        // Award points for breaking armor
        this.scene.events.emit('score-updated', 5);
      } else {
        // Kill mob
        MobEffects.createDestroyEffect(this.scene, this.x, this.y);
        
        // Award points
        this.scene.events.emit('score-updated', 15);
        
        // Destroy the mob
        this.destroy();
      }
      
      return true;
    }
    
    // Wrong key was typed
    return false;
  }

  render() {
    super.render();
    
    // Add armor visual
    if (this.armorIntact) {
      const armorGraphic = this.scene.add.graphics();
      armorGraphic.lineStyle(2, 0x00ffff, 1);
      armorGraphic.strokeRoundedRect(-10, -10, this.width + 20, this.height + 20, 5);
      this.add(armorGraphic);
    }
  }
}

export class ShieldedWordMob extends BaseMob {
  shielded: boolean;
  shieldKey: string;

  constructor(config: any, shieldKey = '#') {
    super(config);
    this.shielded = true;
    this.shieldKey = shieldKey;
  }

  onTyped(letter: any) {
    if (this.shielded) {
      if (letter === this.shieldKey) {
        // Break shield
        this.shielded = false;
        this.render();
        
        // Award points for breaking shield
        this.scene.events.emit('score-updated', 5);
        return true;
      }
      return false;
    }
    
    // If not shielded, behave like a TankWordMob
    if (this.letters[this.currentLetterIndex] === letter) {
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      
      this.currentLetterIndex++;
      
      if (this.currentLetterIndex >= this.letters.length) {
        MobEffects.createDestroyEffect(this.scene, this.x, this.y);
        this.scene.events.emit('score-updated', 10 * this.letters.length);
        this.destroy();
      } else {
        this.render();
      }
      
      return true;
    }
    
    return false;
  }

  render() {
    super.render();
    
    if (this.shielded) {
      // Add shield visual and shield key
      const shieldGraphic = this.scene.add.graphics();
      shieldGraphic.lineStyle(3, 0x00ff00, 1);
      shieldGraphic.strokeCircle(this.width / 2, this.height / 2, this.width / 2 + 15);
      
      const shieldText = this.scene.add.text(
        this.width / 2, 
        -20, 
        this.shieldKey, 
        { 
          fontSize: '18px', 
          color: '#00ff00',
          backgroundColor: '#333333',
          padding: { x: 5, y: 5 }
        }
      );
      shieldText.setOrigin(0.5);
      
      this.add(shieldGraphic);
      this.add(shieldText);
    }
  }
}

export class RegeneratorMob extends BaseMob {
  regenerationTimer: any;
  removedLetters: string[];

  constructor(config: any) {
    super(config);
    this.regenerationTimer = null;
    this.removedLetters = [];
  }

  onTyped(letter: any) {
    if (this.letters[this.currentLetterIndex] === letter) {
      // Correct key was typed
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      
      // Store the typed letter for possible regeneration
      this.removedLetters.push(this.letters[this.currentLetterIndex]);
      
      // Remove letter
      this.currentLetterIndex++;
      
      // Check if all letters have been typed
      if (this.currentLetterIndex >= this.letters.length) {
        MobEffects.createDestroyEffect(this.scene, this.x, this.y);
        this.scene.events.emit('score-updated', 10 * this.letters.length);
        this.destroy();
        return true;
      }
      
      // Cancel existing timer if any
      if (this.regenerationTimer) {
        this.regenerationTimer.remove();
      }
      
      // Start a new regeneration timer
      this.regenerationTimer = this.scene.time.delayedCall(1000, this.regenerateLetter, [], this);
      
      // Render the updated text
      this.render();
      
      return true;
    }
    
    // Wrong key was typed
    return false;
  }

  regenerateLetter() {
    if (this.removedLetters.length > 0 && this.currentLetterIndex > 0) {
      // Regenerate the last removed letter
      this.currentLetterIndex--;
      this.removedLetters.pop();
      
      // Visual feedback for regeneration
      const regenEffect = this.scene.add.particles(this.x, this.y, 'regeneration-particle', {
        lifespan: 500,
        speed: { min: 20, max: 50 },
        scale: { start: 0, end: 0.5 },
        quantity: 10,
        emitting: false
      });
      
      regenEffect.explode();
      
      this.scene.time.delayedCall(500, () => {
        regenEffect.destroy();
      });
      
      // Render the updated text
      this.render();
    }
  }

  destroy() {
    if (this.regenerationTimer) {
      this.regenerationTimer.remove();
    }
    super.destroy();
  }
}

export class SplitWordMob extends BaseMob {
  hasSplit: boolean;

  constructor(config: any) {
    super(config);
    this.hasSplit = false;
    
    // Make sure we have enough letters to split
    if (config.letters.length < 6) {
      // Add some random letters to reach 6
      const alphabet = 'abcdefghijklmnopqrstuvwxyz';
      while (this.letters.length < 6) {
        this.letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
      }
    }
  }

  onTyped(letter: any) {
    if (this.letters[this.currentLetterIndex] === letter) {
      // Correct key was typed
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      
      // Remove letter
      this.currentLetterIndex++;
      
      // Check if half the letters have been typed
      if (!this.hasSplit && this.currentLetterIndex >= this.letters.length / 2) {
        this.hasSplit = true;
        this.splitMob();
      } else if (this.currentLetterIndex >= this.letters.length) {
        // All letters typed
        MobEffects.createDestroyEffect(this.scene, this.x, this.y);
        this.scene.events.emit('score-updated', 10 * this.letters.length);
        this.destroy();
      } else {
        // Render the updated text
        this.render();
      }
      
      return true;
    }
    
    // Wrong key was typed
    return false;
  }

  splitMob() {
    // Create split effect
    const splitEffect = this.scene.add.particles(this.x, this.y, 'split-particle', {
      lifespan: 500,
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      quantity: 15,
      emitting: false
    });
    
    splitEffect.explode();
    
    this.scene.time.delayedCall(500, () => {
      splitEffect.destroy();
    });
    
    // Create two new Tank Word Mobs
    const firstHalf = this.letters.slice(0, 3);
    const secondHalf = this.letters.slice(3);
    
    // Emit event to spawn new mobs
    this.scene.events.emit('spawn-split-mobs', [
      {
        id: `${this.id}-split-1`,
        letters: firstHalf,
        speed: this.speed * 1.2,
        x: this.x,
        y: this.y - 30,
        scene: this.scene
      },
      {
        id: `${this.id}-split-2`,
        letters: secondHalf,
        speed: this.speed * 1.2,
        x: this.x,
        y: this.y + 30,
        scene: this.scene
      }
    ]);
    
    // Destroy this mob
    this.destroy();
  }
}

export class StealthLetterMob extends BaseMob {
  visibilityTimer: any;
  isVisible: boolean;
  visibilityDuration: number;

  constructor(config: any) {
    super(config);
    this.visibilityTimer = null;
    this.isVisible = true;
    this.visibilityDuration = 500; // ms
    
    this.startVisibilityToggle();
  }

  onTyped(letter: any) {
    // Can only be typed when visible
    if (!this.isVisible) return false;
    
    if (this.letters[this.currentLetterIndex] === letter) {
      // Correct key was typed
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      MobEffects.createDestroyEffect(this.scene, this.x, this.y);
      
      // Award points
      this.scene.events.emit('score-updated', 15); // More points due to difficulty
      
      // Destroy the mob
      this.destroy();
      return true;
    }
    
    // Wrong key was typed
    return false;
  }

  startVisibilityToggle() {
    this.visibilityTimer = this.scene.time.addEvent({
      delay: this.visibilityDuration,
      callback: this.toggleVisibility,
      callbackScope: this,
      loop: true
    });
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.setAlpha(this.isVisible ? 1 : 0);
  }

  destroy() {
    if (this.visibilityTimer) {
      this.visibilityTimer.remove();
    }
    super.destroy();
  }
}

export class SpeedsterMob extends BaseMob {
  constructor(config: any) {
    // Speedster mobs move twice as fast
    config.speed *= 2;
    super(config);
  }

  onTyped(letter: any) {
    if (this.letters[this.currentLetterIndex] === letter) {
      // Correct key was typed
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      
      // Remove letter
      this.currentLetterIndex++;
      
      // Check if all letters have been typed
      if (this.currentLetterIndex >= this.letters.length) {
        MobEffects.createDestroyEffect(this.scene, this.x, this.y);
        
        // Award points - more due to difficulty
        this.scene.events.emit('score-updated', 20);
        
        // Destroy the mob
        this.destroy();
      } else {
        // Render the updated text
        this.render();
      }
      
      return true;
    }
    
    // Wrong key was typed
    return false;
  }
}

export class BossMob extends BaseMob {
  phase: number;
  maxPhases: number;
  phaseHealth: number[];

  constructor(config: any) {
    super(config);
    this.phase = 1;
    this.maxPhases = 3;
    this.phaseHealth = [];
    
    // Setup phase health based on letter length
    const lettersPerPhase = Math.ceil(this.letters.length / this.maxPhases);
    for (let i = 0; i < this.maxPhases; i++) {
      this.phaseHealth.push(lettersPerPhase);
    }
    
    // Boss mobs move slower
    this.speed *= 0.7;
  }

  onTyped(letter: any) {
    if (this.letters[this.currentLetterIndex] === letter) {
      // Correct key was typed
      MobEffects.createHitEffect(this.scene, this.x, this.y);
      
      // Reduce phase health
      this.phaseHealth[this.phase - 1]--;
      
      // Check if phase complete
      if (this.phaseHealth[this.phase - 1] <= 0) {
        this.advancePhase();
      }
      
      // Remove letter
      this.currentLetterIndex++;
      
      // Check if all letters have been typed
      if (this.currentLetterIndex >= this.letters.length) {
        MobEffects.createDestroyEffect(this.scene, this.x, this.y);
        this.scene.events.emit('score-updated', 50); // Boss gives big points
        this.destroy();
      } else {
        // Render the updated text
        this.render();
      }
      
      return true;
    }
    
    // Wrong key was typed
    return false;
  }

  advancePhase() {
    this.phase++;
    
    // Phase transition effect
    const phaseEffect = this.scene.add.particles(this.x, this.y, 'phase-particle', {
      lifespan: 800,
      speed: { min: 100, max: 200 },
      scale: { start: 1, end: 0 },
      quantity: 25,
      emitting: false
    });
    
    phaseEffect.explode();
    
    this.scene.time.delayedCall(800, () => {
      phaseEffect.destroy();
    });
    
    // Change appearance based on phase
    this.render();
    
    // Emit phase change event
    this.scene.events.emit('boss-phase-changed', this.phase);
  }

  render() {
    super.render();
    
    // Add phase-specific visuals
    const phaseGraphic = this.scene.add.graphics();
    
    switch (this.phase) {
      case 1:
        phaseGraphic.lineStyle(4, 0xff0000, 1);
        phaseGraphic.strokeCircle(this.width / 2, this.height / 2, this.width / 2 + 20);
        break;
      case 2:
        phaseGraphic.lineStyle(4, 0xff6600, 1);
        phaseGraphic.strokeRect(-15, -15, this.width + 30, this.height + 30);
        break;
      case 3:
        phaseGraphic.lineStyle(4, 0xffff00, 1);
        const points = [];
        const sides = 6;
        const size = this.width / 2 + 25;
        
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI / sides) + (Math.PI / 2);
          points.push({
            x: this.width / 2 + size * Math.cos(angle),
            y: this.height / 2 + size * Math.sin(angle)
          });
        }
        
        phaseGraphic.beginPath();
        phaseGraphic.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < sides; i++) {
          phaseGraphic.lineTo(points[i].x, points[i].y);
        }
        
        phaseGraphic.closePath();
        phaseGraphic.strokePath();
        break;
    }
    
    this.add(phaseGraphic);
    
    // Add boss health bar
    const totalHealth = this.phaseHealth.reduce((a, b) => a + b, 0);
    const maxHealth = this.letters.length;
    const healthPercent = Math.max(0, totalHealth / maxHealth);
    
    const healthBarBg = this.scene.add.graphics();
    healthBarBg.fillStyle(0x333333, 1);
    healthBarBg.fillRect(-10, -30, this.width + 20, 10);
    
    const healthBar = this.scene.add.graphics();
    healthBar.fillStyle(0xff0000, 1);
    healthBar.fillRect(-10, -30, (this.width + 20) * healthPercent, 10);
    
    this.add(healthBarBg);
    this.add(healthBar);
  }
}
