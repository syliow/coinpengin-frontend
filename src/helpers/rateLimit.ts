import { debounce as _debounce, throttle as _throttle, DebouncedFunc } from 'lodash';

/**
 * Rate Limiting Utilities
 */

/**
 * Create a debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = 500
): DebouncedFunc<T> => {
  return _debounce(func, wait);
};

/**
 * Create a throttled function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number = 2000
): DebouncedFunc<T> => {
  return _throttle(func, wait, { trailing: false });
};

/**
 * Cooldown manager for buttons
 */
export class CooldownManager {
  private cooldowns: Map<string, number>;

  constructor() {
    this.cooldowns = new Map();
  }

  isOnCooldown(key: string): boolean {
    const cooldownEnd = this.cooldowns.get(key);
    if (!cooldownEnd) return false;
    
    const now = Date.now();
    if (now < cooldownEnd) {
      return true;
    }
    
    this.cooldowns.delete(key);
    return false;
  }

  setCooldown(key: string, duration: number = 2000): void {
    this.cooldowns.set(key, Date.now() + duration);
  }

  clearCooldown(key: string): void {
    this.cooldowns.delete(key);
  }

  clearAll(): void {
    this.cooldowns.clear();
  }
}

export const cooldownManager = new CooldownManager();
