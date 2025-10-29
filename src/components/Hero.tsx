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
  const [typedText, setTypedText] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  
  const fullText = 'office spaces';

  // Hero images from public/images folder
  const heroImages = [
    {
      src: '/images/7.jpeg',
      alt: 'Contemporary workspace with modern furniture and collaborative environment',
      category: 'Coworking Space'
    },
    {
      src: '/images/4.jpeg',
      alt: 'Modern office meeting room with professional design and bright atmosphere',
      category: 'Meeting Room'
    },
    {
      src: '/images/8.jpeg',
      alt: 'Premium office environment with professional amenities and natural lighting',
      category: 'Managed Office'
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
    
    // Repeating typewriter effect for "coworking spaces"
    const startTypewriter = () => {
      let index = 0;
      setTypedText(''); // Reset text
      
      const typeInterval = setInterval(() => {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          // After typing is complete, wait 2 seconds then restart
          setTimeout(() => {
            startTypewriter();
          }, 2000);
        }
      }, 150); // 150ms delay between each character
    };

    // Start the first animation
    startTypewriter();

    // Auto-slide images every 4 seconds
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => {
      clearInterval(imageInterval);
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
    { key: 'virtualoffice', label: 'Virtual Office' },
    { key: 'meetingroom', label: 'Meeting Room' },
    { key: 'dedicateddesk', label: 'Dedicated Desk' },
    { key: 'flexidesk', label: 'Flexi Desk' },
    { key: 'enterpriseoffices', label: 'Enterprise offices' },
  ];

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#a08efe]/10 via-transparent to-cyan-300/10 animate-pulse"></div>
      
      {/* Image Slider */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <img
            key={index}
            className={`absolute inset-0 w-full h-full object-cover brightness-125 saturate-110 transition-all duration-1000 ${
              index === currentImageIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
            src={image.src}
            alt={image.alt}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/20"></div>
      
      {/* Image Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-orange-400 scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#a08efe] rounded-full animate-bounce"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>
      
      <div className={`relative z-10 text-center text-white px-4 py-16 max-w-4xl mx-auto transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white" style={{textShadow: '2px 2px 0px rgba(0,0,0,0.8), 4px 4px 0px rgba(0,0,0,0.6)'}}>
          The new way to find <span className="font-black animate-pulse text-green-500" style={{textShadow: '1px 1px 0px rgba(0,0,0,1), 2px 2px 0px rgba(0,0,0,0.8), 3px 3px 0px rgba(0,0,0,0.6)'}}>{typedText}<span className="animate-pulse text-green-500 font-black">|</span></span>
        </h1>

        <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl transition-all duration-700 delay-500 hover:shadow-[#a08efe]/20 hover:shadow-2xl hover:scale-105 hover:bg-white/15 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="group">
              <label className="block text-white/90 text-sm mb-2 transition-colors group-hover:text-white">City</label>
              <select
                value={filters.city}
                onChange={(e) => onFilterChange('city', e.target.value)}
                className="w-full p-3 rounded-xl border border-white/40 bg-white/90 text-gray-900 outline-none transition-all duration-300 hover:shadow-lg hover:shadow-[#a08efe]/20 focus:shadow-lg focus:shadow-[#a08efe]/30 focus:border-[#a08efe] hover:scale-105"
              >
                {cities.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="block text-white/90 text-sm mb-2 transition-colors group-hover:text-white">Area</label>
              <select
                value={filters.area}
                onChange={(e) => onFilterChange('area', e.target.value)}
                className="w-full p-3 rounded-xl border border-white/40 bg-white/90 text-gray-900 outline-none transition-all duration-300 hover:shadow-lg hover:shadow-[#a08efe]/20 focus:shadow-lg focus:shadow-[#a08efe]/30 focus:border-[#a08efe] hover:scale-105"
              >
                {areas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 group">
              <label className="block text-white/90 text-sm mb-2 transition-colors group-hover:text-white">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                placeholder="Search location or property..."
                className="w-full p-3 rounded-xl border border-white/40 bg-white/90 text-gray-900 outline-none transition-all duration-300 hover:shadow-lg hover:shadow-[#a08efe]/20 focus:shadow-lg focus:shadow-[#a08efe]/30 focus:border-[#a08efe] hover:scale-105 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {quickFilters.map((filter, index) => (
              <button
                key={filter.key}
                onClick={() => router.push(`/category/${filter.key}`)}
                onMouseEnter={() => setHoveredFilter(filter.key)}
                onMouseLeave={() => setHoveredFilter(null)}
                className={`px-4 py-2 rounded-full border border-white/40 font-medium transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#a08efe]/20 hover:border-[#a08efe]/60 bg-white/10 text-white hover:bg-gradient-to-r hover:from-[#a08efe]/30 hover:to-cyan-300/30 ${
                  hoveredFilter === filter.key ? 'animate-pulse' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

