import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import movieService from '../services/movieService';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page')) || 1;
    
    if (query) {
      setSearchQuery(query);
      setCurrentPage(page);
      searchMovies(query, page);
    } else {
      // Load featured movies for homepage
      loadFeaturedMovies();
      setMovies([]);
      setSearchQuery('');
      setError(null);
      setTotalResults(0);
      setCurrentPage(1);
    }
  }, [searchParams]);

  // Load featured movies for homepage
  const loadFeaturedMovies = async () => {
    setFeaturedLoading(true);
    try {
      // Load a mix of popular movies
      const featuredQueries = ['Marvel', 'Batman', 'Star Wars'];
      const allFeatured = [];
      
      for (const query of featuredQueries) {
        const response = await movieService.searchMovies(query, 1);
        if (response.Response === 'True' && response.Search) {
          allFeatured.push(...response.Search.slice(0, 4)); // Get 4 from each
        }
      }
      
      setFeaturedMovies(allFeatured);
    } catch (error) {
      console.error('Error loading featured movies:', error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await movieService.searchMovies(query, page);
      
      if (response.Response === 'True') {
        setMovies(response.Search || []);
        setTotalResults(parseInt(response.totalResults) || 0);
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(response.Error || 'No movies found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search movies. Please try again.');
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(totalResults / 10)) return;
    
    setCurrentPage(newPage);
    const params = new URLSearchParams();
    params.set('q', searchQuery);
    params.set('page', newPage.toString());
    navigate(`?${params.toString()}`);
  };

  const handleRefresh = () => {
    searchMovies(searchQuery, currentPage);
  };

  const totalPages = Math.ceil(totalResults / 10);
  const showPagination = totalPages > 1;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          {searchQuery ? (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Search Results for "{searchQuery}"
                </h1>
                {totalResults > 0 && (
                  <p className="text-gray-400">
                    Found {totalResults.toLocaleString()} results
                  </p>
                )}
              </div>
              <button
                onClick={handleRefresh}
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
            </div>
          ) : (
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent">
                Welcome to CineStream
              </h1>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Discover amazing movies, explore different genres, and never miss the latest trends
              </p>
            </div>
          )}
        </div>

        {/* Homepage Content - Show when not searching */}
        {!searchQuery && (
          <>
            {/* Quick Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">🎭 Browse by Genre</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {[
                  { name: 'Action', icon: '💥', query: 'action' },
                  { name: 'Comedy', icon: '😄', query: 'comedy' },
                  { name: 'Horror', icon: '👻', query: 'horror' },
                  { name: 'Romance', icon: '💕', query: 'romance' },
                  { name: 'Sci-Fi', icon: '🚀', query: 'science fiction' },
                  { name: 'Drama', icon: '🎭', query: 'drama' },
                  { name: 'Thriller', icon: '🔪', query: 'thriller' },
                  { name: 'Fantasy', icon: '🧙‍♂️', query: 'fantasy' }
                ].map((genre) => (
                  <button
                    key={genre.name}
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('q', genre.query);
                      params.set('page', '1');
                      navigate(`?${params.toString()}`);
                    }}
                    className="bg-gray-800 hover:bg-gradient-to-br hover:from-primary-600 hover:to-purple-600 rounded-lg p-4 text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg group"
                  >
                    <div className="text-2xl mb-2">{genre.icon}</div>
                    <div className="text-white text-sm font-medium group-hover:text-white">{genre.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Movies */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">🎬 Featured Movies</h2>
                <button
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set('q', 'popular');
                    params.set('page', '1');
                    navigate(`?${params.toString()}`);
                  }}
                  className="text-primary-400 hover:text-primary-300 font-medium flex items-center space-x-1"
                >
                  <span>View All</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {featuredLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg h-80 animate-pulse relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700 to-transparent animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {featuredMovies.slice(0, 12).map((movie, index) => (
                    <div
                      key={movie.imdbID}
                      onClick={() => navigate(`/movie/${movie.imdbID}`)}
                      className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="aspect-[2/3] overflow-hidden">
                        <img
                          src={movie.Poster !== 'N/A' ? movie.Poster : `https://via.placeholder.com/300x450/1f2937/ffffff?text=${encodeURIComponent(movie.Title)}`}
                          alt={movie.Title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 group-hover:text-primary-400">
                          {movie.Title}
                        </h3>
                        <p className="text-gray-400 text-xs">{movie.Year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Searches */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🔥 Popular Searches</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                {['Marvel', 'Batman', 'Star Wars', 'Harry Potter', 'Avengers', 'Spider-Man', 'Lord of Rings', 'Fast Furious', 'James Bond', 'Jurassic Park', 'Transformers', 'Mission Impossible'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('q', term);
                      params.set('page', '1');
                      navigate(`?${params.toString()}`);
                    }}
                    className="bg-gray-800 hover:bg-gradient-to-r hover:from-primary-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Search Results Grid */}
        {searchQuery && (
          <MovieGrid
            movies={movies}
            loading={loading}
            error={error}
            onWatchlistChange={() => {}}
            onFavoritesChange={() => {}}
          />
        )}

        {/* Pagination */}
        {searchQuery && showPagination && !loading && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}

        {/* Quick Stats */}
        {searchQuery && totalResults > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Page {currentPage} of {totalPages} • {totalResults.toLocaleString()} total results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
