import { debounce as _debounce, throttle as _throttle } from 'lodash';

/**
 * Rate Limiting Utilities
 * Debounce and throttle functions for user actions
 */

/**
 * Create a debounced function
 * Delays execution until after wait milliseconds have elapsed since last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 500) => {
  return _debounce(func, wait);
};

/**
 * Create a throttled function
 * Limits execution to once per wait milliseconds
 * @param {Function} func - Function to throttle
 * @param {number} wait - Milliseconds between calls
 * @returns {Function} Throttled function
 */
export const throttle = (func, wait = 2000) => {
  return _throttle(func, wait, { trailing: false });
};

/**
 * Create cooldown manager for buttons
 * Prevents rapid clicking
 */
export class CooldownManager {
  constructor() {
    this.cooldowns = new Map();
  }

  /**
   * Check if action is on cooldown
   * @param {string} key - Unique identifier for the action
   * @returns {boolean} True if on cooldown
   */
  isOnCooldown(key) {
    const cooldownEnd = this.cooldowns.get(key);
    if (!cooldownEnd) return false;
    
    const now = Date.now();
    if (now < cooldownEnd) {
      return true;
    }
    
    this.cooldowns.delete(key);
    return false;
  }

  /**
   * Set cooldown for an action
   * @param {string} key - Unique identifier
   * @param {number} duration - Duration in milliseconds
   */
  setCooldown(key, duration = 2000) {
    this.cooldowns.set(key, Date.now() + duration);
  }

  /**
   * Clear cooldown for an action
   * @param {string} key - Unique identifier
   */
  clearCooldown(key) {
    this.cooldowns.delete(key);
  }

  /**
   * Clear all cooldowns
   */
  clearAll() {
    this.cooldowns.clear();
  }
}

// Global cooldown manager instance
export const cooldownManager = new CooldownManager();
