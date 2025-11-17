'use client';

import { useState, useEffect, useRef } from 'react';
import { Poppins } from 'next/font/google';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import ShareRequirementsModal from '@/components/ShareRequirementsModal';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  city: string;
  area: string;
  sublocation?: string;
  purpose: string;
  type: string;
  displayOrder?: number;
  categories?: string[];
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
  metroStationDistance?: string | null;
  railwayStationDistance?: string | null;
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
  price: string;
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const category = params.category as string;
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('grid');
  
  // Initialize filters from URL params if available
  const initialArea = searchParams.get('area') || 'all';
  const [filters, setFilters] = useState<Filters>({
    sortBy: 'Popularity',
    area: initialArea,
    price: 'all'
  });
  const [isGridShaking, setIsGridShaking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [pendingArea, setPendingArea] = useState('all');
  const locationMenuRef = useRef<HTMLDivElement | null>(null);
  const propertiesPerPage = 8;
  const initialPropertiesCount = 30; // Show first 30 without pagination
  const [cityOptions, setCityOptions] = useState<{ id: string; name: string }[]>([]);
  const [areaOptions, setAreaOptions] = useState<{ id: string; name: string; cityId: string }[]>([]);
  const [mumbaiCityId, setMumbaiCityId] = useState<string>('');

  // Decode the category name from URL
  const categoryName = decodeURIComponent(category);

  useEffect(() => {
    fetchCategoryProperties();
  }, [category]);

  useEffect(() => {
    const loadCitiesAreas = async () => {
      try {
        const citiesRes = await fetch('/api/public/cities', { cache: 'no-store' });
        if (citiesRes.ok) {
          const cities = await citiesRes.json();
          setCityOptions(cities);
          const mumbai = cities.find((c: { name: string }) => c.name?.toLowerCase() === 'mumbai');
          if (mumbai?.id) {
            setMumbaiCityId(mumbai.id);
            const areasRes = await fetch(`/api/public/areas?cityId=${encodeURIComponent(mumbai.id)}`, { cache: 'no-store' });
            if (areasRes.ok) {
              const areas = await areasRes.json();
              setAreaOptions(areas);
            }
          }
        }
      } catch {
        // ignore
      }
    };
    loadCitiesAreas();
  }, []);

  // Update filters from URL params when they change
  useEffect(() => {
    const urlArea = searchParams.get('area');
    if (urlArea) {
      setFilters(prev => {
        if (prev.area !== urlArea) {
          return { ...prev, area: urlArea };
        }
        return prev;
      });
    } else {
      setFilters(prev => {
        if (prev.area !== 'all') {
          return { ...prev, area: 'all' };
        }
        return prev;
      });
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSortProperties();
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [properties, filters, searchQuery]);

  useEffect(() => {
    setPendingArea(filters.area === 'all' ? 'all' : filters.area);
  }, [filters.area]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationMenuRef.current &&
        !locationMenuRef.current.contains(event.target as Node)
      ) {
        setIsLocationMenuOpen(false);
      }
    };

    if (isLocationMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationMenuOpen]);

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
        property.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (property.sublocation ? property.sublocation.toLowerCase().includes(searchQuery.toLowerCase()) : false)
      );
    }

    // Area filter
    if (filters.area !== 'all') {
      filtered = filtered.filter(property => 
        property.area.toLowerCase() === filters.area.toLowerCase()
      );
    }

    // Price filter
    if (filters.price !== 'all') {
      filtered = filtered.filter(property => {
        const price = property.price;
        switch (filters.price) {
          case 'under-10000':
            return price < 10000;
          case '10000-20000':
            return price >= 10000 && price < 20000;
          case '20000-30000':
            return price >= 20000 && price < 30000;
          case 'above-30000':
            return price >= 30000;
          default:
            return true;
        }
      });
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
      area: 'all',
      price: 'all'
    });
  };

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    setSearchInput(trimmed);
    setSearchQuery(trimmed);
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
      'coworking': 'Coworking-Space',
      'coworking-space': 'Coworking-Space',
      'managed': 'Managed Office Spaces',
      'managed-office': 'Managed Office Spaces',
      'virtualoffice': 'Virtual Offices',
      'virtual-office': 'Virtual Offices',
      'meetingroom': 'Meeting Rooms',
      'meeting-room': 'Meeting Rooms',
      'dedicateddesk': 'Dedicated Desks',
      'dedicated-desk': 'Dedicated Desks',
      'flexidesk': 'Flexi Desks',
      'flexi-desk': 'Flexi Desks',
      'day-pass': 'Day Pass/ Flexi Desk',
      'enterpriseoffices': 'Enterprise Offices',
      'enterprise-offices': 'Enterprise Offices'
    };
    return categoryMap[category.toLowerCase()] || category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  const categoryDisplayName = getCategoryDisplayName(categoryName);

  const quickFilterAreas = [{ key: 'all', label: 'All Areas' }].concat(
    areaOptions.map((a) => ({ key: a.name, label: a.name }))
  );

  const popularDropdownAreas = areaOptions.slice(0, 16).map(a => ({ key: a.name, label: a.name }));

  const handleApplyArea = () => {
    setFilters(prev => ({ ...prev, area: pendingArea || 'all' }));
    setIsLocationMenuOpen(false);
  };

  const handleResetArea = () => {
    setPendingArea('all');
    setFilters(prev => ({ ...prev, area: 'all' }));
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-gray-50`}>
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              <span className="text-gray-900">
                {categoryDisplayName} in Mumbai
              </span>
            </h1>
            <p className="text-black mt-2 text-sm sm:text-base">{currentCategoryInfo.description}</p>
          </div>

          {/* Quick Area Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              {quickFilterAreas.map(area => (
                <button
                  key={area.key}
                  onClick={() => setFilters(prev => ({ ...prev, area: area.key }))}
                  className={`px-5 py-3 rounded-full text-sm sm:text-base font-medium border transition-all duration-200 ${
                    filters.area === area.key
                      ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                      : 'bg-white text-black border-gray-300 hover:border-blue-400 hover:text-blue-500'
                  }`}
                >
                  {area.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Search Bar */}
            <div className="flex flex-1 w-full max-w-xl items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by property name or area..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-400 focus:border-transparent sm:text-sm"
              />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="px-7 sm:px-9 py-3 bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 transition-colors duration-200"
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3 sm:ml-auto">
              <div className="relative flex-1 sm:flex-none" ref={locationMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (filters.area === 'all') {
                      setPendingArea(popularDropdownAreas[0]?.key ?? 'all');
                    } else {
                      setPendingArea(filters.area);
                    }
                    setIsLocationMenuOpen(prev => !prev);
                  }}
                  className="flex items-center justify-between w-full px-4 sm:px-5 py-3 border border-gray-300 rounded-lg bg-white text-black text-sm sm:text-base font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <span>Popular Locations</span>
                  <svg
                    className={`h-4 w-4 ml-4 transform transition-transform duration-200 ${isLocationMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isLocationMenuOpen && (
                  <div className="absolute z-30 mt-3 w-72 sm:w-96 rounded-xl bg-white shadow-2xl border border-gray-100 p-4" onMouseDown={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {popularDropdownAreas.map(area => (
                        <button
                          key={area.key}
                          onClick={() => setPendingArea(area.key)}
                          className={`px-4 py-2.5 rounded-lg text-sm sm:text-base font-medium border transition-all duration-200 ${
                            pendingArea === area.key
                              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                              : 'bg-white text-black border-gray-300 hover:border-blue-400 hover:text-blue-500'
                          }`}
                        >
                          {area.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button
                        type="button"
                        onClick={handleResetArea}
                        className="text-sm font-medium text-black hover:text-black"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyArea}
                        className="px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <select
                value={filters.price}
                onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
                className="block w-full sm:w-48 px-4 py-3 border border-gray-300 rounded-lg bg-white text-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              >
                <option value="all">Select Price</option>
                <option value="under-10000">Less than ₹10,000</option>
                <option value="10000-20000">₹10,000 - ₹20,000</option>
                <option value="20000-30000">₹20,000 - ₹30,000</option>
                <option value="above-30000">More than ₹30,000</option>
              </select>
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
              <>
                {(() => {
                  const batches: any[] = [];
                  
                  const promoSection = (
                    <div className="my-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12">
                      <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          Find Your Perfect Office Solution
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                          {
                            title: 'Private Office',
                            description: 'Fully furnished Private offices for you and your growing team.',
                            image: '/images/co1.jpeg'
                          },
                          {
                            title: 'Managed Office',
                            description: 'Customised fully furnished office managed by professionals.',
                            image: '/images/co2.jpeg'
                          },
                          {
                            title: 'Enterprise Solution',
                            description: 'Fully equipped offices for larger teams with flexibility to scale & customise.',
                            image: '/images/co3.jpeg'
                          }
                        ].map((card) => (
                          <div key={card.title} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative h-48 overflow-hidden">
                              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                              <p className="text-black mb-4 leading-relaxed">{card.description}</p>
                              <button
                                onClick={handleEnquireClick}
                                className="w-full bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-500 transition-all duration-300"
                              >
                                Enquire Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );

                  const customSection = (
                    <div className="my-12 rounded-3xl bg-gradient-to-r from-blue-50 to-blue-100 p-10 md:p-14 flex flex-col lg:flex-row items-center gap-10">
                      <div className="flex-1 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                          Customized office solutions for your team
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base md:text-lg text-black font-medium">
                          {[
                            'Customized Office Spaces',
                            'Prime Locations',
                            'Free Guided Tours',
                            'Perfect for 50+ Team Size'
                          ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm">✔</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleEnquireClick}
                          className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 w-fit"
                        >
                          Enquire Now
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl">
                          <img
                            src="/images/customized-office.jpg"
                            alt="Customized office"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );

                  // Show first 30 properties without pagination
                  const first30Properties = filteredProperties.slice(0, initialPropertiesCount);
                  const remainingProperties = filteredProperties.slice(initialPropertiesCount);
                  
                  // Display first 30 properties with sections after every 8
                  if (first30Properties.length > 0) {
                    const itemsPerBatch = 8;
                    for (let i = 0; i < first30Properties.length; i += itemsPerBatch) {
                      const batch = first30Properties.slice(i, i + itemsPerBatch);
                      const batchNumber = Math.floor(i / itemsPerBatch);
                      
                      // Add properties batch
                      batches.push(
                        <div key={`batch-${batchNumber}`} className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-4'}>
                          {batch.map((property) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              onEnquireClick={handleEnquireClick}
                              hideCategory={true}
                            />
                          ))}
                        </div>
                      );
                      
                      // Add section after each batch (except if it's the last batch of first 30)
                      if (i + itemsPerBatch < first30Properties.length || first30Properties.length < itemsPerBatch) {
                        const isPromo = Math.floor(i / itemsPerBatch) % 2 === 0;
                        batches.push(
                          <div key={`section-${batchNumber}`}>
                            {isPromo ? promoSection : customSection}
                          </div>
                        );
                      }
                    }
                  }
                  
                  // Show remaining properties with pagination (after 30)
                  if (remainingProperties.length > 0) {
                    const totalPages = Math.ceil(remainingProperties.length / propertiesPerPage);
                    const startIndex = (currentPage - 1) * propertiesPerPage;
                    const endIndex = startIndex + propertiesPerPage;
                    const currentPageProperties = remainingProperties.slice(startIndex, endIndex);
                    
                    // Add paginated properties
                    batches.push(
                      <div key={`paginated-${currentPage}`} className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4' : 'space-y-4'}>
                        {currentPageProperties.map((property) => (
                          <PropertyCard
                            key={property.id}
                            property={property}
                            onEnquireClick={handleEnquireClick}
                            hideCategory={true}
                          />
                        ))}
                      </div>
                    );
                    
                    // Add pagination component
                    batches.push(
                      <div key="pagination" className="mt-12 flex items-center justify-center gap-2">
                        {(() => {
                          const getPageNumbers = () => {
                            const pages: (number | string)[] = [];
                            const maxVisible = 5;
                            
                            if (totalPages <= maxVisible) {
                              for (let i = 1; i <= totalPages; i++) {
                                pages.push(i);
                              }
                            } else {
                              if (currentPage <= 3) {
                                for (let i = 1; i <= 4; i++) {
                                  pages.push(i);
                                }
                                pages.push('...');
                                pages.push(totalPages);
                              } else if (currentPage >= totalPages - 2) {
                                pages.push(1);
                                pages.push('...');
                                for (let i = totalPages - 3; i <= totalPages; i++) {
                                  pages.push(i);
                                }
                              } else {
                                pages.push(1);
                                pages.push('...');
                                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                  pages.push(i);
                                }
                                pages.push('...');
                                pages.push(totalPages);
                              }
                            }
                            return pages;
                          };
                          
                          return (
                            <>
                              {/* Previous Button */}
                              <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                  currentPage === 1
                                    ? 'bg-gray-200 text-black cursor-not-allowed'
                                    : 'bg-blue-400 text-white hover:bg-blue-500'
                                }`}
                              >
                                Previous
                              </button>
                              
                              {/* Page Numbers */}
                              {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                  <span key={`ellipsis-${index}`} className="px-2 text-black">...</span>
                                ) : (
                                  <button
                                    key={page}
                                    onClick={() => setCurrentPage(page as number)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                      currentPage === page
                                        ? 'bg-blue-400 text-white'
                                        : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                )
                              ))}
                              
                              {/* Next Button */}
                              <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                  currentPage === totalPages
                                    ? 'bg-gray-200 text-black cursor-not-allowed'
                                    : 'bg-blue-400 text-white hover:bg-blue-500'
                                }`}
                              >
                                Next
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    );
                  }
                  
                  return batches;
                })()}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-black mb-8">
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
      <ShareRequirementsModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
