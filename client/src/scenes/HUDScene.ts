// HUDScene.ts
//
// Integration Instructions:
// 1. Import HUDScene and add it to your Phaser game config's scene array.
// 2. Start the HUD scene above your game scenes using this.scene.launch('HUDScene') and this.scene.bringToTop('HUDScene').
// 3. Use the public update methods to update HUD elements from other scenes.
//
// Example usage:
//   this.scene.get('HUDScene').updateScore(42);
//
import Phaser from 'phaser';

interface HUDElement {
    type: 'text' | 'bar';
    key: string;
    position: { x: number; y: number };
    initial?: string;
    max?: number;
}

export default class HUDScene extends Phaser.Scene {
    private textElements: Record<string, Phaser.GameObjects.Text> = {};
    private barElements: Record<string, { bar: Phaser.GameObjects.Graphics; max: number; value: number; pos: { x: number; y: number } }> = {};

    private elements: HUDElement[] = [
        { type: 'text', key: 'score', position: { x: 10, y: 10 }, initial: 'Score: 0' },
        { type: 'bar', key: 'health', position: { x: 10, y: 30 }, max: 100 }
    ];

    constructor() {
        super({ key: 'HUDScene' });
    }

    create() {
        this.elements.forEach(element => {
            if (element.type === 'text') {
                const text = this.add.text(element.position.x, element.position.y, element.initial || '', { fontSize: '20px', color: '#fff' });
                this.textElements[element.key] = text;
            } else if (element.type === 'bar') {
                const bar = this.add.graphics();
                bar.fillStyle(0xff0000, 1);
                bar.fillRect(element.position.x, element.position.y, 100, 20);
                this.barElements[element.key] = {
                    bar,
                    max: element.max || 100,
                    value: element.max || 100,
                    pos: element.position
                };
                this.drawBar(element.key);
            }
        });
    }

    // Example: updateScore(42)
    public updateScore(value: number) {
        if (this.textElements['score']) {
            this.textElements['score'].setText(`Score: ${value}`);
        }
    }

    // Example: updateHealth(75)
    public updateHealth(value: number) {
        const barObj = this.barElements['health'];
        if (barObj) {
            barObj.value = Phaser.Math.Clamp(value, 0, barObj.max);
            this.drawBar('health');
        }
    }

    private drawBar(key: string) {
        const barObj = this.barElements[key];
        if (!barObj) return;
        const { bar, max, value, pos } = barObj;
        bar.clear();
        bar.fillStyle(0x222222, 1);
        bar.fillRect(pos.x, pos.y, 100, 20);
        bar.fillStyle(0xff0000, 1);
        const width = (value / max) * 100;
        bar.fillRect(pos.x, pos.y, width, 20);
    }
}
