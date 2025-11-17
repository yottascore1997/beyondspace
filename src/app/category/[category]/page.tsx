'use client';

import { useState, useEffect, useRef } from 'react';
import { Poppins } from 'next/font/google';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import ShareRequirementsModal from '@/components/ShareRequirementsModal';
import GetOfferModal from '@/components/GetOfferModal';
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
  propertyTier?: string | null;
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
  area: string | string[]; // Support both single and multiple areas
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
  const initialAreaParam = searchParams.get('area');
  const initialArea = initialAreaParam 
    ? (initialAreaParam.includes(',') ? initialAreaParam.split(',').map(a => decodeURIComponent(a.trim())) : decodeURIComponent(initialAreaParam))
    : 'all';
  const [filters, setFilters] = useState<Filters>({
    sortBy: 'Popularity',
    area: initialArea,
    price: 'all'
  });
  const [isGridShaking, setIsGridShaking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGetOfferModalOpen, setIsGetOfferModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [pendingAreas, setPendingAreas] = useState<string[]>([]);
  const locationMenuRef = useRef<HTMLDivElement | null>(null);
  const priceSelectRef = useRef<HTMLSelectElement | null>(null);
  const propertiesPerPage = 8;
  const initialPropertiesCount = 30; // Show first 30 without pagination
  const [cityOptions, setCityOptions] = useState<{ id: string; name: string }[]>([]);
  const [areaOptions, setAreaOptions] = useState<{ id: string; name: string; cityId: string }[]>([]);
  const [mumbaiCityId, setMumbaiCityId] = useState<string>('');

  // Decode the category name from URL
  const categoryName = decodeURIComponent(category);

  useEffect(() => {
    fetchCategoryProperties();
  }, [category, searchQuery]);

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
    if (filters.area === 'all') {
      setPendingAreas([]);
    } else if (Array.isArray(filters.area)) {
      setPendingAreas(filters.area);
    } else {
      setPendingAreas([filters.area]);
    }
  }, [filters.area]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking inside location menu
      if (locationMenuRef.current?.contains(target)) {
        return;
      }
      
      // Don't close if clicking on price select dropdown
      if (priceSelectRef.current?.contains(target)) {
        return;
      }
      
      // Close location menu if clicking outside both
      if (isLocationMenuOpen) {
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
      // If search is active, fetch all properties (without category filter) so search can work on all data
      // Otherwise, fetch only category-filtered properties for better performance
      const url = searchQuery.trim() !== ''
        ? `/api/properties?city=Mumbai` // Fetch all properties when searching
        : `/api/properties?category=${encodeURIComponent(categoryName)}&city=Mumbai`; // Fetch category-filtered when not searching
      
      const response = await fetch(url);
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

    // Category filter - Apply when search is active (since we fetch all properties when searching)
    if (searchQuery.trim() !== '') {
      // Category mapping same as API route
      const categoryKeyMap: Record<string, string[]> = {
        coworking: ['privatecabin', 'dedicateddesk', 'flexidesk'],
        managed: ['managed'],
        dedicateddesk: ['privatecabin', 'dedicateddesk', 'flexidesk'],
        flexidesk: ['flexidesk', 'dedicateddesk'],
        daypass: ['daypass'],
        virtualoffice: ['virtualoffice'],
        meetingroom: ['meetingroom'],
        enterpriseoffices: ['enterpriseoffices'],
      };

      const normalizeCategoryKey = (value: string) => {
        const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        const mapping: Record<string, string> = {
          coworkingspace: 'coworking',
          coworkingspaces: 'coworking',
          managedoffice: 'managed',
          managedoffices: 'managed',
          dedicateddesk: 'dedicateddesk',
          flexidesk: 'flexidesk',
          virtualoffice: 'virtualoffice',
          meetingroom: 'meetingroom',
          daypass: 'daypass',
        };
        return mapping[cleaned] ?? cleaned;
      };

      const normalizedCategory = normalizeCategoryKey(categoryName);
      const relatedCategoryKeys = categoryKeyMap[normalizedCategory] || [normalizedCategory];

      filtered = filtered.filter(property => {
        const propertyCategories = Array.isArray(property.categories)
          ? property.categories.map((cat: string) => typeof cat === 'string' ? cat.toLowerCase() : String(cat).toLowerCase())
          : [];

        // Check if any property category matches any of the related category keys
        const hasCategoryMatch = relatedCategoryKeys.some(key => {
          const normalizedKey = key.toLowerCase();
          return propertyCategories.includes(normalizedKey);
        });

        // Also check property type as fallback
        const categoryTypeMap: Record<string, string[]> = {
          coworking: ['COWORKING'],
          dedicateddesk: ['COWORKING'],
          flexidesk: ['COWORKING'],
          daypass: ['COWORKING'],
          managed: ['MANAGED_OFFICE'],
          virtualoffice: ['COWORKING'],
          meetingroom: ['COMMERCIAL'],
          enterpriseoffices: ['MANAGED_OFFICE'],
        };
        const types = categoryTypeMap[normalizedCategory];
        const hasTypeMatch = types ? types.includes(property.type) : false;

        return hasCategoryMatch || hasTypeMatch;
      });
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (property.sublocation ? property.sublocation.toLowerCase().includes(searchQuery.toLowerCase()) : false)
      );
    }

    // Area filter - support both single area (string) and multiple areas (array)
    if (filters.area !== 'all') {
      if (Array.isArray(filters.area)) {
        // Multiple areas selected
        const areaArray = filters.area as string[];
        filtered = filtered.filter(property => 
          areaArray.some((area: string) => property.area.toLowerCase() === area.toLowerCase())
        );
      } else {
        // Single area (backward compatibility)
        const singleArea = filters.area as string;
        filtered = filtered.filter(property => 
          property.area.toLowerCase() === singleArea.toLowerCase()
        );
      }
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
    setIsGetOfferModalOpen(true);
    setTimeout(() => setIsGridShaking(false), 500); // Shake for 0.5 seconds
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeGetOfferModal = () => {
    setIsGetOfferModalOpen(false);
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
    if (pendingAreas.length === 0) {
      setFilters(prev => ({ ...prev, area: 'all' }));
    } else if (pendingAreas.length === 1) {
      setFilters(prev => ({ ...prev, area: pendingAreas[0] }));
    } else {
      setFilters(prev => ({ ...prev, area: pendingAreas }));
    }
    setIsLocationMenuOpen(false);
  };

  const handleResetArea = () => {
    setPendingAreas([]);
    setFilters(prev => ({ ...prev, area: 'all' }));
  };

  const handleToggleArea = (areaKey: string) => {
    setPendingAreas(prev => {
      if (prev.includes(areaKey)) {
        return prev.filter(a => a !== areaKey);
      } else {
        return [...prev, areaKey];
      }
    });
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-gray-50`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      <style jsx global>{`
        * {
          font-family: Poppins, sans-serif !important;
        }
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
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8" style={{ maxWidth: '1280px', width: '100%', paddingTop: '8px', paddingBottom: '8px' }}>
          <div className="mb-1.5 sm:mb-2">
            <h1 className={`${poppins.className} text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-0.5 tracking-tight`}>
              <span className="text-gray-800">
                {categoryDisplayName} in Mumbai
              </span>
            </h1>
          </div>

          {/* Quick Area Filters */}
          <div className="mb-1.5 sm:mb-2">
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {quickFilterAreas.map(area => {
                const isSelected = area.key === 'all' 
                  ? filters.area === 'all'
                  : Array.isArray(filters.area)
                    ? filters.area.includes(area.key)
                    : filters.area === area.key;
                
                return (
                  <button
                    key={area.key}
                    onClick={() => {
                      if (area.key === 'all') {
                        setFilters(prev => ({ ...prev, area: 'all' }));
                      } else {
                        // Toggle area in multi-select
                        setFilters(prev => {
                          if (prev.area === 'all') {
                            return { ...prev, area: [area.key] };
                          } else if (Array.isArray(prev.area)) {
                            if (prev.area.includes(area.key)) {
                              const newAreas = prev.area.filter(a => a !== area.key);
                              return { ...prev, area: newAreas.length === 0 ? 'all' : newAreas };
                            } else {
                              return { ...prev, area: [...prev.area, area.key] };
                            }
                          } else {
                            // Single area, convert to array
                            if (prev.area === area.key) {
                              return { ...prev, area: 'all' };
                            } else {
                              return { ...prev, area: [prev.area, area.key] };
                            }
                          }
                        });
                      }
                    }}
                    className={`${poppins.className} px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-medium border transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-500'
                    }`}
                  >
                    {area.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar and Filters */}
          <div className="mb-0 flex flex-col sm:flex-row gap-1.5 sm:gap-2 md:gap-3 sm:items-center">
            {/* Search Bar */}
            <div className="flex flex-1 w-full max-w-full sm:max-w-xl items-stretch sm:items-center gap-1.5 sm:gap-2">
              <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className={`${poppins.className} block w-full pl-6 sm:pl-7 md:pl-8 pr-2 sm:pr-2.5 py-1 sm:py-1.5 md:py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-400 text-[10px] sm:text-xs md:text-sm focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className={`${poppins.className} px-3 sm:px-3.5 md:px-4 py-1 sm:py-1.5 md:py-2 bg-blue-500 text-white text-[10px] sm:text-xs md:text-sm font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-1 transition-colors duration-200 whitespace-nowrap`}
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-auto">
              <div className="relative flex-1 sm:flex-none w-full sm:w-auto" ref={locationMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationMenuOpen(prev => !prev);
                  }}
                  className={`${poppins.className} flex items-center justify-between w-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-[10px] sm:text-xs md:text-sm font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                >
                  <span className="truncate">
                    Popular Locations
                    {pendingAreas.length > 0 && (
                      <span className="ml-1 sm:ml-2 text-blue-500 font-semibold">
                        ({pendingAreas.length})
                      </span>
                    )}
                  </span>
                  <svg
                    className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ml-2 sm:ml-4 flex-shrink-0 transform transition-transform duration-200 ${isLocationMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isLocationMenuOpen && (
                  <div className={`${poppins.className} absolute z-30 mt-2 left-0 right-0 sm:left-auto sm:right-auto w-full sm:w-64 md:w-72 lg:w-80 rounded-lg bg-white shadow-2xl border border-gray-100 p-2.5 sm:p-3`} onMouseDown={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2">
                      {popularDropdownAreas.map(area => {
                        const isSelected = pendingAreas.includes(area.key);
                        return (
                          <button
                            key={area.key}
                            type="button"
                            onClick={() => handleToggleArea(area.key)}
                            className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded text-[10px] sm:text-xs md:text-xs font-medium border transition-all duration-200 flex items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-500'
                            }`}
                          >
                            <svg
                              className={`w-3 h-3 sm:w-3 sm:h-3 ${isSelected ? 'text-white' : 'text-gray-400'}`}
                              fill={isSelected ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {isSelected ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              )}
                            </svg>
                            <span className="truncate">{area.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-3 sm:mt-2.5">
                      <button
                        type="button"
                        onClick={handleResetArea}
                        className="text-xs sm:text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyArea}
                        className="px-3 sm:px-3.5 py-1.5 sm:py-1 bg-blue-500 text-white text-xs sm:text-xs md:text-sm font-medium rounded-lg shadow-sm hover:bg-blue-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <select
                ref={priceSelectRef}
                value={filters.price}
                onChange={(e) => setFilters(prev => ({ ...prev, price: e.target.value }))}
                className={`${poppins.className} block w-full sm:w-36 md:w-40 lg:w-44 px-2.5 sm:px-3 md:px-3.5 py-1 sm:py-1.5 md:py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-[10px] sm:text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent`}
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
      <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8" style={{ maxWidth: '1280px', width: '100%', paddingTop: '12px', paddingBottom: '20px' }}>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Properties List */}
          <div className="flex-1">
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
                    <div className="my-8 sm:my-10 md:my-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12">
                      <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                          Find Your Perfect Office Solution
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
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
                          <div key={card.title} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 sm:p-5 md:p-6">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{card.title}</h3>
                              <p className="text-sm sm:text-base text-black mb-3 sm:mb-4 leading-relaxed">{card.description}</p>
                              <button
                                onClick={handleEnquireClick}
                                className="w-full bg-blue-400 text-white py-2 sm:py-2.5 md:py-3 px-4 sm:px-5 md:px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-500 transition-all duration-300"
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
                    <div className="my-8 sm:my-10 md:my-12 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-50 to-blue-100 p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-10">
                      <div className="flex-1 space-y-4 sm:space-y-5 md:space-y-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                          Customized office solutions for your team
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base md:text-lg text-black font-medium">
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
                          className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold px-5 sm:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg shadow-md transition-all duration-200 w-full sm:w-fit"
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
                        <div key={`batch-${batchNumber}`} className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-4' : 'space-y-3 sm:space-y-4'}>
                          {batch.map((property) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              onEnquireClick={handleEnquireClick}
                              hideCategory={true}
                              category={categoryName}
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
                      <div key={`paginated-${currentPage}`} className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-4' : 'space-y-3 sm:space-y-4'}>
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
                      <div key="pagination" className="mt-8 sm:mt-10 md:mt-12 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
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
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
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
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
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
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
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
              <div className="text-center py-10 sm:py-12 md:py-16 bg-white rounded-lg px-4">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🏠</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-sm sm:text-base text-black mb-6 sm:mb-8">
                  No properties match your current filters. Try adjusting your search criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-orange-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-900 transition-colors"
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
      <GetOfferModal isOpen={isGetOfferModalOpen} onClose={closeGetOfferModal} />
    </div>
  );
}
