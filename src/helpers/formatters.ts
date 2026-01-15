/**
 * Formatting Utilities
 */

/**
 * Format currency values
 */
export const formatCurrency = (value: number | null | undefined, currency: string = 'USD'): string => {
  const symbol = currency === 'USD' ? '$' : 'RM';
  
  if (value === null || value === undefined) {
    return `${symbol}0.00`;
  }
  
  return `${symbol}${formatNumber(value)}`;
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (value: number | null | undefined, decimals: number = 2): string => {
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
 */
export const formatPercentage = (value: number | null | undefined, decimals: number = 2): string => {
  if (value === null || value === undefined) {
    return '0.00%';
  }
  
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format large numbers to abbreviated form
 */
export const formatAbbreviated = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '0';
  }
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (absValue >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (absValue >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (absValue >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  
  return value.toFixed(2);
};

/**
 * Get color class for percentage changes
 */
export const getChangeColor = (value: number | null | undefined): string => {
  if (!value) return 'text-gray-500';
  if (value > 0) return 'text-accent-green';
  if (value < 0) return 'text-accent-red';
  return 'text-gray-500';
};

/**
 * Format date for display
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format datetime for display
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
