// MobRegistry.ts
// Central registry/factory for mob types
import type { MobConfig, IMob } from './Mob';

type MobConstructor = new (config: MobConfig) => IMob;

class MobRegistry {
  private static registry: Map<string, MobConstructor> = new Map();

  static registerMob(type: string, ctor: MobConstructor) {
    this.registry.set(type, ctor);
  }

  static createMob(type: string, config: MobConfig): IMob {
    const ctor = this.registry.get(type);
    if (!ctor) throw new Error(`Mob type '${type}' not registered.`);
    return new ctor(config);
  }

  static getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }
}

export default MobRegistry;
// Contains AI-generated edits.
