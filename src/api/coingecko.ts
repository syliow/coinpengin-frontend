import axios, { AxiosError } from 'axios';
import type { CoinMarketData, HistoricalChartData, CoinSearchResult } from '../types';

/**
 * CoinGecko API Service (via Backend Proxy)
 * Calls the backend API which proxies requests to CoinGecko and implements caching
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

/**
 * Fetch market data for cryptocurrencies
 */
export const fetchMarketData = async (
  currency: string = 'usd',
  page: number = 1,
  perPage: number = 25
): Promise<CoinMarketData[]> => {
  try {
    const params = {
      currency: currency.toLowerCase(),
      perPage,
      page,
    };

    const response = await axios.get<CoinMarketData[]>(
      `${BACKEND_URL}/api/coins/markets`,
      { params }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error('Error fetching market data via proxy:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch market data');
  }
};

/**
 * Fetch detailed coin information
 */
export const fetchCoinDetails = async (coinId: string): Promise<CoinMarketData> => {
  try {
    const response = await axios.get<CoinMarketData>(
      `${BACKEND_URL}/api/coins/${coinId}`
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error('Error fetching coin details via proxy:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch coin details');
  }
};

/**
 * Fetch historical chart data
 */
export const fetchHistoricalChart = async (
  coinId: string,
  currency: string = 'usd',
  days: number = 365
): Promise<HistoricalChartData> => {
  try {
    const params = {
      currency: currency.toLowerCase(),
      days,
    };

    const response = await axios.get<HistoricalChartData>(
      `${BACKEND_URL}/api/coins/${coinId}/chart`,
      { params }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response?.status === 429) {
      throw new Error('Rate limit reached. Please wait a moment before trying again.');
    }
    console.error('Error fetching historical chart via proxy:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to fetch chart data');
  }
};

/**
 * Search for coins (Kept via Direct CG for now as it's less rate-limited, but could also be proxied)
 */
export const searchCoins = async (query: string): Promise<CoinSearchResult[]> => {
  try {
    const response = await axios.get<{ coins: CoinSearchResult[] }>(
      `https://api.coingecko.com/api/v3/search`,
      { params: { query } }
    );
    return response.data.coins || [];
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error('Error searching coins:', axiosError);
    throw new Error(axiosError.response?.data?.message || 'Failed to search coins');
  }
};
