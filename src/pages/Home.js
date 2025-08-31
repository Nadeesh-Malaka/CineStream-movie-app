import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import movieService from '../services/movieService';

// Category Section Components
const CategoryMovieCard = ({ movie, onClick }) => (
  <div
    onClick={onClick}
    className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group min-w-[140px]"
  >
    <div className="aspect-[2/3] overflow-hidden">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : `https://via.placeholder.com/280x420/1f2937/ffffff?text=${encodeURIComponent(movie.Title)}`}
        alt={movie.Title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
    </div>
    <div className="p-3">
      <h3 className="text-white font-medium text-xs mb-1 line-clamp-2 group-hover:text-primary-400">
        {movie.Title}
      </h3>
      <p className="text-gray-400 text-xs">{movie.Year}</p>
    </div>
  </div>
);

const CategorySection = ({ searchTerms, isLoading, movies, navigate }) => {
  if (isLoading) {
    return (
      <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg h-64 min-w-[140px] animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
      {movies.slice(0, 8).map((movie) => (
        <CategoryMovieCard
          key={movie.imdbID}
          movie={movie}
          onClick={() => navigate(`/movie/${movie.imdbID}`)}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]); // Store all search results for filtering
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    year: '',
    type: '', // movie, series, episode
    sortBy: 'relevance' // relevance, year, title
  });
  
  // Category movie states
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(false);
  const [actionMovies, setActionMovies] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [sciFiLoading, setSciFiLoading] = useState(false);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [horrorLoading, setHorrorLoading] = useState(false);
  
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
      loadCategoryMovies();
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

  // Load category movies for homepage sections
  const loadCategoryMovies = async () => {
    // Load Top Rated movies
    setTopRatedLoading(true);
    try {
      const topRated = await movieService.searchMovies('Godfather', 1);
      if (topRated.Response === 'True') {
        setTopRatedMovies(topRated.Search || []);
      }
    } catch (error) {
      console.error('Error loading top rated movies:', error);
    } finally {
      setTopRatedLoading(false);
    }

    // Load Action movies
    setActionLoading(true);
    try {
      const action = await movieService.searchMovies('Avengers', 1);
      if (action.Response === 'True') {
        setActionMovies(action.Search || []);
      }
    } catch (error) {
      console.error('Error loading action movies:', error);
    } finally {
      setActionLoading(false);
    }

    // Load Sci-Fi movies
    setSciFiLoading(true);
    try {
      const sciFi = await movieService.searchMovies('Interstellar', 1);
      if (sciFi.Response === 'True') {
        setSciFiMovies(sciFi.Search || []);
      }
    } catch (error) {
      console.error('Error loading sci-fi movies:', error);
    } finally {
      setSciFiLoading(false);
    }

    // Load Horror movies
    setHorrorLoading(true);
    try {
      const horror = await movieService.searchMovies('Halloween', 1);
      if (horror.Response === 'True') {
        setHorrorMovies(horror.Search || []);
      }
    } catch (error) {
      console.error('Error loading horror movies:', error);
    } finally {
      setHorrorLoading(false);
    }
  };

  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    // Reset filters when starting a new search
    setFilters({
      year: '',
      type: '',
      sortBy: 'relevance'
    });
    
    try {
      const response = await movieService.searchMovies(query, page);
      
      if (response.Response === 'True') {
        const searchResults = response.Search || [];
        setAllMovies(searchResults); // Store all results for filtering
        setMovies(searchResults); // Initially show all results
        setTotalResults(parseInt(response.totalResults) || 0);
      } else {
        setAllMovies([]);
        setMovies([]);
        setTotalResults(0);
        setError(response.Error || 'No movies found');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search movies. Please try again.');
      setAllMovies([]);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Filter movies based on current filter settings
  const applyFilters = () => {
    let filteredMovies = [...allMovies];

    // Filter by year
    if (filters.year) {
      filteredMovies = filteredMovies.filter(movie => movie.Year === filters.year);
    }

    // Filter by type
    if (filters.type) {
      filteredMovies = filteredMovies.filter(movie => 
        movie.Type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Sort movies
    if (filters.sortBy === 'year') {
      filteredMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    } else if (filters.sortBy === 'title') {
      filteredMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    }

    setMovies(filteredMovies);
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    if (allMovies.length > 0) {
      // Only apply filters if at least one filter is active
      const hasActiveFilters = filters.year || filters.type || filters.sortBy !== 'relevance';
      
      if (hasActiveFilters) {
        applyFilters();
      } else {
        // If no filters are active, show all movies
        setMovies(allMovies);
      }
    }
  }, [filters, allMovies]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: '',
      type: '',
      sortBy: 'relevance'
    });
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
              <h2 className="text-2xl font-bold text-white mb-6 text-center">🎭 Browse by Genre & Collections</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {[
                  { name: 'Action', icon: '💥', query: 'action', gradient: 'from-red-600 to-orange-600' },
                  { name: 'Comedy', icon: '😄', query: 'comedy', gradient: 'from-yellow-500 to-orange-500' },
                  { name: 'Horror', icon: '👻', query: 'horror', gradient: 'from-purple-600 to-pink-600' },
                  { name: 'Romance', icon: '💕', query: 'romance', gradient: 'from-pink-500 to-rose-500' },
                  { name: 'Sci-Fi', icon: '🚀', query: 'science fiction', gradient: 'from-blue-600 to-cyan-600' },
                  { name: 'Drama', icon: '🎭', query: 'drama', gradient: 'from-indigo-600 to-purple-600' },
                  { name: 'Thriller', icon: '🔪', query: 'thriller', gradient: 'from-gray-700 to-gray-900' },
                  { name: 'Fantasy', icon: '🧙‍♂️', query: 'fantasy', gradient: 'from-emerald-600 to-teal-600' },
                  { name: 'Animation', icon: '🎨', query: 'animation', gradient: 'from-violet-600 to-purple-600' },
                  { name: 'War', icon: '⚔️', query: 'war', gradient: 'from-stone-600 to-slate-600' },
                  { name: 'Western', icon: '🤠', query: 'western', gradient: 'from-amber-600 to-yellow-600' },
                  { name: 'Crime', icon: '🕵️', query: 'crime', gradient: 'from-red-800 to-red-900' }
                ].map((genre) => (
                  <button
                    key={genre.name}
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('q', genre.query);
                      params.set('page', '1');
                      navigate(`?${params.toString()}`);
                    }}
                    className={`bg-gradient-to-br ${genre.gradient} hover:scale-105 rounded-xl p-4 text-center transition-all duration-300 transform hover:shadow-xl hover:shadow-primary-500/25 group`}
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{genre.icon}</div>
                    <div className="text-white text-sm font-bold group-hover:text-white">{genre.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Movie Collections */}
           

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

            {/* Popular Searches with Movie Cards */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🔥 Trending & Popular</h3>
              <div className="space-y-8">
                {/* Top Rated Movies */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-yellow-400 flex items-center">
                      <span className="mr-2">🏆</span>Top Rated & Award Winners
                    </h4>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('q', 'Godfather Shawshank Dark Knight');
                        params.set('page', '1');
                        navigate(`?${params.toString()}`);
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <CategorySection 
                    searchTerms={['Godfather', 'Shawshank', 'Dark Knight']}
                    isLoading={topRatedLoading}
                    movies={topRatedMovies}
                    navigate={navigate}
                  />
                </div>

                {/* Action & Adventure */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-red-400 flex items-center">
                      <span className="mr-2">💥</span>Action & Adventure
                    </h4>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('q', 'action adventure');
                        params.set('page', '1');
                        navigate(`?${params.toString()}`);
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <CategorySection 
                    searchTerms={['Avengers', 'John Wick', 'Mad Max']}
                    isLoading={actionLoading}
                    movies={actionMovies}
                    navigate={navigate}
                  />
                </div>

                {/* Sci-Fi & Fantasy */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-400 flex items-center">
                      <span className="mr-2">🚀</span>Sci-Fi & Fantasy
                    </h4>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('q', 'sci-fi fantasy');
                        params.set('page', '1');
                        navigate(`?${params.toString()}`);
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <CategorySection 
                    searchTerms={['Interstellar', 'Blade Runner', 'Alien']}
                    isLoading={sciFiLoading}
                    movies={sciFiMovies}
                    navigate={navigate}
                  />
                </div>

                {/* Horror & Thriller */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-purple-400 flex items-center">
                      <span className="mr-2">👻</span>Horror & Thriller
                    </h4>
                    <button
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set('q', 'horror thriller');
                        params.set('page', '1');
                        navigate(`?${params.toString()}`);
                      }}
                      className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                    >
                      View All →
                    </button>
                  </div>
                  <CategorySection 
                    searchTerms={['Halloween', 'Scream', 'Conjuring']}
                    isLoading={horrorLoading}
                    movies={horrorMovies}
                    navigate={navigate}
                  />
                </div>
              </div>
            </div>

            {/* Browse by Years */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">📅 Browse by Year</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-3">
                {['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2010s', '2000s', '1990s', '1980s', '1970s'].map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set('q', `movie ${year}`);
                      params.set('page', '1');
                      navigate(`?${params.toString()}`);
                    }}
                    className="bg-gradient-to-br from-gray-700 to-gray-800 hover:from-primary-600 hover:to-purple-600 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg text-sm"
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Search Results with Filters */}
        {searchQuery && (
          <>
            {/* Filter Controls */}
            {movies.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-300">
                    {movies.length} of {totalResults} movies
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* Year Filter */}
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="bg-gray-900/80 border border-gray-600/50 text-gray-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="" className="bg-gray-900">All Years</option>
                    {Array.from(new Set(allMovies.map(movie => movie.Year)))
                      .filter(year => year && year !== 'N/A')
                      .sort((a, b) => parseInt(b) - parseInt(a))
                      .map(year => (
                        <option key={year} value={year} className="bg-gray-900">{year}</option>
                      ))}
                  </select>

                  {/* Type Filter */}
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="bg-gray-900/80 border border-gray-600/50 text-gray-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="" className="bg-gray-900">All Types</option>
                    {Array.from(new Set(allMovies.map(movie => movie.Type)))
                      .filter(type => type)
                      .map(type => (
                        <option key={type} value={type} className="bg-gray-900">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                  </select>

                  {/* Sort Filter */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="bg-gray-900/80 border border-gray-600/50 text-gray-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  >
                    <option value="relevance" className="bg-gray-900">Relevance</option>
                    <option value="year" className="bg-gray-900">Year (Newest)</option>
                    <option value="title" className="bg-gray-900">Title (A-Z)</option>
                  </select>
                </div>
              </div>
            )}

            <MovieGrid
              movies={movies}
              loading={loading}
              error={error}
              onWatchlistChange={() => {}}
              onFavoritesChange={() => {}}
            />
          </>
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
