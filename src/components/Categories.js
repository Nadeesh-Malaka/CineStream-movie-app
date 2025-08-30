import React from 'react';

const Categories = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    { id: 'trending', name: 'Trending', icon: '🔥', searches: ['trending', 'popular', 'top rated'] },
    { id: 'action', name: 'Action', icon: '💥', searches: ['action', 'fast furious', 'mission impossible', 'john wick'] },
    { id: 'comedy', name: 'Comedy', icon: '😄', searches: ['comedy', 'funny', 'hangover', 'meet the parents'] },
    { id: 'drama', name: 'Drama', icon: '🎭', searches: ['drama', 'oscar', 'academy award', 'shawshank'] },
    { id: 'horror', name: 'Horror', icon: '👻', searches: ['horror', 'scary', 'conjuring', 'it'] },
    { id: 'romance', name: 'Romance', icon: '💕', searches: ['romance', 'love', 'romantic', 'titanic'] },
    { id: 'scifi', name: 'Sci-Fi', icon: '🚀', searches: ['science fiction', 'star wars', 'star trek', 'alien'] },
    { id: 'thriller', name: 'Thriller', icon: '🔪', searches: ['thriller', 'suspense', 'psychological', 'gone girl'] },
    { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️', searches: ['fantasy', 'lord of the rings', 'harry potter', 'marvel'] },
    { id: 'animation', name: 'Animation', icon: '🎨', searches: ['animation', 'disney', 'pixar', 'toy story'] },
    { id: 'superhero', name: 'Superhero', icon: '🦸‍♂️', searches: ['marvel', 'batman', 'superman', 'avengers'] },
    { id: 'war', name: 'War', icon: '⚔️', searches: ['war', 'world war', 'saving private ryan', 'platoon'] }
  ];

  const handleCategoryClick = (category) => {
    const randomSearch = category.searches[Math.floor(Math.random() * category.searches.length)];
    onCategorySelect(randomSearch, category.id);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`group relative bg-gradient-to-br from-gray-800 to-gray-900 hover:from-primary-600 hover:to-purple-600 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-700 hover:border-transparent ${
              selectedCategory === category.id ? 'from-primary-600 to-purple-600 scale-105' : ''
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <div className="text-sm font-medium text-white group-hover:text-white">
                {category.name}
              </div>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
