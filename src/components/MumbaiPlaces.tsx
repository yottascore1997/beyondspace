'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ShareRequirementsModal from './ShareRequirementsModal';

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  properties: string;
  area: string;
}

export default function MumbaiPlaces() {
  const router = useRouter();
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollAnimationRef = useRef<number | null>(null);

  const handleGetOffer = (placeName: string) => {
    setShowShareModal(true);
  };

  const handleAreaClick = (areaName: string) => {
    // For Navi Mumbai, use city parameter instead of area
    if (areaName.toLowerCase() === 'navi mumbai') {
      const encodedCity = encodeURIComponent(areaName);
      router.push(`/category/coworking?city=${encodedCity}`);
    } else {
      // For other areas, use area parameter
      const encodedArea = encodeURIComponent(areaName);
      router.push(`/category/coworking?area=${encodedArea}`);
    }
  };

  const smoothScrollBy = (distance: number) => {
    const container = scrollRef.current;
    if (!container) return;

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    const start = container.scrollLeft;
    const duration = 600;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 0.5 - Math.cos(progress * Math.PI) / 2; // easeInOut
      container.scrollLeft = start + distance * eased;

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(step);
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  const mumbaiPlaces: Place[] = [
    {
      id: 'andheri-east',
      name: 'Andheri East',
      description: 'Prime business district with excellent metro connectivity and corporate offices',
      image: '/images/mumbai4.jpeg',
      properties: '0 Properties',
      area: 'West Mumbai'
    },
    {
      id: 'bkc',
      name: 'Bandra East (BKC)',
      description: 'Mumbai\'s premier business district with world-class infrastructure',
      image: '/images/mumbai3.png',
      properties: '0 Properties',
      area: 'Central Mumbai'
    },
    {
      id: 'goregaon',
      name: 'Goregaon East',
      description: 'Thriving business hub with excellent connectivity and commercial spaces',
      image: '/images/mumbai20.jpeg',
      properties: '0 Properties',
      area: 'West Mumbai'
    },
    {
      id: 'lower-parel',
      name: 'Lower Parel West',
      description: 'Historic mill district transformed into modern business hub',
      image: '/images/mumbai5.jpg',
      properties: '0 Properties',
      area: 'South Mumbai'
    },
    {
      id: 'thane',
      name: 'Thane West',
      description: 'Rapidly developing suburb with great connectivity and modern amenities',
      image: '/images/mumbai7.jpg',
      properties: '0 Properties',
      area: 'Extended Mumbai'
    },
    {
      id: 'navi-mumbai',
      name: 'Navi Mumbai',
      description: 'Planned satellite city with world-class infrastructure and corporate parks',
      image: '/images/mumbai8.PNG',
      properties: '0 Properties',
      area: 'Navi Mumbai'
    }
  ];

  const localMumbaiImages = [
    '/images/mumbai4.jpeg',
    '/images/mumbai3.png',
    '/images/mumbai5.jpg',
    '/images/mumbai7.jpg',
    '/images/mumbai8.PNG',
  ];

  // Explicit unique image mapping per area (no repeats)
  const imageMap: Record<string, string> = {
    'andheri-east': '/images/mumbai4.jpeg',
    bkc: '/images/mumbai3.png',
    goregaon: '/images/mumbai20.jpeg',
    'lower-parel': '/images/mumbai5.jpg',
    thane: '/images/mumbai7.jpg',
    'navi-mumbai': '/images/mumbai8.PNG',
  };

  const priorityOrder = ['andheri-east', 'bkc', 'goregaon', 'lower-parel', 'thane', 'navi-mumbai'];
  const baseOrdered = [...mumbaiPlaces].sort((a, b) => {
    const pa = priorityOrder.indexOf(a.id);
    const pb = priorityOrder.indexOf(b.id);
    const aPriority = pa === -1 ? Infinity : pa;
    const bPriority = pb === -1 ? Infinity : pb;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return 0;
  });

  // Compute concrete image for each place (no repeats per imageMap)
  const orderedItems = baseOrdered.map((p, i) => ({
    place: p,
    image: imageMap[p.id] ?? (i < localMumbaiImages.length ? localMumbaiImages[i] : localMumbaiImages[localMumbaiImages.length - 1]),
  }));

  return (
    <section className="py-8 md:py-10 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 xl:px-8 2xl:px-12">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-2 md:mb-3 text-gray-900" style={{ textShadow: '0 0 14px rgba(255,255,255,0.4)' }}>
            Explore{' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Mumbai&apos;s
            </span>{' '}
            Prime Locations
          </h2>
          <p className="text-sm md:text-base xl:text-lg text-black max-w-2xl xl:max-w-4xl mx-auto" style={{ textShadow: '0 0 10px rgba(255,255,255,0.35)' }}>
            Discover the most sought-after neighborhoods in the city of dreams
          </p>
        </div>

        {/* Horizontal Scrollable Container */}
        <div className="relative overflow-hidden">
          {/* Navigation Buttons */}
          <button onClick={() => smoothScrollBy(-260)} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 shadow-lg transition-all duration-300 hover:scale-110">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => smoothScrollBy(260)} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2.5 shadow-lg transition-all duration-300 hover:scale-110">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Cards Container */}
          <div ref={scrollRef} className="flex gap-4 xl:gap-6 overflow-x-auto scrollbar-hide px-2 md:px-4 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {orderedItems.map((item, index) => (
              <div
                key={item.place.id}
                onClick={() => handleAreaClick(item.place.name)}
                onMouseEnter={() => setHoveredPlace(item.place.id)}
                onMouseLeave={() => setHoveredPlace(null)}
                className={`group relative flex-shrink-0 w-60 md:w-64 xl:w-72 2xl:w-80 h-72 md:h-80 xl:h-96 2xl:h-[26rem] rounded-2xl overflow-hidden shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#a08efe]/30 cursor-pointer ${
                  hoveredPlace === item.place.id ? 'ring-2 ring-[#a08efe]/50' : ''
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.place.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    console.error(`Failed to load image: ${item.image}`);
                    // Fallback to a placeholder or default image
                    (e.target as HTMLImageElement).src = '/images/mumbai4.jpeg';
                  }}
                />
                
                {/* Light Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Content positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {/* Area Tag */}
                  <div className="mb-2">
                    <span className="bg-orange-400 backdrop-blur-sm text-white px-2.5 md:px-3 py-1 rounded-full text-xs font-medium">
                      {item.place.area}
                    </span>
                  </div>

                  {/* Place Name */}
                  <h3 
                    className="text-lg md:text-xl font-bold mb-1.5 transition-all duration-300"
                    style={{ 
                      color: '#ffffff',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6), 0 0 12px rgba(255,255,255,1), 0 0 20px rgba(255,255,255,0.8)',
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 10px rgba(255,255,255,0.9))',
                      WebkitTextStroke: '2px #000000',
                      paintOrder: 'stroke fill'
                    }}
                  >
                    {item.place.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/90 text-xs mb-2 leading-relaxed">
                    {item.place.description}
                  </p>

                  {/* Get Offer Button */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from triggering
                        handleGetOffer(item.place.name);
                      }}
                      className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg shadow-purple-500/30 hover:shadow-cyan-400/40 transition-all duration-300"
                    >
                      Get Offer
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#a08efe]/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
              </div>
            ))}
          </div>
        </div>


        {/* Share Requirements Modal (GetQuote Form) */}
        <ShareRequirementsModal 
          isOpen={showShareModal} 
          onClose={() => setShowShareModal(false)} 
        />
      </div>
    </section>
  );
}
