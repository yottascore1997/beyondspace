'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  city: string;
  area: string;
  purpose: string;
  type: string;
  priceDisplay: string;
  price: number;
  size: number;
  beds: string;
  rating: number;
  image: string;
  propertyImages?: PropertyImage[];
  tag?: string;
  description?: string;
  // Coworking specific fields
  workspaceName?: string;
  workspaceTimings?: string;
  workspaceClosedDays?: string;
  amenities?: Array<{icon: string; name: string; category: string}>;
  locationDetails?: string;
  aboutWorkspace?: string;
  capacity?: number;
  superArea?: number;
}

interface PropertyImage {
  id: string;
  imageUrl: string;
  propertyId: string;
  createdAt: string;
}

interface Filters {
  sortBy: string;
  area: string;
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<Filters>({
    sortBy: 'Popularity',
    area: 'all'
  });
  const [isGridShaking, setIsGridShaking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Decode the category name from URL
  const categoryName = decodeURIComponent(category);

  useEffect(() => {
    fetchCategoryProperties();
  }, [category]);

  useEffect(() => {
    filterAndSortProperties();
  }, [properties, filters, searchQuery]);

  const fetchCategoryProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties?category=${encodeURIComponent(categoryName)}&city=Mumbai`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProperties = () => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.area.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Area filter
    if (filters.area !== 'all') {
      filtered = filtered.filter(property => 
        property.area.toLowerCase() === filters.area.toLowerCase()
      );
    }


    // Sort properties
    if (filters.sortBy === 'Price: Low to High') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'Price: High to Low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'Rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({
      sortBy: 'Popularity',
      area: 'all'
    });
  };

  const handleEnquireClick = () => {
    setIsGridShaking(true);
    setIsModalOpen(true);
    setTimeout(() => setIsGridShaking(false), 500); // Shake for 0.5 seconds
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Category info mapping
  const categoryInfo: Record<string, { description: string; icon: string; bgColor: string }> = {
    'coworking': {
      description: 'Flexible shared workspaces with modern amenities and networking opportunities',
      icon: '💼',
      bgColor: 'from-blue-500 to-cyan-500'
    },
    'managed': {
      description: 'Fully managed office spaces with professional services and infrastructure',
      icon: '🏢',
      bgColor: 'from-purple-500 to-pink-500'
    },
    'virtualoffice': {
      description: 'Professional business address and virtual office services',
      icon: '💻',
      bgColor: 'from-green-500 to-teal-500'
    },
    'meetingroom': {
      description: 'On-demand meeting rooms and conference facilities',
      icon: '🤝',
      bgColor: 'from-orange-500 to-yellow-500'
    },
    'dedicateddesk': {
      description: 'Personal dedicated desk in shared workspace environment',
      icon: '🪑',
      bgColor: 'from-indigo-500 to-purple-500'
    },
    'flexidesk': {
      description: 'Flexible desk options with pay-as-you-use model',
      icon: '🔄',
      bgColor: 'from-pink-500 to-rose-500'
    },
    'enterpriseoffices': {
      description: 'Large-scale office solutions for enterprise clients',
      icon: '🏗️',
      bgColor: 'from-gray-500 to-slate-500'
    }
  };

  const currentCategoryInfo = categoryInfo[categoryName] || {
    description: 'Explore premium workspace solutions in this category',
    icon: '🏢',
    bgColor: 'from-gray-500 to-slate-500'
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'coworking': 'Coworking Spaces',
      'managed': 'Managed Office Spaces',
      'virtualoffice': 'Virtual Offices',
      'meetingroom': 'Meeting Rooms',
      'dedicateddesk': 'Dedicated Desks',
      'flexidesk': 'Flexi Desks',
      'enterpriseoffices': 'Enterprise Offices'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        .grid-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <Header />
      

      {/* Main Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {getCategoryDisplayName(categoryName)} in Mumbai
            </h1>
            <p className="text-gray-600 mt-2">{currentCategoryInfo.description}</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by property name or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-transparent sm:text-sm"
              />
            </div>
          </div>

          {/* Area Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by Area</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All Areas' },
                { key: 'Thane', label: 'Thane' },
                { key: 'Navi Mumbai', label: 'Navi Mumbai' },
                { key: 'Andheri West', label: 'Andheri West' },
                { key: 'Andheri East', label: 'Andheri East' },
                { key: 'Andheri', label: 'Andheri' },
                { key: 'BKC', label: 'BKC' },
                { key: 'Lower Parel', label: 'Lower Parel' },
                { key: 'Vashi', label: 'Vashi' },
                { key: 'Powai', label: 'Powai' },
                { key: 'Borivali', label: 'Borivali' },
                { key: 'Goregaon', label: 'Goregaon' },
                { key: 'Bandra', label: 'Bandra' },
                { key: 'Malad', label: 'Malad' },
                { key: 'Dadar', label: 'Dadar' },
                { key: 'Mulund', label: 'Mulund' },
                { key: 'Borivali West', label: 'Borivali West' },
                { key: 'Vikhroli', label: 'Vikhroli' },
                { key: 'Worli', label: 'Worli' },
                { key: 'Churchgate', label: 'Churchgate' },
                { key: 'Marol', label: 'Marol' },
                { key: 'Vile Parle', label: 'Vile Parle' }
              ].map((area) => (
                <button
                  key={area.key}
                  onClick={() => setFilters(prev => ({ ...prev, area: area.key }))}
                  className={`px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 ${
                    filters.area === area.key
                      ? 'bg-orange-400 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold">{filteredProperties.length} result(s)</span> for <span className="font-semibold">{getCategoryDisplayName(categoryName)} in {filters.area !== 'all' ? filters.area : 'Mumbai'}</span>
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-400 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-400 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm"
              >
                <option value="Popularity">Sort by Popularity</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Rating">Sort by Rating</option>
              </select>
              <button
                onClick={resetFilters}
                className="bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Properties List */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse">
                    <div className="h-96 bg-gray-300 rounded-t-2xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'space-y-4'}>
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onEnquireClick={handleEnquireClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-8">
                  No properties match your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />

      {/* Modal Popup */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
            <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-50 flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Panel - Office Space Features */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex-1 rounded-l-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Office Now!</h2>
                <p className="text-gray-700 text-lg">Our space experts will provide customized quote with detailed inventory as per your needs</p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">Customized Workspaces</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">Prime Locations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">Free Guided Tours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">Flexible Terms</span>
                </div>
              </div>

            </div>

            {/* Right Panel - Contact Form */}
            <div className="p-8 flex-1 relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Interested in this Property</h3>
                <p className="text-gray-600">Fill your details for a customized quote</p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                  <div className="flex gap-2">
                    <select className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      <option>+91</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300">
                      <option>Select Type</option>
                      <option>Coworking</option>
                      <option>Managed Office</option>
                      <option>Virtual Office</option>
                      <option>Meeting Room</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Of Seats</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300">
                      <option>Select Seats</option>
                      <option>1-5</option>
                      <option>6-10</option>
                      <option>11-20</option>
                      <option>21-50</option>
                      <option>50+</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg"
                >
                  Submit
                </button>
              </form>

              {/* Contact Expert Section */}
              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Connect with our space expert</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-blue-600 text-sm">hello@beyondspacework.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
