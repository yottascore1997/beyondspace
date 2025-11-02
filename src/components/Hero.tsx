'use client';

import { useState, useEffect } from 'react';
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
      src: '/images/7.jpeg',
      alt: 'Contemporary workspace with modern furniture and collaborative environment',
      category: 'Coworking Space'
    },
    {
      src: '/images/co1.jpeg',
      alt: 'Premium coworking lounge with collaborative seating and natural light',
      category: 'Coworking Lounge'
    },
    {
      src: '/images/hero4.jpeg',
      alt: 'Modern office space',
      category: 'Office Space'
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
    const text = 'Dream Office Space';
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

  const cities = [
    { value: 'all', label: 'Select City' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Thane', label: 'Thane' },
    { value: 'Navi Mumbai', label: 'Navi Mumbai' },
  ];

  const areas = [
    { value: 'all', label: 'Any Area' },
    { value: 'Thane', label: 'Thane' },
    { value: 'Navi Mumbai', label: 'Navi Mumbai' },
    { value: 'Andheri West', label: 'Andheri West' },
    { value: 'Andheri East', label: 'Andheri East' },
    { value: 'Andheri', label: 'Andheri' },
    { value: 'BKC', label: 'BKC' },
    { value: 'Lower Parel', label: 'Lower Parel' },
    { value: 'Vashi', label: 'Vashi' },
    { value: 'Powai', label: 'Powai' },
    { value: 'Borivali', label: 'Borivali' },
    { value: 'Goregaon', label: 'Goregaon' },
    { value: 'Bandra', label: 'Bandra' },
    { value: 'Malad', label: 'Malad' },
    { value: 'Dadar', label: 'Dadar' },
    { value: 'Mulund', label: 'Mulund' },
    { value: 'Borivali West', label: 'Borivali West' },
    { value: 'Vikhroli', label: 'Vikhroli' },
    { value: 'Worli', label: 'Worli' },
    { value: 'Churchgate', label: 'Churchgate' },
    { value: 'Marol', label: 'Marol' },
    { value: 'Vile Parle', label: 'Vile Parle' }
  ];

  const quickFilters = [
    { key: 'coworking', label: 'Coworking' },
    { key: 'managed', label: 'Managed Office Space' },
    { key: 'dedicateddesk', label: 'Dedicated Desk' },
    { key: 'flexidesk', label: 'Day Pass/ Flexi Desk' },
    { key: 'virtualoffice', label: 'Virtual Office' },
    { key: 'meetingroom', label: 'Meeting Room' },
    { key: 'enterpriseoffices', label: 'Enterprise Offices' },
  ];

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Image Slider - keep images crisp and visible */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <img
            key={index}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex 
                ? 'opacity-100' 
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
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-3 leading-tight">
            <span
              className="block text-white mb-1"
              style={{ textShadow: '0 0 10px rgba(255,255,255,0.7), 0 0 18px rgba(150,220,255,0.4)' }}
            >
              Discover Your
            </span>
            <span
              className="block"
            >
              <span className="font-extrabold">
                {typedOffice.length <= 5 ? (
                  <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">{typedOffice}</span>
                ) : typedOffice.length <= 12 ? (
                  <>
                    <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">Dream </span>
                    <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">{typedOffice.substring(6)}</span>
                  </>
                ) : (
                  <>
                    <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">Dream </span>
                    <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">Office </span>
                    <span className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 bg-clip-text text-transparent">{typedOffice.substring(13)}</span>
                  </>
                )}
              </span>
              <span 
                className={`inline-block w-[1ch] transition-opacity duration-300 ${isTypingComplete ? 'opacity-0' : 'opacity-100'}`}
                style={{ color: '#16a34a' }}
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
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transition-all duration-700 delay-500 mx-auto md:mx-0 md:-ml-6 md:self-start max-w-3xl md:max-w-xl w-full md:w-1/2 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>

          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="group">
              <label className="block text-gray-800 text-sm font-semibold mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => onFilterChange('city', e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-gray-800 text-sm font-semibold mb-2">Area</label>
              <select
                value={filters.area}
                onChange={(e) => onFilterChange('area', e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
              >
                {areas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-gray-800 text-sm font-semibold mb-2">Category</label>
              <select
                value={filters.purpose}
                onChange={(e) => onFilterChange('purpose', e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 bg-white text-gray-900 outline-none transition-all duration-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:border-gray-300"
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
              className="w-full mt-2 py-3 rounded-lg bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-cyan-400/40 transition-all duration-300"
            >
              Search Spaces
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-base md:text-lg text-gray-700 font-semibold mb-4 text-center">Popular Categories</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {quickFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => router.push(`/category/${filter.key}`)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium transition-colors hover:bg-gradient-to-r hover:from-purple-600 hover:via-blue-600 hover:to-cyan-500 hover:text-white"
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

