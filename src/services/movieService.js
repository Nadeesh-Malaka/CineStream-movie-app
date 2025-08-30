import axios from 'axios';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY || 'your_api_key_here';
const BASE_URL = 'https://www.omdbapi.com';

class MovieService {
  // Search for movies by title
  async searchMovies(query, page = 1) {
    try {
      console.log('API Key:', API_KEY);
      console.log('Searching for:', query);
      const url = `${BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
      console.log('Request URL:', url);
      
      const response = await axios.get(url);
      console.log('API Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  // Get detailed movie information by IMDb ID
  async getMovieDetails(imdbId) {
    try {
      const response = await axios.get(`${BASE_URL}/?apikey=${API_KEY}&i=${imdbId}&plot=full`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  // Get movie by title with specific year
  async getMovieByTitle(title, year = '') {
    try {
      const yearParam = year ? `&y=${year}` : '';
      const response = await axios.get(`${BASE_URL}/?apikey=${API_KEY}&t=${encodeURIComponent(title)}${yearParam}&plot=full`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie by title:', error);
      throw error;
    }
  }

  // Extract YouTube trailer ID from various URL formats
  extractYouTubeId(url) {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Generate YouTube search URL for movie trailer
  getTrailerSearchUrl(movieTitle, year = '') {
    const searchQuery = `${movieTitle} ${year} trailer`.replace(/\s+/g, '+');
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  }

  // Get IMDb URL for a movie
  getImdbUrl(imdbId) {
    return `https://www.imdb.com/title/${imdbId}/`;
  }

  // Format rating for display
  formatRating(rating) {
    if (!rating || rating === 'N/A') return 'Not Rated';
    return rating;
  }

  // Format runtime for display
  formatRuntime(runtime) {
    if (!runtime || runtime === 'N/A') return 'Unknown';
    return runtime;
  }

  // Get movie poster with fallback
  getPosterUrl(poster, title = 'Movie') {
    if (poster && poster !== 'N/A') {
      return poster;
    }
    // Fallback placeholder
    return `https://via.placeholder.com/300x450/1f2937/ffffff?text=${encodeURIComponent(title)}`;
  }
}

export default new MovieService();
