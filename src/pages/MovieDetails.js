import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import movieService from '../services/movieService';
import storageService from '../services/storageService';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (movie) {
      setIsInWatchlist(storageService.isInWatchlist(movie.imdbID));
      setIsInFavorites(storageService.isInFavorites(movie.imdbID));
    }
  }, [movie]);

  const fetchMovieDetails = async (imdbId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await movieService.getMovieDetails(imdbId);
      
      if (response.Response === 'True') {
        setMovie(response);
      } else {
        setError(response.Error || 'Movie not found');
      }
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = () => {
    if (!movie) return;
    
    if (isInWatchlist) {
      storageService.removeFromWatchlist(movie.imdbID);
      setIsInWatchlist(false);
    } else {
      storageService.addToWatchlist(movie);
      setIsInWatchlist(true);
    }
  };

  const handleFavoritesToggle = () => {
    if (!movie) return;
    
    if (isInFavorites) {
      storageService.removeFromFavorites(movie.imdbID);
      setIsInFavorites(false);
    } else {
      storageService.addToFavorites(movie);
      setIsInFavorites(true);
    }
  };

  const openTrailer = () => {
    if (movie) {
      const trailerUrl = movieService.getTrailerSearchUrl(movie.Title, movie.Year);
      window.open(trailerUrl, '_blank');
    }
  };

  const openImdb = () => {
    if (movie) {
      const imdbUrl = movieService.getImdbUrl(movie.imdbID);
      window.open(imdbUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="large" text="Loading movie details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 text-gray-600 mb-4 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Error Loading Movie</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link
              to="/"
              className="btn-primary"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const posterUrl = movieService.getPosterUrl(movie.Poster, movie.Title);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={posterUrl}
                alt={movie.Title}
                className="w-full max-w-md mx-auto rounded-lg shadow-xl"
                onError={(e) => {
                  e.target.src = movieService.getPosterUrl(null, movie.Title);
                }}
              />
              
              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleWatchlistToggle}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                    isInWatchlist
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isInWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>

                <button
                  onClick={handleFavoritesToggle}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                    isInFavorites
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isInFavorites ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{isInFavorites ? 'In Favorites' : 'Add to Favorites'}</span>
                </button>

                <button
                  onClick={openTrailer}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Watch Trailer</span>
                </button>

                <button
                  onClick={openImdb}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span className="font-bold">IMDb</span>
                </button>
              </div>
            </div>
          </div>

          {/* Movie Information */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Basic Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                    {movie.Type?.toUpperCase()}
                  </span>
                  <span className="text-gray-400">{movie.Year}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{movieService.formatRuntime(movie.Runtime)}</span>
                  {movie.Rated && movie.Rated !== 'N/A' && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded">
                        {movie.Rated}
                      </span>
                    </>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-4">
                  {movie.Title}
                </h1>

              {/* Ratings */}
              <div className="bg-gray-800/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ratings & Reviews</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-yellow-400 text-xl">★</span>
                        <span className="text-white font-bold text-xl">{movie.imdbRating}</span>
                        <span className="text-gray-400">/10</span>
                      </div>
                      <p className="text-yellow-400 text-sm font-medium">IMDb Rating</p>
                      {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
                        <p className="text-gray-400 text-xs mt-1">{movie.imdbVotes} votes</p>
                      )}
                    </div>
                  )}
                  
                  {movie.Ratings && movie.Ratings.length > 0 && (
                    movie.Ratings.slice(0, 2).map((rating, index) => (
                      <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                        <div className="text-white font-bold text-lg mb-1">{rating.Value}</div>
                        <p className="text-blue-400 text-sm font-medium">{rating.Source}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              </div>

              {/* Genres */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {movie.Genre.split(', ').map((genre, index) => {
                      const colors = [
                        'from-red-500 to-pink-600',
                        'from-blue-500 to-cyan-600', 
                        'from-green-500 to-teal-600',
                        'from-purple-500 to-violet-600',
                        'from-yellow-500 to-orange-600',
                        'from-indigo-500 to-blue-600',
                        'from-pink-500 to-rose-600',
                        'from-teal-500 to-green-600'
                      ];
                      const colorClass = colors[index % colors.length];
                      
                      return (
                        <span
                          key={index}
                          className={`px-4 py-2 bg-gradient-to-r ${colorClass} text-white rounded-full text-sm font-medium shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer`}
                        >
                          {genre}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/20 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Plot
                  </h3>
                  <div className="relative">
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary-500 to-purple-600 rounded-full"></div>
                    <p className="text-gray-300 leading-relaxed text-lg pl-6 font-medium">{movie.Plot}</p>
                  </div>
                </div>
              )}

              {/* Cast */}
              {movie.Actors && movie.Actors !== 'N/A' && (
                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cast
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {movie.Actors.split(', ').slice(0, 8).map((actor, index) => (
                      <div key={index} className="group cursor-pointer">
                        <div className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-all duration-200 border border-gray-600/30 hover:border-primary-500/50">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-200">
                            <span className="text-white font-bold text-lg">
                              {actor.trim().split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm text-center font-medium group-hover:text-white transition-colors">
                            {actor.trim()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Director and Writer Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white">Director</h3>
                    </div>
                    <p className="text-blue-300 font-medium">{movie.Director}</p>
                  </div>
                )}

                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 border border-green-500/20 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white">Writer</h3>
                    </div>
                    <p className="text-green-300 font-medium">{movie.Writer}</p>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Movie Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {movie.Country && movie.Country !== 'N/A' && (
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:border-primary-500/30 transition-colors">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h4 className="text-sm font-medium text-gray-400">Country</h4>
                      </div>
                      <p className="text-white font-medium">{movie.Country}</p>
                    </div>
                  )}

                  {movie.Language && movie.Language !== 'N/A' && (
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:border-primary-500/30 transition-colors">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <h4 className="text-sm font-medium text-gray-400">Language</h4>
                      </div>
                      <p className="text-white font-medium">{movie.Language}</p>
                    </div>
                  )}

                  {movie.Released && movie.Released !== 'N/A' && (
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:border-primary-500/30 transition-colors">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h4 className="text-sm font-medium text-gray-400">Release Date</h4>
                      </div>
                      <p className="text-white font-medium">{movie.Released}</p>
                    </div>
                  )}

                  {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30 hover:border-primary-500/30 transition-colors">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-primary-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <h4 className="text-sm font-medium text-gray-400">Box Office</h4>
                      </div>
                      <p className="text-white font-medium">{movie.BoxOffice}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Awards */}
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border border-yellow-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Awards & Recognition
                  </h3>
                  <div className="bg-yellow-500/5 rounded-lg p-4 border-l-4 border-yellow-400">
                    <p className="text-yellow-200 font-medium text-lg">{movie.Awards}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
