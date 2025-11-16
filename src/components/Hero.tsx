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
      src: '/images/co2.jpeg',
      alt: 'Managed office floor with collaborative zones',
      category: 'Managed Office'
    },
    {
      src: '/images/hero4.jpeg',
      alt: 'Modern office space',
      category: 'Office Space'
    },
    {
      src: '/images/hero1.jpeg',
      alt: 'Premium hero workspace with modern design and professional atmosphere',
      category: 'Hero Workspace'
    },
    {
      src: '/images/9.jpeg',
      alt: 'Executive office space with sophisticated design and premium facilities',
      category: 'Enterprise Office'
    },
    {
      src: '/images/10.jpeg',
      alt: 'Modern conference room with professional setup and bright atmosphere',
      category: 'Meeting Room'
    },
    {
      src: '/images/12.jpeg',
      alt: 'Flexible office space with modern amenities and collaborative atmosphere',
      category: 'Flexi Desk'
    },
    {
      src: '/images/7.jpeg',
      alt: 'Contemporary workspace with modern furniture and collaborative environment',
      category: 'Coworking Space'
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
    const text = 'Discover Your Dream Office Space';
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
    { key: 'dedicateddesk', label: 'Dedicated Desk' },
    { key: 'flexidesk', label: 'Day Pass / Flexi Desk' },
    { key: 'virtualoffice', label: 'Virtual Office' },
    { key: 'meetingroom', label: 'Meeting Room' },
    { key: 'enterpriseoffices', label: 'Enterprise Offices' },
  ];

  const headlineSpanStyle: CSSProperties = {
    textShadow: '0 0 10px rgba(255,255,255,0.7), 0 0 18px rgba(150,220,255,0.4)',
    WebkitTextStroke: '1.6px rgba(0, 0, 0, 0.7)'
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
      <div className={`relative z-10 text-left text-white w-full px-4 md:px-10 transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      } md:flex md:items-start md:justify-between md:gap-4`}>
        <div className="max-w-3xl mb-4 md:mb-0 md:w-1/2 ml-[30px]">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-3 leading-tight font-[Poppins,sans-serif]">
            <span
              className="block text-white"
              style={headlineSpanStyle}
            >
              {typedOffice}
              <span
                className={`inline-block w-[1ch] transition-opacity duration-300 ${isTypingComplete ? 'opacity-0' : 'opacity-100'}`}
                style={{ color: '#4f46e5' }}
              >
                |
              </span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/95 font-semibold mb-4" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6)'}}>
            Premium Office Spaces, Coworking Hubs & Meeting Rooms
          </p>
          
          <div className="flex flex-wrap justify-start gap-5 text-base md:text-lg text-white/90 mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">Instant Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">Prime Locations</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">Best Prices</span>
            </div>
          </div>
        </div>

        {/* Lighter card so image is visible behind */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-xl transition-all duration-700 delay-500 mx-auto md:mx-0 md:-ml-4 md:self-start max-w-2xl md:max-w-lg w-full md:w-[52%] ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>

          <div className="grid grid-cols-1 gap-3 mb-3">
            <div className="group">
              <label className="block text-gray-800 text-xs font-semibold mb-1">City</label>
              <select
                value={selectedCityId || ''}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedCityId(id);
                  const name = cityOptions.find(c => c.id === id)?.name || 'all';
                  onFilterChange('city', name);
                  onFilterChange('area', 'all');
                }}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300 text-sm"
              >
                <option value="">Select City</option>
                {cityOptions.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-gray-800 text-xs font-semibold mb-1">Area</label>
              <select
                value={filters.area}
                onChange={(e) => onFilterChange('area', e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300 text-sm"
              >
                <option value="all">Any Area</option>
                {areaOptions.map((area) => (
                  <option key={area.id} value={area.name}>{area.name}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-gray-800 text-xs font-semibold mb-1">Category</label>
              <select
                value={filters.purpose}
                onChange={(e) => onFilterChange('purpose', e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300 text-sm"
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
              onClick={() => router.push('/properties')}
              className="w-full mt-2 py-2 rounded-lg bg-blue-400 text-white text-sm font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
            >
              Search Spaces
            </button>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <p className="text-sm md:text-base text-gray-700 font-semibold mb-3 text-center">Popular Categories</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
              {quickFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => router.push(`/category/${filter.key}`)}
                  className="w-full px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs md:text-sm font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:via-blue-600 hover:to-cyan-500 hover:text-white"
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

