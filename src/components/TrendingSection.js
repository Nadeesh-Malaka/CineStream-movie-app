import React from 'react';

const TrendingSection = ({ onSearchClick }) => {
  const trendingSearches = [
    { term: 'Avengers Endgame', category: 'Superhero Epic', color: 'from-red-500 to-yellow-500' },
    { term: 'Dune', category: 'Sci-Fi Adventure', color: 'from-orange-500 to-amber-500' },
    { term: 'Spider-Man', category: 'Marvel Hero', color: 'from-red-600 to-blue-600' },
    { term: 'John Wick', category: 'Action Thriller', color: 'from-gray-700 to-gray-900' },
    { term: 'Top Gun Maverick', category: 'Action Drama', color: 'from-blue-500 to-sky-500' },
    { term: 'The Batman', category: 'DC Superhero', color: 'from-gray-800 to-black' },
    { term: 'Stranger Things', category: 'Sci-Fi Horror', color: 'from-red-700 to-orange-600' },
    { term: 'Wednesday', category: 'Dark Comedy', color: 'from-purple-700 to-black' }
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <span className="mr-3">🔥</span>
          Trending Now
        </h2>
        <div className="text-sm text-gray-400">
          Updated daily
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendingSearches.map((item, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(item.term)}
            className={`group relative bg-gradient-to-r ${item.color} rounded-xl p-6 text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-2">
                {item.category}
              </div>
              <div className="text-lg font-bold mb-2 group-hover:text-white transition-colors">
                {item.term}
              </div>
              <div className="flex items-center text-sm opacity-80">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Trending
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;
