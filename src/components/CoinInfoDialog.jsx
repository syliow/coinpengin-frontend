import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import { fetchHistoricalChart } from '../api/coingecko';
import { formatCurrency, formatNumber, formatDate } from '../helpers/formatters';
import { CHART_DAYS } from '../helpers/constants';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CoinInfoDialog = ({ open, handleClose, coinDetails, currency }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedDays, setSelectedDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch historical chart data
  useEffect(() => {
    const fetchChartData = async () => {
      if (!coinDetails?.id || !open) {
        setChartData([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        setChartData([]); // Clear previous data while loading
        const data = await fetchHistoricalChart(coinDetails.id, currency.toLowerCase(), selectedDays);
        if (data && data.prices && data.prices.length > 0) {
          setChartData(data.prices);
        } else {
          setChartData([]);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError(error.message || 'Failed to fetch chart data');
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinDetails?.id, currency, selectedDays, open]);

  // Format chart labels and data
  const formatChartLabels = (data) => {
    return data.map((item) => {
      const date = new Date(item[0]);
      if (selectedDays === 1) {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
          color: '#8B949E',
        },
      },
      y: {
        grid: {
          color: 'rgba(139, 148, 158, 0.1)',
        },
        ticks: {
          color: '#8B949E',
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.1,
      },
    },
  };

  const lineChartData = {
    labels: formatChartLabels(chartData),
    datasets: [
      {
        data: chartData.map((item) => item[1]),
        borderColor: coinDetails?.price_change_percentage_24h >= 0 ? '#00B8A9' : '#F46036',
        backgroundColor: coinDetails?.price_change_percentage_24h >= 0 
          ? 'rgba(0, 184, 169, 0.1)' 
          : 'rgba(244, 96, 54, 0.1)',
        fill: true,
        borderWidth: 2,
      },
    ],
  };

  const priceChangeColor = coinDetails?.price_change_percentage_24h >= 0 
    ? 'text-accent-green' 
    : 'text-accent-red';

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={coinDetails?.image}
                      alt={coinDetails?.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <Dialog.Title className="text-2xl font-bold flex items-center gap-3">
                        {coinDetails?.name}
                        <span className="text-sm font-normal text-gray-500 uppercase">
                          {coinDetails?.symbol}
                        </span>
                      </Dialog.Title>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xl font-semibold">
                          {formatCurrency(coinDetails?.current_price, currency)}
                        </span>
                        <span className={`font-medium ${priceChangeColor}`}>
                          {coinDetails?.price_change_percentage_24h >= 0 ? '+' : ''}
                          {coinDetails?.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart Section */}
                  <div className="lg:col-span-2">
                    {/* Time Range Buttons */}
                    <div className="flex space-x-2 mb-4">
                      {CHART_DAYS.map((day) => (
                        <button
                          key={day.value}
                          onClick={() => setSelectedDays(day.value)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            selectedDays === day.value
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>

                    {/* Chart */}
                    <div className="h-80 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                      {loading ? (
                        <div className="h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                      ) : error ? (
                        <div className="h-full flex items-center justify-center text-accent-red text-center px-4">
                          {error}
                        </div>
                      ) : chartData.length > 0 ? (
                        <Line data={lineChartData} options={chartOptions} />
                      ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                          No chart data available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Market Data</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500">Market Cap Rank</span>
                        <span className="font-medium">#{coinDetails?.market_cap_rank}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500">Market Cap</span>
                        <span className="font-medium">{formatCurrency(coinDetails?.market_cap, currency)}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500">24h Volume</span>
                        <span className="font-medium">{formatCurrency(coinDetails?.total_volume, currency)}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500">24h High</span>
                        <span className="font-medium text-accent-green">{formatCurrency(coinDetails?.high_24h, currency)}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500">24h Low</span>
                        <span className="font-medium text-accent-red">{formatCurrency(coinDetails?.low_24h, currency)}</span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500">Circulating Supply</span>
                        <span className="font-medium">{formatNumber(coinDetails?.circulating_supply, 0)}</span>
                      </div>
                      
                      {coinDetails?.total_supply && (
                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-500">Total Supply</span>
                          <span className="font-medium">{formatNumber(coinDetails?.total_supply, 0)}</span>
                        </div>
                      )}
                      
                      {coinDetails?.max_supply && (
                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-500">Max Supply</span>
                          <span className="font-medium">{formatNumber(coinDetails?.max_supply, 0)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-500">All-Time High</span>
                        <div className="text-right">
                          <span className="font-medium">{formatCurrency(coinDetails?.ath, currency)}</span>
                          <div className="text-xs text-gray-500">{formatDate(coinDetails?.ath_date)}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between py-2">
                        <span className="text-gray-500">All-Time Low</span>
                        <div className="text-right">
                          <span className="font-medium">{formatCurrency(coinDetails?.atl, currency)}</span>
                          <div className="text-xs text-gray-500">{formatDate(coinDetails?.atl_date)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CoinInfoDialog;
