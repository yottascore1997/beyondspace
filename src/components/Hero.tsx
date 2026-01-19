'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { useRouter } from 'next/navigation';

interface HeroProps {
  filters: {
    city: string;
    area: string;
    purpose: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export default function Hero({ filters, onFilterChange, onReset }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [typedOffice, setTypedOffice] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const router = useRouter();

  // Hero images from public/images folder
  const heroImages = [
    {
      src: '/images/01.jpg',
      alt: 'Premium office space with modern design',
      category: 'Office Space'
    },
    {
      src: '/images/02.jpg',
      alt: 'Contemporary workspace with professional atmosphere',
      category: 'Coworking Space'
    },
    {
      src: '/images/03.webp',
      alt: 'Modern office environment with collaborative zones',
      category: 'Managed Office'
    },
    {
      src: '/images/05.jpg',
      alt: 'Executive office space with sophisticated design',
      category: 'Enterprise Office'
    },
    {
      src: '/images/06.jpg',
      alt: 'Flexible workspace with modern amenities',
      category: 'Flexi Desk'
    },
    {
      src: '/images/07.jpg',
      alt: 'Professional office space with premium facilities',
      category: 'Office Space'
    },
    {
      src: '/images/08.jpg',
      alt: 'Modern conference room with bright atmosphere',
      category: 'Meeting Room'
    },
    {
      src: '/images/10.jpg',
      alt: 'Contemporary workspace with collaborative environment',
      category: 'Coworking Space'
    },
    {
      src: '/images/11.jpeg',
      alt: 'Premium office space with modern furniture',
      category: 'Office Space'
    },
    {
      src: '/images/12.jpg',
      alt: 'Flexible office space with professional setup',
      category: 'Flexi Desk'
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Auto-slide images every 10 seconds
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    // Typewriter effect for "Dream Office Space" with restart
    const text = 'Discover your Dream Office space';
    let index = 0;
    let typingTimeout: ReturnType<typeof setTimeout> | null = null;

    setTypedOffice('');
    setIsTypingComplete(false);

    const typeNext = () => {
      typingTimeout = setTimeout(() => {
        if (index < text.length) {
          index += 1;
          setTypedOffice(text.slice(0, index));
          typeNext();
        } else {
          setTypedOffice(text);
          setIsTypingComplete(true);
        }
      }, 250);
    };

    typeNext();

    return () => {
      clearInterval(imageInterval);
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [heroImages.length]);

  const purposes = [];

  const [cityOptions, setCityOptions] = useState<{ id: string; name: string }[]>([]);
  const [areaOptions, setAreaOptions] = useState<{ id: string; name: string; cityId: string }[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>('');

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch('/api/public/cities', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCityOptions(data);
          // If filters.city already has a name, map to id
          const match = data.find((c: { name: string }) => c.name === filters.city);
          if (match) setSelectedCityId(match.id);
        }
      } catch {}
    };
    loadCities();
  }, [filters.city]);

  useEffect(() => {
    const loadAreas = async () => {
      try {
        const url = selectedCityId ? `/api/public/areas?cityId=${encodeURIComponent(selectedCityId)}` : '/api/public/areas';
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAreaOptions(data);
        }
      } catch {}
    };
    loadAreas();
  }, [selectedCityId]);

  const quickFilters = [
    { key: 'coworking', label: 'Coworking' },
    { key: 'managed', label: 'Managed Office Space' },
    { key: 'privatecabin', label: 'Private Cabin' },
    { key: 'dedicateddesk', label: 'Dedicated Desk' },
    { key: 'day-pass', label: 'Day Pass' },
    { key: 'meetingroom', label: 'Meeting Room' },
    { key: 'virtualoffice', label: 'Virtual Office' },
    { key: 'enterpriseoffices', label: 'Enterprise Offices' },
  ];

