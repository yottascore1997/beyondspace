'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Poppins } from 'next/font/google';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import ShareRequirementsModal from '@/components/ShareRequirementsModal';
import Link from 'next/link';
import { getCachedProperties } from '@/lib/categoryPrefetch';

interface SeatingPlan {
  id: string;
  title: string;
  description: string;
  price: string;
  seating: string;
}

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
  propertyOptions?: SeatingPlan[] | null;
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
  category: string | string[]; // Support both single and multiple categories
}

interface PrimeLocation {
  name: string;
  slug: string;
  image: string;
}

const primeLocations: PrimeLocation[] = [
  { name: 'Thane West', slug: 'thane west', image: '/images/mumbai7.jpg' },
  { name: 'Navi Mumbai', slug: 'navi mumbai', image: '/images/mumbai8.PNG' },
  { name: 'Andheri West', slug: 'andheri west', image: '/images/mumbai4.jpeg' },
  { name: 'Andheri East', slug: 'andheri east', image: '/images/mumbai4.jpeg' },
  { name: 'Goregaon East', slug: 'goregaon east', image: '/images/mumbai4.jpeg' },
  { name: 'Bandra East (BKC)', slug: 'bkc', image: '/images/mumbai3.png' },
  { name: 'Lower Parel West', slug: 'lower parel west', image: '/images/mumbai5.jpg' },
  { name: 'Powai', slug: 'powai', image: '/images/mumbai8.PNG' }
];

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = params.category as string;
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('grid');
  
  // Initialize filters from URL params if available
  const initialCityParam = searchParams.get('city');
  // Handle double encoding - try decoding twice if needed
  let initialCity = 'all';
  if (initialCityParam) {
    try {
      // First decode
      let decoded = decodeURIComponent(initialCityParam);
      // Check if still encoded (contains %)
      if (decoded.includes('%')) {
        // Try decoding again
        decoded = decodeURIComponent(decoded);
      }
      initialCity = decoded;
    } catch (e) {
      // If decoding fails, use as is
      initialCity = initialCityParam;
    }
  }
  
  const initialAreaParam = searchParams.get('area');
  const initialArea = initialAreaParam 
    ? (initialAreaParam.includes(',') 
        ? initialAreaParam.split(',').map(a => {
            // Handle double encoding - decode multiple times if needed
            let decoded = a.trim();
            try {
              // Try decoding up to 3 times to handle double/triple encoding
              for (let i = 0; i < 3; i++) {
                const prevDecoded = decoded;
                decoded = decodeURIComponent(decoded);
                if (prevDecoded === decoded) break; // No more decoding needed
              }
            } catch (e) {
              // If decoding fails, use original
              decoded = a.trim();
            }
            return decoded;
          })
        : (() => {
            // Handle double encoding for single area
            let decoded = initialAreaParam;
            try {
              // Try decoding up to 3 times to handle double/triple encoding
              for (let i = 0; i < 3; i++) {
                const prevDecoded = decoded;
                decoded = decodeURIComponent(decoded);
                if (prevDecoded === decoded) break; // No more decoding needed
              }
            } catch (e) {
              // If decoding fails, use original
              decoded = initialAreaParam;
            }
            return decoded;
          })())
    : 'all';
  const initialCategoryParam = searchParams.get('subcategory');
  const initialCategory = initialCategoryParam 
    ? (initialCategoryParam.includes(',') ? initialCategoryParam.split(',').map(c => decodeURIComponent(c.trim())) : decodeURIComponent(initialCategoryParam))
    : 'all';
  
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [filters, setFilters] = useState<Filters>({
    sortBy: 'Popularity',
    area: initialArea,
    price: 'all',
    category: initialCategory
  });
  const [isGridShaking, setIsGridShaking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterestedModalOpen, setIsInterestedModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize currentPage from URL query param
  const initialPage = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [pendingAreas, setPendingAreas] = useState<string[]>([]);
  const locationMenuRef = useRef<HTMLDivElement | null>(null);
  const priceSelectRef = useRef<HTMLSelectElement | null>(null);
  const propertiesPerPage = 8; // For page 1 batches
  const propertiesPerPageAfterFirst = 20; // For page 2+ pagination
  const initialPropertiesCount = 32; // Show first 32 without pagination
  const [cityOptions, setCityOptions] = useState<{ id: string; name: string }[]>([]);
  const [areaOptions, setAreaOptions] = useState<{ id: string; name: string; cityId: string }[]>([]);
  const [mumbaiCityId, setMumbaiCityId] = useState<string>('');

  // Decode the category name from URL
  const categoryName = decodeURIComponent(category);

  useEffect(() => {
    fetchCategoryProperties();
  }, [category, searchQuery, categoryName, selectedCity]);

  // Auto-search: Update searchQuery when searchInput changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesRes = await fetch('/api/public/cities', { cache: 'no-store' });
        if (citiesRes.ok) {
          const cities = await citiesRes.json();
          setCityOptions(cities);
        }
      } catch {
        // ignore
      }
    };
    loadCities();
  }, []);

  // Load areas based on selected city
  useEffect(() => {
    const loadAreasForCity = async () => {
      try {
        // Find city by name (case-insensitive)
        const cityToLoad = selectedCity && selectedCity !== 'all' 
          ? selectedCity 
          : 'Mumbai'; // Default to Mumbai if no city selected
        
        const city = cityOptions.find((c: { name: string }) => 
          c.name?.toLowerCase() === cityToLoad.toLowerCase()
        );
        
        if (city?.id) {
          const areasRes = await fetch(`/api/public/areas?cityId=${encodeURIComponent(city.id)}`, { cache: 'no-store' });
          if (areasRes.ok) {
            const areas = await areasRes.json();
            setAreaOptions(areas);
          }
        } else if (cityOptions.length > 0) {
          // If city not found but cities are loaded, try to find Mumbai as fallback
          const mumbai = cityOptions.find((c: { name: string }) => c.name?.toLowerCase() === 'mumbai');
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
    
    // Only load areas if cities are loaded
    if (cityOptions.length > 0) {
      loadAreasForCity();
    }
  }, [selectedCity, cityOptions]);

  // Update filters from URL params when they change
  useEffect(() => {
    const urlCity = searchParams.get('city');
    const urlArea = searchParams.get('area');
    
    // Handle city with double encoding
    if (urlCity) {
      try {
        let decoded = decodeURIComponent(urlCity);
        // Check if still encoded (contains %)
        if (decoded.includes('%')) {
          // Try decoding again
          decoded = decodeURIComponent(decoded);
        }
        setSelectedCity(decoded);
      } catch (e) {
        // If decoding fails, use as is
        setSelectedCity(urlCity);
      }
    } else {
      setSelectedCity('all');
    }
    
    // Handle area
    if (urlArea) {
      const decodedArea = urlArea.includes(',') 
        ? urlArea.split(',').map(a => {
            try {
              let decoded = decodeURIComponent(a.trim());
              if (decoded.includes('%')) {
                decoded = decodeURIComponent(decoded);
              }
              return decoded;
            } catch (e) {
              return a.trim();
            }
          })
        : (() => {
            try {
              let decoded = decodeURIComponent(urlArea);
              if (decoded.includes('%')) {
                decoded = decodeURIComponent(decoded);
              }
              return decoded;
            } catch (e) {
              return urlArea;
            }
          })();
      setFilters(prev => {
        if (JSON.stringify(prev.area) !== JSON.stringify(decodedArea)) {
          return { ...prev, area: decodedArea };
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

  // Function to update URL with page number
  const updatePageInURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    // Maintain category path in URL
    const categoryPath = `/category/${encodeURIComponent(category)}`;
    router.push(`${categoryPath}?${params.toString()}`, { scroll: false });
  };

  // Sync currentPage with URL when URL changes (only when URL changes, not when currentPage changes)
  useEffect(() => {
    const urlPage = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    setCurrentPage(urlPage);
  }, [searchParams]);

  // Filter and sort properties whenever they or filters/search change
  useEffect(() => {
    // Only filter if properties are loaded
    if (properties.length > 0 || filteredProperties.length > 0) {
      filterAndSortProperties();
    }
  }, [properties, filters, searchQuery, categoryName]);

  // Reset to page 1 only when filters or search query actually change (not when properties load or page changes)
  const prevFiltersRef = useRef<string>(JSON.stringify(filters));
  const prevSearchQueryRef = useRef<string>(searchQuery);
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevFiltersRef.current = JSON.stringify(filters);
      prevSearchQueryRef.current = searchQuery;
      return;
    }
    
    const filtersChanged = prevFiltersRef.current !== JSON.stringify(filters);
    const searchChanged = prevSearchQueryRef.current !== searchQuery;
    
    // Only reset page if filters or search actually changed (not on page navigation)
    if (filtersChanged || searchChanged) {
      setCurrentPage(1);
      updatePageInURL(1);
      prevFiltersRef.current = JSON.stringify(filters);
      prevSearchQueryRef.current = searchQuery;
    }
  }, [filters, searchQuery]);

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
      const cityToUse = selectedCity && selectedCity !== 'all' ? selectedCity : 'Mumbai';
      
      // Check cache first - instant load if prefetched (e.g. on hover)
      if (searchQuery.trim() === '') {
        const cached = getCachedProperties(categoryName, cityToUse);
        if (cached && Array.isArray(cached)) {
          setProperties(cached as Property[]);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      // Build query params
      const queryParams = new URLSearchParams();
      
      // Add category filter if not searching
      if (searchQuery.trim() === '') {
        queryParams.set('category', categoryName);
      }
      
      queryParams.set('city', cityToUse);
      
      const url = `/api/properties?${queryParams.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract numeric price from price string
  const extractNumericPrice = (priceStr: string): number | null => {
    if (!priceStr || priceStr.trim() === '') return null;
    // Remove currency symbols, commas, and spaces, then parse
    const numericPrice = parseFloat(priceStr.replace(/[₹,\s]/g, ''));
    return isNaN(numericPrice) ? null : numericPrice;
  };

  // Get the relevant price from seating plans based on current category
  const getPropertyPriceForCategory = (property: Property): number | null => {
    // If no propertyOptions, fallback to property.price
    if (!property.propertyOptions || !Array.isArray(property.propertyOptions) || property.propertyOptions.length === 0) {
      return property.price || null;
    }

    const normalizedCategory = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const categoryLower = categoryName.toLowerCase();

    // Helper to find plan by title
    const findPlanByTitle = (titleKeywords: string[]) => {
      return property.propertyOptions!.find((plan: SeatingPlan) => {
        if (!plan || !plan.title) return false;
        const titleLower = plan.title.toLowerCase().trim();
        return titleKeywords.some(keyword => titleLower.includes(keyword));
      });
    };

    // Virtual Office category page
    if (normalizedCategory === 'virtualoffice' || categoryLower === 'virtual-office' || categoryLower.includes('virtual-office')) {
      const plan = findPlanByTitle(['virtual office', 'virtualoffice']);
      if (plan && plan.price) {
        const price = extractNumericPrice(plan.price);
        if (price !== null && price > 0) return price;
      }
      return null;
    }

    // Meeting Room category page
    if (normalizedCategory === 'meetingroom' || categoryLower === 'meeting-room' || categoryLower.includes('meeting-room')) {
      const meetingRoomPlans = property.propertyOptions!.filter((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('meeting room')
      );
      if (meetingRoomPlans.length > 0) {
        // Try 04 Seater first
        const fourSeater = meetingRoomPlans.find(plan => 
          plan.seating && (plan.seating.toLowerCase().includes('04') || plan.seating.toLowerCase().includes('4 seater'))
        );
        if (fourSeater && fourSeater.price) {
          const price = extractNumericPrice(fourSeater.price);
          if (price !== null && price > 0) return price;
        }
        // Get lowest price
        const prices = meetingRoomPlans
          .map(plan => extractNumericPrice(plan.price))
          .filter((p): p is number => p !== null && p > 0)
          .sort((a, b) => a - b);
        if (prices.length > 0) return prices[0];
      }
      return null;
    }

    // Day Pass category page
    if (normalizedCategory === 'daypass' || categoryLower === 'day-pass' || categoryLower.includes('day-pass')) {
      const plan = findPlanByTitle(['day pass', 'daypass']);
      if (plan && plan.price) {
        const price = extractNumericPrice(plan.price);
        if (price !== null && price > 0) return price;
      }
      return null;
    }

    // Flexi Desk category page
    if (normalizedCategory === 'flexidesk' || categoryLower === 'flexi-desk' || categoryLower.includes('flexi-desk')) {
      const plan = findPlanByTitle(['flexi desk', 'flexidesk']);
      if (plan && plan.price) {
        const price = extractNumericPrice(plan.price);
        if (price !== null && price > 0) return price;
      }
      return null;
    }

    // Coworking category page - Dedicated Desk first, then Private Cabin
    if (normalizedCategory === 'coworking' || normalizedCategory === 'coworkingspace' || categoryLower === 'coworking-space' || categoryLower.includes('coworking')) {
      const dedicatedDesk = findPlanByTitle(['dedicated desk']);
      if (dedicatedDesk && dedicatedDesk.price) {
        const price = extractNumericPrice(dedicatedDesk.price);
        if (price !== null && price > 0) return price;
      }
      const privateCabin = findPlanByTitle(['private cabin']);
      if (privateCabin && privateCabin.price) {
        const price = extractNumericPrice(privateCabin.price);
        if (price !== null && price > 0) return price;
      }
      return null;
    }

    // Dedicated Desk category page
    if (normalizedCategory === 'dedicateddesk' || categoryLower === 'dedicated-desk' || categoryLower.includes('dedicated-desk')) {
      const plan = findPlanByTitle(['dedicated desk']);
      if (plan && plan.price) {
        const price = extractNumericPrice(plan.price);
        if (price !== null && price > 0) return price;
      }
      return null;
    }

    // Private Cabin category page
    if (normalizedCategory === 'privatecabin' || categoryLower === 'private-cabin' || categoryLower.includes('private-cabin')) {
      const plan = findPlanByTitle(['private cabin']);
      if (plan && plan.price) {
        const price = extractNumericPrice(plan.price);
        if (price !== null && price > 0) return price;
      }
      return null;
    }

    // Managed Office category page
    if (normalizedCategory === 'managed' || normalizedCategory === 'managedoffice' || categoryLower === 'managed-office' || categoryLower.includes('managed-office')) {
      const plan = findPlanByTitle(['managed office']);
      if (plan && plan.price) {
        const price = extractNumericPrice(plan.price);
        if (price !== null && price > 0) return price;
      }
      // Fallback to property.price for managed office
      return property.price || null;
    }

    // Default: fallback to property.price
    return property.price || null;
  };

  const filterAndSortProperties = () => {
    let filtered = [...properties];

    // Category filter - Always apply category filtering based on current category page
    // This ensures that even if API returns all properties, we filter by category on client side
    const applyCategoryFilter = () => {
      // Category mapping same as API route
      const categoryKeyMap: Record<string, string[]> = {
        coworking: ['privatecabin', 'dedicateddesk', 'flexidesk', 'virtualoffice'],
        managed: ['managed'],
        dedicateddesk: ['dedicateddesk'],
        privatecabin: ['privatecabin'],
        flexidesk: ['flexidesk', 'dedicateddesk'],
        daypass: ['daypass', 'flexidesk'],
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

      const normalizeToken = (val: unknown) =>
        String(val ?? '')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]/g, '');
      
      // Debug: Log category filtering (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('[Category Filter] Category Name:', categoryName);
        console.log('[Category Filter] Normalized Category:', normalizedCategory);
        console.log('[Category Filter] Related Category Keys:', relatedCategoryKeys);
        console.log('[Category Filter] Properties before filter:', filtered.length);
      }

      filtered = filtered.filter(property => {
        const propertyCategories = Array.isArray(property.categories)
          ? property.categories.map((cat: string) => normalizeToken(cat))
          : [];

        // Check if any property category matches any of the related category keys (exact match only)
        const hasCategoryMatch = relatedCategoryKeys.some(key => {
          const normalizedKey = normalizeToken(key);
          // Exact match on normalized tokens (handles day-pass vs daypass, flexi-desk vs flexidesk, etc.)
          return propertyCategories.some(cat => cat === normalizedKey);
        });

        // For Managed Office Space, only show if it has exact 'managed' category (strict filtering)
        if (normalizedCategory === 'managed') {
          // Double check: must have exact 'managed' category, not partial matches like "year", "seat", "day"
          const hasExactManaged = propertyCategories.some(cat => {
            return cat === 'managed';
          });
          // Debug log for managed category
          if (process.env.NODE_ENV === 'development' && !hasExactManaged) {
            console.log('[Category Filter] Property does not have managed category:', property.title, 'Categories:', propertyCategories);
          }
          return hasExactManaged; // Strict: only return true if exact 'managed' category exists
        }

        // For Dedicated Desk, only show if it has 'dedicateddesk' or 'privatecabin' category (strict filtering)
        if (normalizedCategory === 'dedicateddesk') {
          return hasCategoryMatch; // Don't use type fallback for dedicated category
        }

        // For Private Cabin, only show if it has 'privatecabin' category (strict filtering)
        if (normalizedCategory === 'privatecabin') {
          return hasCategoryMatch; // Don't use type fallback for private cabin category
        }

        // For Virtual Office, only show if it has 'virtualoffice' category (strict filtering)
        if (normalizedCategory === 'virtualoffice') {
          return hasCategoryMatch; // Don't use type fallback for virtual office category
        }

        // For Meeting Room, only show if it has 'meetingroom' category (strict filtering)
        if (normalizedCategory === 'meetingroom') {
          return hasCategoryMatch; // Don't use type fallback for meeting room category
        }

        // For Day Pass, only show if it has 'daypass' or 'flexidesk' category (strict filtering)
        if (normalizedCategory === 'daypass') {
          return hasCategoryMatch; // Don't use type fallback for day pass category
        }

        // Also check property type as fallback for other categories
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
      
      // Debug: Log filtered count (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('[Category Filter] Properties after filter:', filtered.length);
      }
    };

    // Always apply category filter to ensure only current category properties are shown
    // This ensures that even on page 2+, only current category properties are shown
    // Apply filter regardless of properties length to ensure filtering works
    applyCategoryFilter();

    // Filter out properties that don't have pricing for the current category
    filtered = filtered.filter(property => {
      const price = getPropertyPriceForCategory(property);
      return price !== null && price > 0;
    });

    // Search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (property.sublocation ? property.sublocation.toLowerCase().includes(searchQuery.toLowerCase()) : false)
      );
    }

    // City filter - filter by city if selected
    if (selectedCity && selectedCity !== 'all') {
      filtered = filtered.filter(property => {
        const propertyCity = property.city?.toLowerCase().trim();
        const filterCity = selectedCity.toLowerCase().trim();
        return propertyCity === filterCity;
      });
    }
    
    // Area filter - support both single area (string) and multiple areas (array)
    if (filters.area !== 'all') {
      if (Array.isArray(filters.area)) {
        // Multiple areas selected
        const areaArray = filters.area as string[];
        filtered = filtered.filter(property => 
          areaArray.some((area: string) => {
            const areaLower = area.toLowerCase().trim();
            // Special handling for Navi Mumbai - check both area and city
            if (areaLower === 'navi mumbai') {
              return property.area?.toLowerCase().trim() === areaLower || 
                     property.city?.toLowerCase().trim() === areaLower;
            }
            return property.area?.toLowerCase().trim() === areaLower;
          })
        );
      } else {
        // Single area (backward compatibility)
        const singleArea = filters.area as string;
        const areaLower = singleArea.toLowerCase().trim();
        filtered = filtered.filter(property => {
          // Special handling for Navi Mumbai - check both area and city fields
          if (areaLower === 'navi mumbai') {
            return property.area?.toLowerCase().trim() === areaLower || 
                   property.city?.toLowerCase().trim() === areaLower;
          }
          return property.area?.toLowerCase().trim() === areaLower;
        });
      }
    }

    // Category filter - filter by sub-categories
    if (filters.category !== 'all') {
      if (Array.isArray(filters.category)) {
        // Multiple categories selected
        const categoryArray = filters.category as string[];
        filtered = filtered.filter(property => {
          const propertyCategories = Array.isArray(property.categories)
            ? property.categories.map((cat: string) => typeof cat === 'string' ? cat.toLowerCase() : String(cat).toLowerCase())
            : [];
          return categoryArray.some((cat: string) => propertyCategories.includes(cat.toLowerCase()));
        });
      } else {
        // Single category (backward compatibility)
        const singleCategory = filters.category as string;
        filtered = filtered.filter(property => {
          const propertyCategories = Array.isArray(property.categories)
            ? property.categories.map((cat: string) => typeof cat === 'string' ? cat.toLowerCase() : String(cat).toLowerCase())
            : [];
          return propertyCategories.includes(singleCategory.toLowerCase());
        });
      }
    }

    // Price filter - use price from seating plans based on category
    if (filters.price !== 'all') {
      filtered = filtered.filter(property => {
        const price = getPropertyPriceForCategory(property);
        // If no price found, exclude the property from results
        if (price === null) return false;
        
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


    // Sort properties - use price from seating plans for sorting
    if (filters.sortBy === 'Price: Low to High') {
      filtered.sort((a, b) => {
        const priceA = getPropertyPriceForCategory(a) || 0;
        const priceB = getPropertyPriceForCategory(b) || 0;
        return priceA - priceB;
      });
    } else if (filters.sortBy === 'Price: High to Low') {
      filtered.sort((a, b) => {
        const priceA = getPropertyPriceForCategory(a) || 0;
        const priceB = getPropertyPriceForCategory(b) || 0;
        return priceB - priceA;
      });
    } else if (filters.sortBy === 'Rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // Show all filtered properties (first 32 without pagination, rest with pagination)
    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({
      sortBy: 'Popularity',
      area: 'all',
      price: 'all',
      category: 'all'
    });
  };

  const handleSearch = () => {
    const trimmed = searchInput.trim();
    setSearchInput(trimmed);
    setSearchQuery(trimmed);
  };

  const handleEnquireClick = () => {
    setIsGridShaking(true);
    setIsInterestedModalOpen(true);
    setTimeout(() => setIsGridShaking(false), 500); // Shake for 0.5 seconds
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeInterestedModal = () => {
    setIsInterestedModalOpen(false);
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
    let newArea: string | string[] = 'all';
    if (pendingAreas.length === 0) {
      newArea = 'all';
      setFilters(prev => ({ ...prev, area: 'all' }));
    } else if (pendingAreas.length === 1) {
      newArea = pendingAreas[0];
      setFilters(prev => ({ ...prev, area: pendingAreas[0] }));
    } else {
      newArea = pendingAreas;
      setFilters(prev => ({ ...prev, area: pendingAreas }));
    }
    
    // Update URL with area filter - create fresh params to avoid double encoding
    const params = new URLSearchParams();
    
    // Preserve all existing params except area and page
    searchParams.forEach((value, key) => {
      if (key !== 'area' && key !== 'page') {
        params.set(key, value);
      }
    });
    
    // Set area parameter (URLSearchParams handles encoding automatically)
    if (newArea === 'all') {
      params.delete('area');
    } else if (Array.isArray(newArea)) {
      params.set('area', newArea.join(','));
    } else {
      params.set('area', newArea);
    }
    
    // Maintain city in URL
    if (selectedCity && selectedCity !== 'all') {
      params.set('city', selectedCity);
    }
    
    // Reset to page 1 when area changes
    params.delete('page');
    const categoryPath = `/category/${encodeURIComponent(category)}`;
    router.push(`${categoryPath}?${params.toString()}`, { scroll: false });
    
    setIsLocationMenuOpen(false);
  };

  const handleResetArea = () => {
    setPendingAreas([]);
    setFilters(prev => ({ ...prev, area: 'all' }));
    
    // Update URL - remove area filter - create fresh params to avoid double encoding
    const params = new URLSearchParams();
    
    // Preserve all existing params except area and page
    searchParams.forEach((value, key) => {
      if (key !== 'area' && key !== 'page') {
        params.set(key, value);
      }
    });
    
    // Remove area
    params.delete('area');
    
    // Maintain city in URL
    if (selectedCity && selectedCity !== 'all') {
      params.set('city', selectedCity);
    }
    
    // Reset to page 1
    params.delete('page');
    const categoryPath = `/category/${encodeURIComponent(category)}`;
    router.push(`${categoryPath}?${params.toString()}`, { scroll: false });
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

  // Category filter handlers - show sub-categories based on main category
  const getAvailableCategories = () => {
    const normalizedCategory = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (normalizedCategory.includes('coworking')) {
      return [
        { key: 'dedicateddesk', label: 'Dedicated Desk' },
        { key: 'privatecabin', label: 'Private Cabin' },
        { key: 'flexidesk', label: 'Flexi Desk' },
        { key: 'virtualoffice', label: 'Virtual Office' }
      ];
    } else if (normalizedCategory.includes('dedicateddesk')) {
      return [
        { key: 'dedicateddesk', label: 'Dedicated Desk' },
        { key: 'privatecabin', label: 'Private Cabin' }
      ];
    } else if (normalizedCategory.includes('daypass')) {
      return [
        { key: 'daypass', label: 'Day Pass' },
        { key: 'flexidesk', label: 'Flexi Desk' }
      ];
    } else if (normalizedCategory.includes('flexidesk')) {
      return [
        { key: 'flexidesk', label: 'Flexi Desk' },
        { key: 'dedicateddesk', label: 'Dedicated Desk' }
      ];
    } else if (normalizedCategory.includes('privatecabin')) {
      return [
        { key: 'privatecabin', label: 'Private Cabin' }
      ];
    } else if (normalizedCategory.includes('virtualoffice')) {
      return [
        { key: 'virtualoffice', label: 'Virtual Office' }
      ];
    } else if (normalizedCategory.includes('meetingroom')) {
      return [
        { key: 'meetingroom', label: 'Meeting Room' }
      ];
    } else if (normalizedCategory.includes('managed')) {
      return [
        { key: 'managed', label: 'Managed Office Space' }
      ];
    } else if (normalizedCategory.includes('enterprise')) {
      return [
        { key: 'enterpriseoffices', label: 'Enterprise Offices' }
      ];
    }
    
    return [];
  };

  const availableCategories = getAvailableCategories();

  const handleToggleCategory = (categoryKey: string) => {
    // Directly apply category filter (like area filter)
    setFilters(prev => {
      if (prev.category === 'all') {
        return { ...prev, category: [categoryKey] };
      } else if (Array.isArray(prev.category)) {
        if (prev.category.includes(categoryKey)) {
          const newCategories = prev.category.filter(c => c !== categoryKey);
          return { ...prev, category: newCategories.length === 0 ? 'all' : newCategories };
        } else {
          return { ...prev, category: [...prev.category, categoryKey] };
        }
      } else {
        // Single category, convert to array
        if (prev.category === categoryKey) {
          return { ...prev, category: 'all' };
        } else {
          return { ...prev, category: [prev.category, categoryKey] };
        }
      }
    });
  };

  return (
    <div className={`${poppins.className} min-h-screen bg-gray-50 relative`} style={{ fontFamily: 'Poppins, sans-serif', overflow: 'visible' }}>
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
      <div className="h-16 sm:h-20 md:h-24"></div>
      

      {/* Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12" style={{ maxWidth: '1920px', width: '100%', paddingTop: '8px', paddingBottom: '8px' }}>
          <div className="mb-1.5 sm:mb-2">
            <h1 className={`${poppins.className} text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-black mb-0.5 tracking-tight`}>
              <span className="text-black">
                {categoryDisplayName} in {selectedCity && selectedCity !== 'all' ? selectedCity : 'Mumbai'}
              </span>
            </h1>
          </div>

          {/* Main Category Navigation - Opens in new tab */}
          <div className="mb-2 sm:mb-3">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-3.5 sm:p-4 border border-blue-100 shadow-md">
              <h3 className={`${poppins.className} text-sm sm:text-base md:text-lg font-semibold text-black mb-2.5 sm:mb-3 flex items-center gap-2`}>
                <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Browse Categories
              </h3>
              <div className="flex flex-nowrap gap-2.5 sm:gap-3 md:gap-3.5 overflow-x-auto">
                {[
                  { key: 'coworking-space', label: 'Coworking' },
                  { key: 'dedicated-desk', label: 'Dedicated Desk' },
                  { key: 'private-cabin', label: 'Private Cabin' },
                  { key: 'meeting-room', label: 'Meeting Room' },
                  { key: 'managed-office', label: 'Managed Office' },
                  { key: 'day-pass', label: 'Day Pass' }
                ].map(cat => {
                  // Normalize category names for comparison
                  const normalizeCategory = (catName: string) => {
                    const cleaned = catName.toLowerCase().replace(/[^a-z0-9]/g, '');
                    // Map common variations
                    const mapping: Record<string, string> = {
                      'managed': 'managedoffice',
                      'managedoffice': 'managedoffice',
                      'coworking': 'coworkingspace',
                      'coworkingspace': 'coworkingspace',
                      'dedicateddesk': 'dedicateddesk',
                      'dedicateddesks': 'dedicateddesk',
                      'privatecabin': 'privatecabin',
                      'privatecabins': 'privatecabin',
                      'virtualoffice': 'virtualoffice',
                      'virtualoffices': 'virtualoffice',
                      'meetingroom': 'meetingroom',
                      'meetingrooms': 'meetingroom',
                      'daypass': 'daypass',
                      'daypasses': 'daypass',
                      'flexidesk': 'flexidesk',
                      'flexidesks': 'flexidesk',
                    };
                    return mapping[cleaned] || cleaned;
                  };
                  
                  const currentCategoryNormalized = normalizeCategory(categoryName);
                  const catKeyNormalized = normalizeCategory(cat.key);
                  const isCurrentCategory = currentCategoryNormalized === catKeyNormalized;
                  
                  return (
                    <a
                      key={cat.key}
                      href={`/category/${cat.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${poppins.className} group relative flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex-shrink-0 ${
                        isCurrentCategory
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Label */}
                      <span className={`text-xs sm:text-sm md:text-base font-semibold transition-colors duration-200 whitespace-nowrap ${
                        isCurrentCategory
                          ? 'text-white'
                          : 'text-black group-hover:text-blue-600'
                      }`}>
                        {cat.label}
                      </span>
                      {/* External link icon */}
                      <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 transform group-hover:translate-x-0.5 transition-all duration-200 ${
                        isCurrentCategory
                          ? 'text-white opacity-100'
                          : 'text-black group-hover:text-blue-500 opacity-0 group-hover:opacity-100'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>
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
                      let newArea: string | string[] = 'all';
                      if (area.key === 'all') {
                        newArea = 'all';
                        setFilters(prev => ({ ...prev, area: 'all' }));
                      } else {
                        // Toggle area in multi-select
                        setFilters(prev => {
                          if (prev.area === 'all') {
                            newArea = [area.key];
                            return { ...prev, area: [area.key] };
                          } else if (Array.isArray(prev.area)) {
                            if (prev.area.includes(area.key)) {
                              const newAreas = prev.area.filter(a => a !== area.key);
                              newArea = newAreas.length === 0 ? 'all' : newAreas;
                              return { ...prev, area: newAreas.length === 0 ? 'all' : newAreas };
                            } else {
                              newArea = [...prev.area, area.key];
                              return { ...prev, area: [...prev.area, area.key] };
                            }
                          } else {
                            // Single area, convert to array
                            if (prev.area === area.key) {
                              newArea = 'all';
                              return { ...prev, area: 'all' };
                            } else {
                              newArea = [prev.area, area.key];
                              return { ...prev, area: [prev.area, area.key] };
                            }
                          }
                        });
                      }
                      
                      // Update URL with area filter - create fresh params to avoid double encoding
                      const params = new URLSearchParams();
                      
                      // Preserve all existing params except area and page
                      searchParams.forEach((value, key) => {
                        if (key !== 'area' && key !== 'page') {
                          params.set(key, value);
                        }
                      });
                      
                      // Set area parameter (URLSearchParams handles encoding automatically)
                      if (newArea === 'all') {
                        params.delete('area');
                      } else if (Array.isArray(newArea)) {
                        params.set('area', newArea.join(','));
                      } else {
                        params.set('area', newArea);
                      }
                      
                      // Maintain city in URL
                      if (selectedCity && selectedCity !== 'all') {
                        params.set('city', selectedCity);
                      }
                      
                      // Reset to page 1 when area changes
                      params.delete('page');
                      const categoryPath = `/category/${encodeURIComponent(category)}`;
                      router.push(`${categoryPath}?${params.toString()}`, { scroll: false });
                    }}
                    className={`${poppins.className} px-2.5 sm:px-3 md:px-3.5 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium border transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                        : 'bg-white text-black border-gray-300 hover:border-blue-400 hover:text-blue-500'
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
                <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className={`${poppins.className} block w-full pl-6 sm:pl-7 md:pl-8 pr-2 sm:pr-2.5 py-1 sm:py-1.5 md:py-2 border-2 border-blue-600 rounded-lg leading-5 bg-white text-black placeholder-gray-600 text-[10px] sm:text-xs md:text-sm focus:outline-none focus:placeholder-gray-500 hover:border-orange-500 hover:ring-2 hover:ring-orange-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-colors duration-200`}
                style={{ color: '#111827' }}
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
              {/* City Filter */}
              <div className="relative flex-1 sm:flex-none w-full sm:w-auto">
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setSelectedCity(newCity);
                    // Reset area filter when city changes (areas will be different for new city)
                    setFilters(prev => ({ ...prev, area: 'all' }));
                    setPendingAreas([]);
                    // Update URL with city filter
                    const params = new URLSearchParams(searchParams.toString());
                    if (newCity && newCity !== 'all') {
                      params.set('city', encodeURIComponent(newCity));
                    } else {
                      params.delete('city');
                    }
                    // Remove area from URL when city changes
                    params.delete('area');
                    // Reset to page 1 when city changes
                    params.delete('page');
                    const categoryPath = `/category/${encodeURIComponent(category)}`;
                    router.push(`${categoryPath}?${params.toString()}`, { scroll: false });
                  }}
                  className={`${poppins.className} w-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 border border-gray-300 rounded-lg bg-white text-black text-xs sm:text-sm md:text-base font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer`}
                  style={{
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    minHeight: '36px'
                  }}
                >
                  <option value="all">All Cities</option>
                  {cityOptions.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative flex-1 sm:flex-none w-full sm:w-auto" ref={locationMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationMenuOpen(prev => !prev);
                  }}
                  className={`${poppins.className} flex items-center justify-between w-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 border border-gray-300 rounded-lg bg-white text-black text-[10px] sm:text-xs md:text-sm font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200`}
                >
                  <span className="truncate">
                    Prime Locations
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
                  <div className={`${poppins.className} absolute z-30 mt-2 left-0 right-0 sm:left-auto sm:right-auto w-full sm:w-72 md:w-80 lg:w-96 rounded-lg bg-white shadow-2xl border border-gray-100 p-2.5 sm:p-3 max-w-[95vw]`} onMouseDown={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-2">
                      {popularDropdownAreas.map(area => {
                        const isSelected = pendingAreas.includes(area.key);
                        return (
                          <button
                            key={area.key}
                            type="button"
                            onClick={() => handleToggleArea(area.key)}
                            className={`px-2 sm:px-2.5 py-1.5 sm:py-1 rounded text-[10px] sm:text-xs md:text-xs font-medium border transition-all duration-200 flex items-center w-full justify-center text-center ${
                              isSelected
                                ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                : 'bg-white text-black border-gray-300 hover:border-blue-400 hover:text-blue-500'
                            }`}
                          >
                            <span className="w-full text-center whitespace-nowrap overflow-hidden text-ellipsis">{area.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-3 sm:mt-2.5">
                      <button
                        type="button"
                        onClick={handleResetArea}
                        className="text-xs sm:text-xs md:text-sm font-medium text-black hover:text-black"
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
                className={`${poppins.className} font-sans block w-full sm:w-36 md:w-40 lg:w-44 px-2.5 sm:px-3 md:px-3.5 py-1 sm:py-1.5 md:py-2 border border-gray-300 rounded-lg bg-white text-black text-xs sm:text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none cursor-pointer`}
                style={{
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  minHeight: '36px'
                }}
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
      <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12" style={{ maxWidth: '1920px', width: '100%', paddingTop: '12px', paddingBottom: '20px' }}>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Properties List */}
          <div className="flex-1">
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
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
                            description: 'Our fully furnished private office spaces feature customized layouts and privacy, allowing your business and growing team to work efficiently.',
                            image: '/images/2private.png'
                          },
                          {
                            title: 'Managed Office',
                            description: 'Our professionally managed offices feature customized layouts and full furnishings, allowing your team to start working immediately.',
                            image: '/images/2managed.jpg'
                          },
                          {
                            title: 'Enterprise Solution',
                            description: 'Empower your large team in a fully equipped office that offers the flexibility to scale and customize your workspace to your requirement.',
                            image: '/images/2enterprise.jpg'
                          }
                        ].map((card) => (
                          <div key={card.title} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 xl:h-64 overflow-hidden">
                              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-3 sm:p-4 md:p-5">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">{card.title}</h3>
                              <p className="text-sm sm:text-base text-black mb-2 sm:mb-3 leading-relaxed">{card.description}</p>
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
                            src="/images/2enterprise.jpg"
                            alt="Customized office"
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    </div>
                  );

                  // Show first 32 properties without pagination (only on page 1)
                  const first32Properties = filteredProperties.slice(0, initialPropertiesCount);
                  const remainingProperties = filteredProperties.slice(initialPropertiesCount);
                  
                  // Display first 32 properties with sections after every 8 (only on page 1)
                  if (currentPage === 1 && first32Properties.length > 0) {
                    const itemsPerBatch = 8;
                    for (let i = 0; i < first32Properties.length; i += itemsPerBatch) {
                      const batch = first32Properties.slice(i, i + itemsPerBatch);
                      const batchNumber = Math.floor(i / itemsPerBatch);
                      
                      // Add properties batch
                      batches.push(
                        <div key={`batch-${batchNumber}`} className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-4 items-stretch' : 'space-y-3 sm:space-y-4'}>
                          {batch.map((property, idx) => (
                            <PropertyCard
                              key={property.id}
                              property={property}
                              onEnquireClick={handleEnquireClick}
                              hideCategory={true}
                              category={categoryName}
                              priority={batchNumber === 0 && idx < 4}
                            />
                          ))}
                        </div>
                      );
                      
                      // Add section after each batch (except if it's the last batch of first 32)
                      if (i + itemsPerBatch < first32Properties.length || first32Properties.length < itemsPerBatch) {
                        const isPromo = Math.floor(i / itemsPerBatch) % 2 === 0;
                        batches.push(
                          <div key={`section-${batchNumber}`}>
                            {isPromo ? promoSection : customSection}
                          </div>
                        );
                      }
                    }
                  }
                  
                  // Show remaining properties with pagination (after 32)
                  // Page 1 shows only first 32, pagination starts from page 2
                  if (remainingProperties.length > 0 || currentPage > 1) {
                    // Calculate total pages: first 32 properties on page 1, then remaining properties divided by 16
                    const totalPages = first32Properties.length > 0 
                      ? Math.ceil(remainingProperties.length / propertiesPerPageAfterFirst) + 1 // +1 for the first 32 properties page
                      : Math.ceil(filteredProperties.length / propertiesPerPageAfterFirst); // If no first 32, use all properties
                    
                    // Show remaining properties if currentPage > 1
                    if (currentPage > 1) {
                      // For page 2+, show properties from remainingProperties
                      // Page 2 = index 0-15, Page 3 = index 16-31, etc.
                      const startIndex = (currentPage - 2) * propertiesPerPageAfterFirst;
                      const endIndex = startIndex + propertiesPerPageAfterFirst;
                      const currentPageProperties = remainingProperties.slice(startIndex, endIndex);
                      
                      // Add paginated properties
                      batches.push(
                        <div key={`paginated-${currentPage}`} className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-4' : 'space-y-3 sm:space-y-4'}>
                          {currentPageProperties.map((property) => (
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
                    }
                    
                    // Add pagination component (always show if there are remaining properties)
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
                          
                          const handlePageChange = (page: number, e?: React.MouseEvent) => {
                            // For page 2+, always open in new tab
                            if (page > 1) {
                              // Let the link handle it (will open in new tab due to target="_blank")
                              return;
                            }
                            // For page 1, handle normally
                            if (e && (e.ctrlKey || e.metaKey || e.button === 1)) {
                              return; // Let the link handle it
                            }
                            e?.preventDefault();
                            setCurrentPage(page);
                            updatePageInURL(page);
                            // Scroll to top when page changes
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          };
                          
                          // Helper function to generate URL for a page
                          const getPageUrl = (page: number) => {
                            const params = new URLSearchParams();
                            
                            // Get current URL parameters from both searchParams and filters state
                            // Use searchParams first, then supplement with current filter state
                            searchParams.forEach((value, key) => {
                              if (key !== 'page') { // We'll set page separately
                                params.set(key, value);
                              }
                            });
                            
                            // Also ensure area and city from current filter state are included
                            // This handles cases where searchParams might be stale
                            if (filters.area && filters.area !== 'all') {
                              if (Array.isArray(filters.area)) {
                                params.set('area', filters.area.join(','));
                              } else {
                                params.set('area', filters.area);
                              }
                            } else {
                              // If area is 'all', remove it from URL
                              params.delete('area');
                            }
                            
                            // Maintain city in URL
                            if (selectedCity && selectedCity !== 'all') {
                              params.set('city', selectedCity);
                            }
                            
                            // Set page parameter
                            if (page === 1) {
                              params.delete('page');
                            } else {
                              params.set('page', page.toString());
                            }
                            
                            const queryString = params.toString();
                            // Maintain category path in URL
                            const categoryPath = `/category/${encodeURIComponent(category)}`;
                            return queryString ? `${categoryPath}?${queryString}` : categoryPath;
                          };
                          
                          const prevPage = Math.max(1, currentPage - 1);
                          const nextPage = Math.min(totalPages, currentPage + 1);
                          
                          return (
                            <>
                              {/* Previous Button */}
                              {currentPage === 1 ? (
                                <span className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold bg-gray-200 text-gray-500 cursor-not-allowed opacity-60`}>
                                  Previous
                                </span>
                              ) : (
                                <Link
                                  href={getPageUrl(prevPage)}
                                  onClick={(e) => handlePageChange(prevPage, e)}
                                  target={prevPage > 1 ? "_blank" : undefined}
                                  rel={prevPage > 1 ? "noopener noreferrer" : undefined}
                                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all bg-blue-400 text-white hover:bg-blue-500`}
                                >
                                  Previous
                                </Link>
                              )}
                              
                              {/* Page Numbers */}
                              {getPageNumbers().map((page, index) => (
                                page === '...' ? (
                                  <span key={`ellipsis-${index}`} className="px-2 text-black">...</span>
                                ) : (
                                  <Link
                                    key={page}
                                    href={getPageUrl(page as number)}
                                    onClick={(e) => handlePageChange(page as number, e)}
                                    target={(page as number) > 1 ? "_blank" : undefined}
                                    rel={(page as number) > 1 ? "noopener noreferrer" : undefined}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all ${
                                      currentPage === page
                                        ? 'bg-blue-400 text-white'
                                        : 'bg-gray-200 text-black hover:bg-gray-300'
                                    }`}
                                  >
                                    {page}
                                  </Link>
                                )
                              ))}
                              
                              {/* Next Button - Always visible, grayed out when disabled */}
                              {currentPage === totalPages ? (
                                <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold bg-gray-100 text-gray-400 cursor-not-allowed inline-block">
                                  Next
                                </span>
                              ) : (
                                <Link
                                  href={getPageUrl(nextPage)}
                                  onClick={(e) => handlePageChange(nextPage, e)}
                                  target={nextPage > 1 ? "_blank" : undefined}
                                  rel={nextPage > 1 ? "noopener noreferrer" : undefined}
                                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all bg-blue-400 text-white hover:bg-blue-500 inline-block"
                                >
                                  Next
                                </Link>
                              )}
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

      {/* Explore Top Coworking Locations Section - Only for coworking-space category */}
      {(categoryName === 'coworking-space' || categoryName === 'coworking') && (
        <section className="py-12 md:py-16 bg-gradient-to-br from-white via-blue-50 to-white">
          <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12" style={{ maxWidth: '1920px', width: '100%' }}>
            <div className="text-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Explore Top Office Locations in Mumbai</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5">
              {primeLocations.map((location) => {
                const encodedArea = encodeURIComponent(location.name);
                return (
                  <Link
                    key={location.slug}
                    href={`/category/coworking-space?area=${encodedArea}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="h-40 md:h-44 w-full overflow-hidden">
                      <img
                        src={location.image}
                        alt={`Coworking Space in ${location.name}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <h4 className="text-lg font-semibold text-black">
                        Coworking Space in {location.name}
                      </h4>
                      <div className="flex items-center justify-between text-xs font-semibold text-blue-500">
                        <span>Explore Spaces</span>
                        <svg
                          className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <ShareRequirementsModal isOpen={isModalOpen} onClose={closeModal} showFullForm={true} />
      <ShareRequirementsModal isOpen={isInterestedModalOpen} onClose={closeInterestedModal} showFullForm={false} />
    </div>
  );
}
