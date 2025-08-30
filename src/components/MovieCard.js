import React from 'react';
import { Link } from 'react-router-dom';
import movieService from '../services/movieService';
import storageService from '../services/storageService';

const MovieCard = ({ movie, onWatchlistChange, onFavoritesChange }) => {
  const isInWatchlist = storageService.isInWatchlist(movie.imdbID);
  const isInFavorites = storageService.isInFavorites(movie.imdbID);

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWatchlist) {
      storageService.removeFromWatchlist(movie.imdbID);
    } else {
      storageService.addToWatchlist(movie);
    }
    
    if (onWatchlistChange) {
      onWatchlistChange();
    }
  };

  const handleFavoritesToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInFavorites) {
      storageService.removeFromFavorites(movie.imdbID);
    } else {
      storageService.addToFavorites(movie);
    }
    
    if (onFavoritesChange) {
      onFavoritesChange();
    }
  };

  const posterUrl = movieService.getPosterUrl(movie.Poster, movie.Title);

  return (
    <div className="movie-card group">
      <Link to={`/movie/${movie.imdbID}`} className="block">
        <div className="relative">
          {/* Movie Poster */}
          <img
            src={posterUrl}
            alt={movie.Title}
            className="w-full h-96 object-cover movie-poster"
            loading="lazy"
            onError={(e) => {
              e.target.src = movieService.getPosterUrl(null, movie.Title);
            }}
          />
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Watchlist Button */}
            <button
              onClick={handleWatchlistToggle}
              className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                isInWatchlist
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <svg
                className="w-4 h-4"
                fill={isInWatchlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>

            {/* Favorites Button */}
            <button
              onClick={handleFavoritesToggle}
              className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                isInFavorites
                  ? 'bg-red-600 text-white'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
              title={isInFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <svg
                className="w-4 h-4"
                fill={isInFavorites ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Movie Type Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md uppercase">
              {movie.Type}
            </span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {movie.Title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">{movie.Year}</span>
            <div className="flex items-center space-x-1">
              {isInWatchlist && (
                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
              {isInFavorites && (
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
