import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Watchlist from './pages/Watchlist';
import Favorites from './pages/Favorites';

// Main App component that handles search navigation
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (query) => {
    if (query.trim()) {
      if (location.pathname === '/') {
        // If already on home page, update search params
        navigate(`/?q=${encodeURIComponent(query)}&page=1`);
      } else {
        // Navigate to home page with search
        navigate(`/?q=${encodeURIComponent(query)}&page=1`);
      }
    }
  };

  return (
    <div className="App">
      <Header onSearch={handleSearch} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// 404 Not Found component
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

// Footer component
function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
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
            <span className="text-xl font-bold text-white">CineStream</span>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Discover amazing movies and TV shows. Data provided by OMDb API.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2025 CineStream. Built with React & Tailwind CSS.
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="https://www.omdbapi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              OMDb API
            </a>
            <a
              href="https://www.imdb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              IMDb
            </a>
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Tailwind CSS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Root App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
