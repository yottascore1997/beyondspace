'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface QuickCategoriesProps {
  onAreaSelect?: (area: string) => void;
  selectedArea?: string;
}

export default function QuickCategories({ onAreaSelect, selectedArea }: QuickCategoriesProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const router = useRouter();

  const handleAreaClick = (areaName: string) => {
    // Navigate to area page
    router.push(`/area/${encodeURIComponent(areaName)}`);
  };

  const categories = [
    {
      id: 'bandra',
      name: 'Bandra',
      icon: '🌉',
      description: 'Sea Link & Premium Living',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'andheri',
      name: 'Andheri',
      icon: '🏢',
      description: 'Business Hub',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'juhu',
      name: 'Juhu',
      icon: '🏖️',
      description: 'Beach Side Luxury',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'worli',
      name: 'Worli',
      icon: '🏙️',
      description: 'High-Rise Towers',
      bgColor: 'bg-green-50'
    },
    {
      id: 'powai',
      name: 'Powai',
      icon: '💻',
      description: 'IT Hub & Lake Views',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'thane',
      name: 'Thane',
      icon: '🚇',
      description: 'Metro Connectivity',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'colaba',
      name: 'Colaba',
      icon: '🏛️',
      description: 'Heritage & Gateway',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'malad',
      name: 'Malad',
      icon: '🏘️',
      description: 'Residential Hub',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <section className="py-12 bg-white hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Quick Search by{' '}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Popular Areas
            </span>
          </h2>
          <p className="text-gray-600">Click on any area to explore all properties in that location</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleAreaClick(category.name)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`group relative rounded-2xl p-4 shadow-lg border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#a08efe]/20 ${
                selectedArea === category.name 
                  ? 'border-[#a08efe] bg-gradient-to-br from-[#a08efe]/10 to-cyan-400/10' 
                  : `${category.bgColor} border-gray-200 hover:border-[#a08efe]/50`
              }`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Icon */}
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300">
                {category.icon}
              </div>

              {/* Area Name */}
              <h3 className={`font-bold text-sm mb-1 transition-colors ${
                selectedArea === category.name 
                  ? 'text-[#a08efe]' 
                  : 'text-gray-900 group-hover:text-[#a08efe]'
              }`}>
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-2 leading-tight">
                {category.description}
              </p>


              {/* Hover Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-[#a08efe]/5 to-cyan-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                hoveredCategory === category.id ? 'animate-pulse' : ''
              }`}></div>

              {/* Active Indicator */}
              {selectedArea === category.name && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#a08efe] rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 bg-gray-50 rounded-2xl px-6 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#a08efe] rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">1000+ Properties Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">All Areas Covered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
