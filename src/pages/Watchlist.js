import React, { useState, useEffect } from 'react';
import MovieGrid from '../components/MovieGrid';
import storageService from '../services/storageService';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    setLoading(true);
    try {
      const watchlistData = storageService.getWatchlist();
      setWatchlist(watchlistData);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistChange = () => {
    loadWatchlist();
  };

  const clearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      storageService.clearWatchlist();
      setWatchlist([]);
    }
  };

  const sortedWatchlist = [...watchlist].sort((a, b) => {
    return new Date(b.addedAt) - new Date(a.addedAt);
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
              <p className="text-gray-400">
                {watchlist.length === 0
                  ? 'Your watchlist is empty'
                  : `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} in your watchlist`}
              </p>
            </div>
            
            {watchlist.length > 0 && (
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button
                  onClick={loadWatchlist}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={loading}
                >
                  <svg
                    className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Refresh</span>
                </button>
                
                <button
                  onClick={clearWatchlist}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear All</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!loading && watchlist.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-gray-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              Your watchlist is empty
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start adding movies to your watchlist by searching for them and clicking the bookmark icon.
            </p>
            <a
              href="/"
              className="btn-primary inline-block"
            >
              Browse Movies
            </a>
          </div>
        )}

        {/* Movies Grid */}
        {(watchlist.length > 0 || loading) && (
          <MovieGrid
            movies={sortedWatchlist}
            loading={loading}
            error={null}
            onWatchlistChange={handleWatchlistChange}
            onFavoritesChange={() => {}}
          />
        )}

        {/* Stats */}
        {watchlist.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-4 bg-gray-800 rounded-lg px-6 py-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{watchlist.length}</div>
                <div className="text-sm text-gray-400">Movies</div>
              </div>
              <div className="h-8 w-px bg-gray-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">
                  {watchlist.filter(movie => movie.Type === 'movie').length}
                </div>
                <div className="text-sm text-gray-400">Films</div>
              </div>
              <div className="h-8 w-px bg-gray-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {watchlist.filter(movie => movie.Type === 'series').length}
                </div>
                <div className="text-sm text-gray-400">Series</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
