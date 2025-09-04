# 🎬 CineStream - Movie Discovery Platform

A modern, responsive movie streaming and discovery web application built with React.js and Tailwind CSS. Search for movies using the OMDb API, view detailed information, manage your watchlist, and discover new favorites with an engaging homepage experience.

## 🚀 Live Demo  
🔗 [CineStream Live Demo](https://cine-stream-movie-app-53ur.vercel.app/)

 <img width="1366" height="933" alt="d2" src="https://github.com/user-attachments/assets/cbd42ed8-2108-451b-89cb-e6eee875ea8e" />

## ✨ Features

### 🏠 Enhanced Homepage Experience
- 🎭 **Welcome Screen**: Beautiful gradient welcome message with smooth animations
- 🎬 **Featured Movies**: Curated collection of popular movies displayed immediately
- 🎨 **Genre Categories**: Quick browse by Action, Comedy, Horror, Romance, Sci-Fi, Drama, Thriller, Fantasy
- � **Popular Searches**: One-click access to trending movie franchises (Marvel, Batman, Star Wars, etc.)
- ✨ **Smooth Animations**: Staggered fade-in effects and hover animations

### 🔍 Advanced Search & Discovery
- 🔍 **Smart Search**: Search movies by title using IMDb/OMDb API
- 💡 **Auto-suggestions**: Intelligent search suggestions as you type
- 📄 **Paginated Results**: Navigate through extensive movie catalogs
- 🔄 **Instant Navigation**: Quick search from any genre or popular term

### 📖 Rich Movie Details
- 📖 **Detailed Information**: View cast, plot, ratings, release year, and high-quality posters
- 🎥 **Trailer Integration**: Direct links to YouTube trailers
- 🌟 **Multiple Ratings**: IMDb, Rotten Tomatoes, and Metacritic scores
- 🔗 **IMDb Integration**: Direct links to IMDb pages

### 💾 Personal Collections
- ⭐ **Watchlist**: Save movies to watch later with persistent storage
- ❤️ **Favorites**: Mark movies as favorites with local storage
- 📊 **Statistics**: Track your collection size and activity

### 🎨 Modern UI/UX
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop
- 🌙 **Dark Theme**: Modern dark UI with gradient accents
- ⚡ **Fast Performance**: Optimized React components with lazy loading
- 🎭 **Interactive Elements**: Hover effects, smooth transitions, and micro-animations

## 🛠️ Technologies Used

- **Frontend**: React.js 18.2.0 with Hooks and Context
- **Styling**: Tailwind CSS 3.3.0 with custom animations
- **Routing**: React Router Dom 6.15.0 for SPA navigation
- **HTTP Client**: Axios 1.5.0 for API requests
- **API**: OMDb API (IMDb data) with error handling
- **Storage**: Local Storage for persistent watchlist/favorites
- **Build Tool**: Create React App with ES6+ features
- **Icons**: Custom SVG icons and emoji for better UX

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nadeesh-Malaka/CineStream-movie-app.git
   cd CineStream-movie-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get OMDb API Key**
   - Visit [OMDb API](https://www.omdbapi.com/apikey.aspx)
   - Sign up for a free API key
   - Copy your API key

4. **Configure Environment Variables**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   
   # Edit .env and add your API key
   REACT_APP_OMDB_API_KEY=your_actual_api_key_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   npm start
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Homepage Experience
- **Welcome**: Enjoy the animated welcome screen with gradient text
- **Featured Movies**: Browse curated movies that load automatically
- **Genre Categories**: Click any genre (Action, Comedy, Horror, etc.) to explore
- **Popular Searches**: One-click access to franchises like Marvel, Batman, Star Wars

### Search & Discovery
- Use the search bar for intelligent auto-suggestions
- Browse through paginated results with smooth animations
- Click on any movie card to view comprehensive details
- Navigate back to homepage anytime for fresh discoveries

### Movie Details
- View comprehensive movie information with high-quality posters
- Watch trailers directly on YouTube
- Add to watchlist or favorites with persistent storage
- Access direct links to IMDb pages for more information

### Collection Management
- **Watchlist**: Save movies to watch later (persists in local storage)
- **Favorites**: Mark movies you love with heart icon
- **Statistics**: Track your collection size and activity
- **Quick Actions**: Add/remove movies with single clicks

## 🏗️ Project Structure

```
movie-watch-site/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # Navigation, search bar with suggestions
│   │   ├── MovieCard.js       # Individual movie display cards
│   │   ├── MovieGrid.js       # Grid layout with loading states
│   │   ├── LoadingSpinner.js  # Loading animations
│   │   ├── Categories.js      # Genre category buttons
│   │   └── TrendingSection.js # Trending/popular content
│   ├── pages/
│   │   ├── Home.js           # Enhanced homepage with featured content
│   │   ├── MovieDetails.js   # Detailed movie view with trailers
│   │   ├── Watchlist.js      # Personal watchlist management
│   │   └── Favorites.js      # Favorite movies collection
│   ├── services/
│   │   ├── movieService.js   # OMDb API integration with error handling
│   │   └── storageService.js # Local storage management utilities
│   ├── App.js               # Main app component with routing
│   ├── App.css              # Custom component styles
│   ├── index.js             # Entry point with React 18 features
│   └── index.css            # Tailwind imports + custom animations
├── .env                     # Environment variables (API keys)
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Custom Tailwind configuration
├── postcss.config.js       # PostCSS setup for Tailwind
└── README.md              # Project documentation
```

## 🎨 Customization

### Styling & Themes
- Modify `tailwind.config.js` for custom colors, gradients, and themes
- Update `src/index.css` for custom animations and component styles
- Components use Tailwind utility classes with custom CSS animations
- Easy to extend with new color schemes and design tokens

### Homepage Content
- Update featured movie collections in `Home.js`
- Modify genre categories and popular searches
- Customize welcome messages and animations
- Add new content sections (coming soon, top rated, etc.)

### API Integration
- Extend `movieService.js` for additional OMDb API endpoints
- Add new data sources or movie databases (TMDB, etc.)
- Implement caching mechanisms for better performance
- Add rate limiting and error retry logic

### Feature Extensions
- Add user authentication and profiles
- Implement movie ratings and user reviews
- Add movie recommendations based on viewing history
- Integrate with streaming platforms (Netflix, Hulu, etc.)
- Add social features (sharing, comments, lists)

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Alternative command to start development server  
- `npm run build` - Build optimized production bundle
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (not recommended)

## 🌟 Key Features Explained

### Enhanced Homepage Experience
- **Smart Welcome**: Gradient animated welcome screen that immediately engages users
- **Featured Movies**: Auto-loading curated collection (Marvel, Batman, Star Wars) for instant engagement
- **Genre Discovery**: Visual category grid with emoji icons for quick genre browsing
- **Popular Searches**: One-click access to trending franchises and popular movie series
- **Smooth Animations**: Staggered fade-in effects, hover transforms, and micro-interactions

### Advanced Search System
- **Real-time API Integration**: Fast OMDb API calls with proper error handling
- **Smart Suggestions**: Auto-complete functionality as users type
- **Pagination Support**: Navigate through large result sets efficiently
- **Loading States**: Skeleton screens and loading spinners for better UX
- **Error Recovery**: Graceful error handling with retry options

### Movie Detail Experience
- **Rich Information Display**: Comprehensive movie data with high-quality posters
- **Multiple Rating Sources**: IMDb, Rotten Tomatoes, and Metacritic scores
- **Cast and Crew**: Detailed information about actors and production team
- **Trailer Integration**: Direct YouTube links for movie previews
- **External Links**: Quick access to IMDb pages for extended information

### Collection Management
- **Persistent Storage**: Watchlist and favorites saved in browser local storage
- **Quick Actions**: One-click add/remove functionality with visual feedback
- **Statistics Tracking**: Monitor collection size and user activity
- **Data Export**: Easy way to backup or transfer collections
- **Bulk Operations**: Clear all, export, or manage multiple items at once

## 🔑 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_OMDB_API_KEY` | OMDb API key for movie data | Yes | `12345abc` |
| `GENERATE_SOURCEMAP` | Generate source maps (false for production) | No | `false` |
| `REACT_APP_API_BASE_URL` | Base URL for OMDb API | No | `https://www.omdbapi.com/` |

## 🚀 Deployment

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify
3. Add environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- [OMDb API](https://www.omdbapi.com/) for comprehensive movie data and IMDb integration
- [IMDb](https://www.imdb.com/) for movie information and ratings database
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework and responsive design
- [React](https://reactjs.org/) for the component-based frontend framework
- [Heroicons](https://heroicons.com/) for beautiful SVG icons
- [Google Fonts](https://fonts.google.com/) for the Inter font family
- [Create React App](https://create-react-app.dev/) for project bootstrapping and build tools

## 📞 Support & Contact

If you have any questions, suggestions, or need help:
- 🐛 **Bug Reports**: Open an issue on GitHub with detailed steps to reproduce
- 💡 **Feature Requests**: Create an issue with the "enhancement" label  
- 📚 **Documentation**: Check this README and inline code comments
- 🔧 **API Issues**: Review the OMDb API documentation and check your API key
- 💬 **General Questions**: Use GitHub Discussions for community support

### Common Issues
- **API Key**: Make sure your OMDb API key is valid and properly set in `.env`
- **CORS Errors**: OMDb API should work from localhost, but check browser console
- **Loading Issues**: Ensure stable internet connection for API calls
- **Storage Problems**: Clear browser local storage if watchlist/favorites aren't working
  
##                                       Happy Coding 😎❤

---

**Happy Movie Discovering! 🍿 Enjoy exploring the world of cinema with CineStream!**
