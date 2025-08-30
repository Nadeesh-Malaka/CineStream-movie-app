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
                <div className="flex flex-wrap items-center gap-6">
                  {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white font-semibold">{movie.imdbRating}/10</span>
                      <span className="text-gray-400 text-sm">IMDb</span>
                    </div>
                  )}
                  {movie.Ratings && movie.Ratings.length > 0 && (
                    movie.Ratings.map((rating, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-gray-400">{rating.Source}:</span>
                        <span className="text-white ml-1">{rating.Value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Genres */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.Genre.split(', ').map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Plot</h3>
                  <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
                </div>
              )}

              {/* Cast and Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Director</h3>
                    <p className="text-gray-300">{movie.Director}</p>
                  </div>
                )}

                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Writer</h3>
                    <p className="text-gray-300">{movie.Writer}</p>
                  </div>
                )}

                {movie.Actors && movie.Actors !== 'N/A' && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                    <p className="text-gray-300">{movie.Actors}</p>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {movie.Country && movie.Country !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Country</h3>
                    <p className="text-gray-300">{movie.Country}</p>
                  </div>
                )}

                {movie.Language && movie.Language !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Language</h3>
                    <p className="text-gray-300">{movie.Language}</p>
                  </div>
                )}

                {movie.Released && movie.Released !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Release Date</h3>
                    <p className="text-gray-300">{movie.Released}</p>
                  </div>
                )}

                {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Box Office</h3>
                    <p className="text-gray-300">{movie.BoxOffice}</p>
                  </div>
                )}

                {movie.Awards && movie.Awards !== 'N/A' && (
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-white mb-2">Awards</h3>
                    <p className="text-gray-300">{movie.Awards}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
