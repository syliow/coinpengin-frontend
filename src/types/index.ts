/**
 * Frontend Types - Barrel Export
 */

export * from './coin';
export * from './user';
export * from './api';

/** Currency option type */
export interface CurrencyOption {
  label: string;
  value: string;
  symbol: string;
}

/** Chart day option type */
export interface ChartDayOption {
  label: string;
  value: number;
}

/** Theme type */
export type Theme = 'dark' | 'light';

/** Pagination state */
export interface PaginationState {
  page: number;
  rowsPerPage: number;
}
