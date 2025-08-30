import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import storageService from '../services/storageService';

const Header = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ watchlistCount: 0, favoritesCount: 0 });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const location = useLocation();
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Popular search suggestions
  const popularSearches = [
    'Avengers', 'Batman', 'Spider-Man', 'Star Wars', 'Marvel', 'DC',
    'Harry Potter', 'Lord of the Rings', 'Fast and Furious', 'Mission Impossible',
    'James Bond', 'Jurassic Park', 'Transformers', 'X-Men', 'Iron Man',
    'Thor', 'Captain America', 'Wonder Woman', 'Superman', 'Inception'
  ];

  useEffect(() => {
    updateStats();
  }, [location]);

  useEffect(() => {
    // Close suggestions when clicking outside
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateStats = () => {
    setStats(storageService.getStats());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      // Filter suggestions based on input
      const filteredSuggestions = popularSearches.filter(search =>
        search.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm0 6h6v2H7v-2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">CineStream</h1>
              <p className="text-xs text-gray-400">Movie Discovery</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for movies, actors, directors..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  className="w-full px-4 py-2 pl-12 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-gray-700 transition-all duration-200 shadow-lg"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-4 py-1 rounded-md text-sm font-medium transition-all duration-200 shadow-md"
              >
                Search
              </button>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-lg mt-2 shadow-xl z-50 backdrop-blur-sm"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg flex items-center space-x-3 group"
                    >
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="group-hover:text-primary-400 transition-colors">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-primary-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/watchlist"
              className={`text-sm font-medium transition-colors relative ${
                location.pathname === '/watchlist'
                  ? 'text-primary-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Watchlist
              {stats.watchlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.watchlistCount > 99 ? '99+' : stats.watchlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/favorites"
              className={`text-sm font-medium transition-colors relative ${
                location.pathname === '/favorites'
                  ? 'text-primary-400'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Favorites
              {stats.favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.favoritesCount > 99 ? '99+' : stats.favoritesCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
