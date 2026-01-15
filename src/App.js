import React, { useEffect, useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { fetchMarketData } from './api/coingecko';
import { updateWishlist } from './api/backend';
import { cooldownManager } from './helpers/rateLimit';
import { formatCurrency, formatPercentage, getChangeColor } from './helpers/formatters';
import { CURRENCY_OPTIONS } from './helpers/constants';
import { toast } from 'react-toastify';
import { SunIcon, MoonIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import logo from './images/Logo.png';
import CoinInfoDialog from './components/CoinInfoDialog';
import LoginDialog from './components/LoginDialog';
import SignupDialog from './components/SignupDialog';

function App() {
  const { user, isAuthenticated, wishlist, logout, updateWishlist: setWishlist } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showCoinDialog, setShowCoinDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });

  // Handle column sorting
  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Sort market data
  const sortedMarketData = React.useMemo(() => {
    if (!sortConfig.key) return marketData;
    
    const sorted = [...marketData].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle null/undefined values
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      // Numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (sortConfig.direction === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });
    
    return sorted;
  }, [marketData, sortConfig]);

  // Fetch market data
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        setLoading(true);
        const data = await fetchMarketData(currency.toLowerCase(), 1, 100);
        // Add currency to each coin for formatting
        const dataWithCurrency = data.map(coin => ({ ...coin, vs_currency: currency }));
        setMarketData(dataWithCurrency);
      } catch (error) {
        toast.error(`Failed to load market data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();
  }, [currency]);

  // Handle wishlist toggle
  const handleWishlistToggle = async (coin) => {
    if (!isAuthenticated) {
      toast.error('Please login to add coins to wishlist');
      return;
    }

    const cooldownKey = `wishlist_${coin.id}`;
    if (cooldownManager.isOnCooldown(cooldownKey)) {
      toast.warning('Please wait before toggling wishlist again');
      return;
    }

    try {
      cooldownManager.setCooldown(cooldownKey, 2000);
      
      const response = await updateWishlist({
        coin: coin.name,
        coin_id: coin.id,
        user_email: user.email,
      });

      // Update local wishlist state
      const isInWishlist = wishlist.some(w => w.symbol === coin.symbol);
      if (isInWishlist) {
        setWishlist(wishlist.filter(w => w.symbol !== coin.symbol));
      } else {
        setWishlist([coin, ...wishlist]);
      }

      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-light-bg-secondary/95 dark:bg-dark-bg-secondary/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex items-center justify-center">
                <img src={logo} alt="CoinPengin" className="h-full w-full object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent tracking-tight">
                CoinPengin
              </span>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>

              {/* Currency selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 outline-none transition-all"
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Auth buttons */}
              {!isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowLoginDialog(true)}
                    className="px-4 py-2 rounded-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignupDialog(true)}
                    className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="text-sm">Hello, {user?.firstName}!</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-accent-red hover:text-accent-red font-medium transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Cryptocurrency Prices by Market Cap
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track real-time cryptocurrency prices and market data
          </p>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th 
                    onClick={() => handleSort('market_cap_rank')}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      #
                      {sortConfig.key === 'market_cap_rank' && (
                        <span className="text-primary-600">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('name')}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Coin
                      {sortConfig.key === 'name' && (
                        <span className="text-primary-600">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('current_price')}
                    className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Price
                      {sortConfig.key === 'current_price' && (
                        <span className="text-primary-600">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('price_change_percentage_24h')}
                    className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      24h
                      {sortConfig.key === 'price_change_percentage_24h' && (
                        <span className="text-primary-600">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('market_cap')}
                    className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      Market Cap
                      {sortConfig.key === 'market_cap' && (
                        <span className="text-primary-600">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="6" className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : sortedMarketData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                ) : (
                  sortedMarketData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((coin) => {
                    const isInWishlist = wishlist?.some(w => w.symbol === coin.symbol);
                    return (
                      <tr
                        key={coin.id}
                        onClick={() => {
                          setSelectedCoin(coin);
                          setShowCoinDialog(true);
                        }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4 text-sm">{coin.market_cap_rank}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="h-6 w-6 rounded-full"
                            />
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          {formatCurrency(coin.current_price, currency)}
                        </td>
                        <td className={`px-6 py-4 text-right font-medium ${getChangeColor(coin.price_change_percentage_24h)}`}>
                          {formatPercentage(coin.price_change_percentage_24h, 1)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {formatCurrency(coin.market_cap, currency)}
                        </td>
                        <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleWishlistToggle(coin)}
                            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle wishlist"
                          >
                            {isInWishlist ? (
                              <HeartSolidIcon className="h-5 w-5 text-accent-red" />
                            ) : (
                              <HeartIcon className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 outline-none transition-all"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, sortedMarketData.length)} of {sortedMarketData.length}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={(page + 1) * rowsPerPage >= sortedMarketData.length}
                  className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} CoinPengin. Powered by CoinGecko API.
            </p>
            <p className="text-center text-gray-500 text-sm">
              Built by{' '}
              <a
                href="https://github.com/syliow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Liow Shan Yi
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Login Dialog */}
      <LoginDialog
        open={showLoginDialog}
        handleClose={() => setShowLoginDialog(false)}
      />
      
      {/* Signup Dialog */}
      <SignupDialog
        open={showSignupDialog}
        handleClose={() => setShowSignupDialog(false)}
      />
      
      {/* Coin Details Dialog */}
      {selectedCoin && (
        <CoinInfoDialog
          open={showCoinDialog}
          handleClose={() => setShowCoinDialog(false)}
          coinDetails={selectedCoin}
          currency={currency}
        />
      )}
    </div>
  );
}

export default App;
