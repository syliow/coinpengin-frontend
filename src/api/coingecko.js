import axios from 'axios';

/**
 * CoinGecko API Service
 * All CoinGecko API calls with latest v3 endpoints
 */

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

// API key if available (optional for free tier)
const API_KEY = process.env.REACT_APP_COINGECKO_API_KEY || '';

/**
 * Fetch market data for cryptocurrencies
 * @param {string} currency - VS currency (usd, myr, etc.)
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @returns {Promise<Array>} Market data
 */
export const fetchMarketData = async (currency = 'usd', page = 1, perPage = 100) => {
  try {
    const params = {
      vs_currency: currency.toLowerCase(),
      order: 'market_cap_desc',
      per_page: perPage,
      page,
      sparkline: false,
      include_rehypothecated: true, // New parameter as of Feb 2026
    };

    // Add API key if available
    if (API_KEY) {
      params.x_cg_demo_api_key = API_KEY;
    }

    const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch market data');
  }
};

/**
 * Fetch detailed coin information
 * @param {string} coinId - Coin ID (e.g., 'bitcoin')
 * @returns {Promise<Object>} Coin details
 */
export const fetchCoinDetails = async (coinId) => {
  try {
    const params = {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
    };

    if (API_KEY) {
      params.x_cg_demo_api_key = API_KEY;
    }

    const response = await axios.get(`${COINGECKO_API_BASE}/coins/${coinId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch coin details');
  }
};

/**
 * Fetch historical chart data
 * @param {string} coinId - Coin ID
 * @param {string} currency - VS currency
 * @param {number} days - Number of days
 * @returns {Promise<Object>} Historical price data
 */
export const fetchHistoricalChart = async (coinId, currency = 'usd', days = 365) => {
  try {
    const params = {
      vs_currency: currency.toLowerCase(),
      days,
    };

    if (API_KEY) {
      params.x_cg_demo_api_key = API_KEY;
    }

    const response = await axios.get(
      `${COINGECKO_API_BASE}/coins/${coinId}/market_chart`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching historical chart:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch chart data');
  }
};

/**
 * Search for coins
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 */
export const searchCoins = async (query) => {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/search`, {
      params: { query },
    });
    return response.data.coins || [];
  } catch (error) {
    console.error('Error searching coins:', error);
    throw new Error(error.response?.data?.message || 'Failed to search coins');
  }
};
