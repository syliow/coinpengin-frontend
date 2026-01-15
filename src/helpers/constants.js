/**
 * Application Constants
 */

// Currency options
export const CURRENCY_OPTIONS = [
  { label: 'USD', value: 'USD', symbol: '$' },
  { label: 'MYR', value: 'MYR', symbol: 'RM' },
];

// Chart time range options
export const CHART_DAYS = [
  { label: '24 Hours', value: 1 },
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '3 Months', value: 90 },
  { label: '1 Year', value: 365 },
];

// Rate limiting settings
export const RATE_LIMITS = {
  SEARCH_DEBOUNCE: 500, // ms
  WISHLIST_COOLDOWN: 2000, // ms
  API_THROTTLE: 1000, // ms
};

// Cache TTL (if implementing client-side caching)
export const CACHE_TTL = {
  MARKET_DATA: 60000, // 1 minute
  COIN_DETAILS: 180000, // 3 minutes
};

// Table settings
export const TABLE_SETTINGS = {
  ITEMS_PER_PAGE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Toast notification settings
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// API endpoints (for reference)
export const API_ENDPOINTS = {
  COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
  BACKEND_BASE: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
};
