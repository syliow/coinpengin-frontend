/**
 * Formatting Utilities
 * Helper functions for consistent formatting across the app
 */

/**
 * Format currency values
 * @param {number} value - Value to format
 * @param {string} currency - Currency code (USD, MYR)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  const symbol = currency === 'USD' ? '$' : 'RM';
  
  if (value === null || value === undefined) {
    return `${symbol}0.00`;
  }
  
  return `${symbol}${formatNumber(value)}`;
};

/**
 * Format large numbers with commas
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) {
    return '0';
  }
  
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format percentage values
 * @param {number} value - Percentage value
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) {
    return '0.00%';
  }
  
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format large numbers to abbreviated form (K, M, B, T)
 * @param {number} value - Number to abbreviate
 * @returns {string} Abbreviated number
 */
export const formatAbbreviated = (value) => {
  if (value === null || value === undefined) {
    return '0';
  }
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  
  return value.toFixed(2);
};

/**
 * Get color class for percentage changes
 * @param {number} value - Percentage value
 * @returns {string} Tailwind color class
 */
export const getChangeColor = (value) => {
  if (value > 0) return 'text-accent-green';
  if (value < 0) return 'text-accent-red';
  return 'text-gray-500';
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format datetime for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
