'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Horizontal Property Card Component
const HorizontalPropertyCard = ({ property }: { property: Property }) => {
  const [isFav, setIsFav] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Get all available images (main image + additional images)
  const allImages = property.propertyImages && property.propertyImages.length > 0 
    ? [property.image, ...property.propertyImages.map(img => img.imageUrl).filter(img => img !== property.image)]
    : [property.image];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Link 
      href={`/property/${property.id}`} 
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <div className="flex flex-col lg:flex-row">
          {/* Image Section - Full width on mobile, left side on desktop */}
          <div className="w-full lg:w-80 h-48 sm:h-56 lg:h-56 flex-shrink-0 relative group overflow-hidden">
            <img
              src={allImages[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300"
            />
            
            {/* Image Navigation Arrows - Only show if multiple images */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image Indicators */}
            {allImages.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1}/{allImages.length}
              </div>
            )}
            
            {property.tag && (
              <div className="absolute top-3 left-3">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  {property.tag}
                </span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFav(!isFav);
              }}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
            >
              <svg
                className={`w-5 h-5 ${isFav ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
              ⭐ {property.rating}
            </div>
          </div>

          {/* Details Section - Below image on mobile, right side on desktop */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{property.area}, {property.city}</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {property.priceDisplay}
                </div>
                <div className="text-sm text-gray-500">/month</div>
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="whitespace-nowrap">{property.size} sq ft</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                <span className="whitespace-nowrap">{property.type}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                <span className="whitespace-nowrap">{property.beds}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="whitespace-nowrap">{property.purpose}</span>
              </div>
            </div>

            {/* Coworking Specific Details - Outside Box */}
            {property.type === 'COWORKING' && (property.workspaceTimings || property.superArea || property.capacity || (property.amenities && property.amenities.length > 0)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {property.workspaceTimings && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Timings:</span>
                    <span className="ml-1">{property.workspaceTimings}</span>
                  </div>
                )}
                {property.superArea && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium">Super Area:</span>
                    <span className="ml-1">{property.superArea}+ sq ft</span>
                  </div>
                )}
                {property.capacity && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">Seats:</span>
                    <span className="ml-1">{property.capacity}+</span>
                  </div>
                )}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="font-medium">Amenities:</span>
                    <span className="ml-1">{property.amenities.length}</span>
                  </div>
                )}
              </div>
            )}

            {/* Amenities Preview */}
            {property.type === 'COWORKING' && property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {property.amenities.slice(0, 8).map((amenity, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200">
                      {amenity.name}
                    </span>
                  ))}
                  {property.amenities.length > 8 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                      +{property.amenities.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Property Description Preview */}
            {property.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {property.description}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                  {property.purpose}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                  Available Now
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle call functionality
                  }}
                  className="text-orange-400 hover:text-blue-900 font-medium text-sm flex items-center justify-center gap-1 py-2 px-3 border border-orange-400 rounded-lg hover:border-blue-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Handle get best price functionality
                  }}
                  className="bg-orange-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors"
                >
                  Get best price
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface PropertyImage {
  id: string;
  imageUrl: string;
  propertyId: string;
  createdAt: string;
}

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

interface Filters {
  sortBy: string;
  mainCategory: string;
  area: string;
}

export default function AreaPage() {
  const params = useParams();
  const area = params.area as string;
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    sortBy: 'Popularity',
    mainCategory: 'all',
    area: 'all'
  });

  // Decode the area name from URL
  const areaName = decodeURIComponent(area);

  useEffect(() => {
    fetchAreaProperties();
  }, [area]);

  useEffect(() => {
    filterAndSortProperties();
  }, [properties, filters, searchQuery]);

  const fetchAreaProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties?area=${encodeURIComponent(areaName)}&city=Mumbai`);
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

    // Main category filter
    if (filters.mainCategory !== 'all') {
      filtered = filtered.filter(property => {
        const propertyType = property.type.toLowerCase();
        switch (filters.mainCategory) {
          case 'coworking':
            return propertyType === 'coworking';
          case 'managed':
            return propertyType === 'managed office' || propertyType === 'office';
          case 'virtualoffice':
            return propertyType === 'virtual office';
          case 'meetingroom':
            return propertyType === 'meeting room';
          case 'dedicateddesk':
            return propertyType === 'dedicated desk';
          case 'flexidesk':
            return propertyType === 'flexi desk';
          case 'enterpriseoffices':
            return propertyType === 'enterprise office';
          default:
            return true;
        }
      });
    }

    // Area filter (when category is selected)
    if (filters.area !== 'all' && filters.mainCategory !== 'all') {
      filtered = filtered.filter(property => 
        property.area.toLowerCase() === filters.area.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type.toLowerCase().includes(searchQuery.toLowerCase())
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
      mainCategory: 'all',
      area: 'all'
    });
    setSearchQuery('');
  };

  // Area info mapping
  const areaInfo: Record<string, { description: string; icon: string; bgColor: string }> = {
    'Bandra': {
      description: 'The Queen of Suburbs - Premium residential and commercial hub with excellent connectivity',
      icon: '🌉',
      bgColor: 'from-blue-500 to-cyan-500'
    },
    'Andheri': {
      description: 'Business district with excellent connectivity, metro access and modern amenities',
      icon: '🏢',
      bgColor: 'from-purple-500 to-pink-500'
    },
    'Juhu': {
      description: 'Beachside luxury living with celebrity homes and premium properties',
      icon: '🏖️',
      bgColor: 'from-orange-500 to-yellow-500'
    },
    'Worli': {
      description: 'Premium seafront location with high-rise towers and sea views',
      icon: '🏙️',
      bgColor: 'from-green-500 to-teal-500'
    },
    'Powai': {
      description: 'IT hub with modern infrastructure, lake views and tech companies',
      icon: '💻',
      bgColor: 'from-cyan-500 to-blue-500'
    },
    'Thane': {
      description: 'Rapidly developing suburb with great metro connectivity',
      icon: '🚇',
      bgColor: 'from-pink-500 to-purple-500'
    },
    'Colaba': {
      description: 'Heritage area with Gateway of India and premium South Mumbai location',
      icon: '🏛️',
      bgColor: 'from-yellow-500 to-orange-500'
    },
    'Malad': {
      description: 'Growing residential hub with affordable housing and good connectivity',
      icon: '🏘️',
      bgColor: 'from-indigo-500 to-purple-500'
    }
  };

  const currentAreaInfo = areaInfo[areaName] || {
    description: 'Explore premium properties in this prime Mumbai location',
    icon: '🏠',
    bgColor: 'from-gray-500 to-slate-500'
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
      `}</style>
      <Header />
      
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#a08efe] transition-colors">Home</Link>
            <span>›</span>
            <a href="#" className="hover:text-[#a08efe] transition-colors">Properties</a>
            <span>›</span>
            <span className="text-gray-900 font-medium">{areaName}</span>
          </nav>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Properties in {areaName}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search location or workspaces in ${areaName}...`}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Main Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All Categories', icon: '🏢' },
                { key: 'coworking', label: 'Coworking', icon: '💼' },
                { key: 'managed', label: 'Managed Office Space', icon: '🏢' },
                { key: 'virtualoffice', label: 'Virtual Office', icon: '💻' },
                { key: 'meetingroom', label: 'Meeting Room', icon: '🤝' },
                { key: 'dedicateddesk', label: 'Dedicated Desk', icon: '🪑' },
                { key: 'flexidesk', label: 'Flexi Desk', icon: '🔄' },
                { key: 'enterpriseoffices', label: 'Enterprise Offices', icon: '🏗️' }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setFilters(prev => ({ ...prev, mainCategory: category.key }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filters.mainCategory === category.key
                      ? 'bg-orange-400 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Area Filter - Show when category is selected */}
          {filters.mainCategory !== 'all' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by Area</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { key: 'all', label: 'All Areas', icon: '🏢' },
                  { key: 'Andheri', label: 'Andheri', icon: '🏢' },
                  { key: 'Bandra', label: 'Bandra', icon: '🌉' },
                  { key: 'Juhu', label: 'Juhu', icon: '🏖️' },
                  { key: 'Worli', label: 'Worli', icon: '🏙️' },
                  { key: 'Powai', label: 'Powai', icon: '💻' },
                  { key: 'Thane', label: 'Thane', icon: '🚇' },
                  { key: 'Colaba', label: 'Colaba', icon: '🏛️' },
                  { key: 'Malad', label: 'Malad', icon: '🏘️' }
                ].map((area) => (
                  <button
                    key={area.key}
                    onClick={() => {
                      if (area.key === 'all') {
                        // Reset area filter
                        setFilters(prev => ({ ...prev, area: 'all' }));
                      } else {
                        // Filter within same page
                        setFilters(prev => ({ ...prev, area: area.key }));
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      area.key === areaName || (filters.area !== 'all' && area.key === filters.area)
                        ? 'bg-orange-400 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-50 hover:border-orange-300'
                    }`}
                  >
                    <span className="text-lg">{area.icon}</span>
                    <span className="text-sm">{area.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold">{filteredProperties.length} result(s)</span> for <span className="font-semibold">properties in {filters.area !== 'all' ? filters.area : areaName}</span>
                {filters.mainCategory !== 'all' && (
                  <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                    {[
                      { key: 'all', label: 'All Categories' },
                      { key: 'coworking', label: 'Coworking' },
                      { key: 'managed', label: 'Managed Office Space' },
                      { key: 'virtualoffice', label: 'Virtual Office' },
                      { key: 'meetingroom', label: 'Meeting Room' },
                      { key: 'dedicateddesk', label: 'Dedicated Desk' },
                      { key: 'flexidesk', label: 'Flexi Desk' },
                      { key: 'enterpriseoffices', label: 'Enterprise Offices' }
                    ].find(cat => cat.key === filters.mainCategory)?.label}
                  </span>
                )}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-400 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-400 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded ${viewMode === 'map' ? 'bg-orange-400 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section with Sidebar */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Properties List - Left Side */}
          <div className="flex-1 order-2 lg:order-1">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex flex-col lg:flex-row">
                      <div className="w-full lg:w-80 h-48 sm:h-56 lg:h-56 bg-gray-300"></div>
                      <div className="flex-1 p-4 sm:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div className="space-y-2">
                            <div className="h-6 bg-gray-300 rounded w-64"></div>
                            <div className="h-4 bg-gray-300 rounded w-48"></div>
                          </div>
                          <div className="text-left sm:text-right space-y-2">
                            <div className="h-6 bg-gray-300 rounded w-24"></div>
                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                          <div className="h-4 bg-gray-300 rounded w-20"></div>
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-4 bg-gray-300 rounded w-16"></div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div className="flex gap-2">
                            <div className="h-6 bg-gray-300 rounded w-16"></div>
                            <div className="h-6 bg-gray-300 rounded w-20"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-8 bg-gray-300 rounded w-16"></div>
                            <div className="h-8 bg-gray-300 rounded w-24"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <HorizontalPropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-8">
                  No properties match your current filters in {areaName}. 
                  Try adjusting your search criteria.
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

          {/* Request Callback Sidebar - Right Side */}
          <div className="w-full lg:w-80 xl:w-96 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:sticky lg:top-4">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  Get {filters.mainCategory === 'all' ? 'Office Space' : [
                    { key: 'all', label: 'Office Space' },
                    { key: 'coworking', label: 'Coworking Space' },
                    { key: 'managed', label: 'Managed Office Space' },
                    { key: 'virtualoffice', label: 'Virtual Office' },
                    { key: 'meetingroom', label: 'Meeting Room' },
                    { key: 'dedicateddesk', label: 'Dedicated Desk' },
                    { key: 'flexidesk', label: 'Flexi Desk' },
                    { key: 'enterpriseoffices', label: 'Enterprise Office' }
                  ].find(cat => cat.key === filters.mainCategory)?.label} in {areaName}
                </h3>
                <p className="text-gray-600 text-sm">
                  Beyond Space Work Consultant assisted 150+ corporates in {areaName} to move into their new office.
                </p>
              </div>

              {/* Contact Form */}
              <form className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name*"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address*"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number*"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>
                <div>
                  <select 
                    value={filters.mainCategory}
                    onChange={(e) => setFilters(prev => ({ ...prev, mainCategory: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="all">All Categories</option>
                    <option value="coworking">Coworking Space</option>
                    <option value="managed">Managed Office Space</option>
                    <option value="virtualoffice">Virtual Office</option>
                    <option value="meetingroom">Meeting Room</option>
                    <option value="dedicateddesk">Dedicated Desk</option>
                    <option value="flexidesk">Flexi Desk</option>
                    <option value="enterpriseoffices">Enterprise Office</option>
                  </select>
                </div>
                <div>
                  <textarea
                    placeholder="Tell us about your requirements..."
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-400 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Connect with us
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 mb-3">Explore workspace solutions with our expert guidance:</p>
                  <div className="space-y-2">
                    <div className="flex items-start text-xs sm:text-sm text-gray-600">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Brand selection & location strategy</span>
                    </div>
                    <div className="flex items-start text-xs sm:text-sm text-gray-600">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Office scouting, tours & local expertise</span>
                    </div>
                    <div className="flex items-start text-xs sm:text-sm text-gray-600">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Layout optimization & design consultancy</span>
                    </div>
                    <div className="flex items-start text-xs sm:text-sm text-gray-600">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Lease negotiations, signing & move-in support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
