import type { CurrencyOption, ChartDayOption } from '../types';

/**
 * Application Constants
 */

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { label: 'USD', value: 'USD', symbol: '$' },
  { label: 'MYR', value: 'MYR', symbol: 'RM' },
];

export const CHART_DAYS: ChartDayOption[] = [
  { label: '24 Hours', value: 1 },
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '3 Months', value: 90 },
  { label: '1 Year', value: 365 },
];

export const RATE_LIMITS = {
  SEARCH_DEBOUNCE: 500,
  WISHLIST_COOLDOWN: 2000,
  API_THROTTLE: 1000,
} as const;

export const CACHE_TTL = {
  MARKET_DATA: 60000,
  COIN_DETAILS: 180000,
} as const;

export const TABLE_SETTINGS = {
  ITEMS_PER_PAGE: 25,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

export const TOAST_CONFIG = {
  position: 'top-right' as const,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const API_ENDPOINTS = {
  COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
  BACKEND_BASE: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
};
