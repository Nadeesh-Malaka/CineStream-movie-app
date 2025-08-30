class StorageService {
  constructor() {
    this.WATCHLIST_KEY = 'movie_watchlist';
    this.FAVORITES_KEY = 'movie_favorites';
  }

  // Watchlist operations
  getWatchlist() {
    try {
      const watchlist = localStorage.getItem(this.WATCHLIST_KEY);
      return watchlist ? JSON.parse(watchlist) : [];
    } catch (error) {
      console.error('Error getting watchlist:', error);
      return [];
    }
  }

  addToWatchlist(movie) {
    try {
      const watchlist = this.getWatchlist();
      const exists = watchlist.some(item => item.imdbID === movie.imdbID);
      
      if (!exists) {
        const movieData = {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          Type: movie.Type,
          addedAt: new Date().toISOString()
        };
        watchlist.push(movieData);
        localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(watchlist));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  }

  removeFromWatchlist(imdbID) {
    try {
      const watchlist = this.getWatchlist();
      const updatedWatchlist = watchlist.filter(item => item.imdbID !== imdbID);
      localStorage.setItem(this.WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  }

  isInWatchlist(imdbID) {
    const watchlist = this.getWatchlist();
    return watchlist.some(item => item.imdbID === imdbID);
  }

  // Favorites operations
  getFavorites() {
    try {
      const favorites = localStorage.getItem(this.FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  addToFavorites(movie) {
    try {
      const favorites = this.getFavorites();
      const exists = favorites.some(item => item.imdbID === movie.imdbID);
      
      if (!exists) {
        const movieData = {
          imdbID: movie.imdbID,
          Title: movie.Title,
          Year: movie.Year,
          Poster: movie.Poster,
          Type: movie.Type,
          addedAt: new Date().toISOString()
        };
        favorites.push(movieData);
        localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  removeFromFavorites(imdbID) {
    try {
      const favorites = this.getFavorites();
      const updatedFavorites = favorites.filter(item => item.imdbID !== imdbID);
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  isInFavorites(imdbID) {
    const favorites = this.getFavorites();
    return favorites.some(item => item.imdbID === imdbID);
  }

  // Clear all data
  clearWatchlist() {
    localStorage.removeItem(this.WATCHLIST_KEY);
  }

  clearFavorites() {
    localStorage.removeItem(this.FAVORITES_KEY);
  }

  clearAll() {
    this.clearWatchlist();
    this.clearFavorites();
  }

  // Get statistics
  getStats() {
    return {
      watchlistCount: this.getWatchlist().length,
      favoritesCount: this.getFavorites().length
    };
  }
}

export default new StorageService();