  const headlineSpanStyle: CSSProperties = {
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.5)',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(255,255,255,0.8))',
    fontWeight: 900,
    letterSpacing: '-0.02em',
    WebkitTextStroke: '2.5px #000000',
    paintOrder: 'stroke fill'
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Image Slider - keep images crisp and visible */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <img
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === currentImageIndex 
                ? 'opacity-100 object-cover'
                : 'opacity-0'
            }`}
            src={image.src}
            alt={image.alt}
          />
        ))}
      </div>
      
      {/* Subtle bottom gradient only for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50"></div>
      
      {/* Image Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`transition-all duration-300 ${
              index === currentImageIndex 
                ? 'w-8 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full' 
                : 'w-2 h-2 bg-white/60 hover:bg-white rounded-full'
            }`}
          />
        ))}
      </div>
      
      {/* Two-column layout: left text (centered vertically), right search (centered) */}
      <div className={`relative z-10 text-left text-white w-full max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 xl:px-8 2xl:px-12 transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } md:flex md:items-start md:justify-between md:gap-8 xl:gap-12 2xl:gap-16`}>
        <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mb-4 md:mb-0 md:w-1/2 xl:w-[55%] ml-[30px] 2xl:ml-[50px] mt-4 md:mt-6 2xl:mt-8 relative">
          {/* Premium background glow behind text */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-3xl rounded-3xl opacity-60"></div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl mb-5 md:mb-6 2xl:mb-8 leading-tight font-[Poppins,sans-serif] relative z-10">
            <span
              className="block"
              style={headlineSpanStyle}
            >
              {typedOffice}
              <span
                className={`inline-block w-[1ch] transition-opacity duration-300 ${isTypingComplete ? 'opacity-0' : 'opacity-100'}`}
                style={{ 
                  color: '#ffffff',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.8)',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(255,255,255,0.9))',
                  WebkitTextStroke: '2.5px #000000',
                  paintOrder: 'stroke fill'
                }}
              >
                |
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-semibold mb-5 md:mb-6 2xl:mb-8 relative z-10" style={{
            color: '#ffffff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.6), 0 0 10px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.7), 0 0 24px rgba(255,255,255,0.5)',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px rgba(255,255,255,0.8))',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            WebkitTextStroke: '2px #000000',
            paintOrder: 'stroke fill'
          }}>
            Premium Office Spaces, Coworking Hubs & Meeting Rooms
          </p>
          
          <div className="flex flex-wrap justify-start gap-2 md:gap-3 2xl:gap-4 mb-2 2xl:mb-4">
            <div className="flex items-center gap-1.5 2xl:gap-2 px-3 py-1.5 2xl:px-4 2xl:py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                <svg className="w-3 h-3 2xl:w-4 2xl:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              </div>
              <span className="text-sm md:text-base 2xl:text-lg font-bold text-white drop-shadow-lg">Instant Booking</span>
            </div>
            <div className="flex items-center gap-1.5 2xl:gap-2 px-3 py-1.5 2xl:px-4 2xl:py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <div className="w-5 h-5 2xl:w-6 2xl:h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md">
                <svg className="w-3 h-3 2xl:w-4 2xl:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              </div>
              <span className="text-sm md:text-base 2xl:text-lg font-bold text-white drop-shadow-lg">Prime Locations</span>
            </div>
          </div>
        </div>

        {/* Lighter card so image is visible behind */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-3 md:p-4 xl:p-5 2xl:p-6 shadow-xl transition-all duration-700 delay-500 mx-auto md:mx-0 md:-ml-4 md:mr-8 md:mt-6 md:self-start max-w-xl md:max-w-md xl:max-w-lg 2xl:max-w-xl w-full md:w-[45%] xl:w-[40%] ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>

          <div className="grid grid-cols-1 gap-2 mb-2">
            <div className="group">
              <label className="block text-gray-800 text-[10px] 2xl:text-sm font-semibold mb-0.5 2xl:mb-1">City</label>
              <select
                value={selectedCityId || ''}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedCityId(id);
                  const name = cityOptions.find(c => c.id === id)?.name || 'all';
                  onFilterChange('city', name);
                  onFilterChange('area', 'all');
                }}
                className="w-full p-1.5 2xl:p-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300 text-xs 2xl:text-base"
              >
                <option value="">Select City</option>
                {cityOptions.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-gray-800 text-[10px] 2xl:text-sm font-semibold mb-0.5 2xl:mb-1">Area</label>
              <select
                value={filters.area}
                onChange={(e) => onFilterChange('area', e.target.value)}
                className="w-full p-1.5 2xl:p-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300 text-xs 2xl:text-base"
              >
                <option value="all">Any Area</option>
                {areaOptions.map((area) => (
                  <option key={area.id} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-gray-800 text-[10px] 2xl:text-sm font-semibold mb-0.5 2xl:mb-1">Category</label>
              <select
                value={filters.purpose}
                onChange={(e) => onFilterChange('purpose', e.target.value)}
                className="w-full p-1.5 2xl:p-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300 text-xs 2xl:text-base"
              >
                <option value="">Select Category</option>
                {quickFilters.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                // Handle navigation based on filters
                const queryParams = new URLSearchParams();
                
                // Add city if selected
                if (filters.city && filters.city !== 'all') {
                  queryParams.set('city', encodeURIComponent(filters.city));
                }
                
                // Add area if selected
                if (filters.area && filters.area !== 'all') {
                  queryParams.set('area', encodeURIComponent(filters.area));
                }
                
                const queryString = queryParams.toString();
                const urlSuffix = queryString ? `?${queryString}` : '';
                
                if (filters.purpose) {
                  // If category/purpose is selected, go to category page
                  router.push(`/category/${filters.purpose}${urlSuffix}`);
                } else if (filters.area && filters.area !== 'all') {
                  // If only area is selected (no category), go to default category (coworking) with filters
                  router.push(`/category/coworking${urlSuffix}`);
                } else {
                  // Default: show all properties or first category
                  router.push(`/category/coworking${urlSuffix}`);
                }
              }}
              className="w-full mt-1 py-1.5 2xl:py-2.5 rounded-lg bg-blue-400 text-white text-xs 2xl:text-base font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
            >
              Search Spaces
            </button>
          </div>

          <div className="border-t border-gray-200 pt-2 2xl:pt-3">
            <p className="text-xs md:text-sm 2xl:text-base text-gray-700 font-semibold mb-2 2xl:mb-3 text-center">Popular Categories</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 2xl:gap-2">
              {quickFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => router.push(`/category/${filter.key}`)}
                  className="w-full px-2 py-1 2xl:px-3 2xl:py-2 rounded-lg bg-gray-100 text-gray-700 text-[10px] md:text-xs 2xl:text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:via-blue-600 hover:to-cyan-500 hover:text-white"
              >
                {filter.label}
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

