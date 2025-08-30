import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, loading, error, onWatchlistChange, onFavoritesChange }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="spinner"></div>
        <p className="text-gray-400 mt-4">Loading movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg
          className="w-16 h-16 text-gray-600 mb-4"
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
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Something went wrong</h3>
        <p className="text-gray-400 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg
          className="w-16 h-16 text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 010 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 010-2h4zM6 6v12h12V6H6zM8 8h8v2H8V8zm0 4h8v2H8v-2z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No movies found</h3>
        <p className="text-gray-400 text-center max-w-md">
          Try searching with different keywords or check your spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onWatchlistChange={onWatchlistChange}
          onFavoritesChange={onFavoritesChange}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
