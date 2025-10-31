'use client';

import { useState, useRef } from 'react';

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  properties: string;
  area: string;
}

export default function MumbaiPlaces() {
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleGetOffer = (placeName: string) => {
    setSelectedPlace(placeName);
    setShowModal(true);
  };

  const mumbaiPlaces: Place[] = [
    {
      id: 'andheri-east',
      name: 'Andheri East',
      description: 'Prime business district with excellent metro connectivity and corporate offices',
      image: '/images/mumbai1.jpg',
      properties: '180+ Properties',
      area: 'West Mumbai'
    },
    {
      id: 'bkc',
      name: 'BKC',
      description: 'Mumbai\'s premier business district with world-class infrastructure',
      image: '/images/mumbai2.jpg',
      properties: '120+ Properties',
      area: 'Central Mumbai'
    },
    {
      id: 'thane',
      name: 'Thane',
      description: 'Rapidly developing suburb with great connectivity and modern amenities',
      image: '/images/mumbai3.jpg',
      properties: '200+ Properties',
      area: 'Extended Mumbai'
    },
    {
      id: 'lower-parel',
      name: 'Lower Parel',
      description: 'Historic mill district transformed into modern business hub',
      image: '/images/10.jpeg',
      properties: '160+ Properties',
      area: 'South Mumbai'
    },
    {
      id: 'goregaon-east',
      name: 'Goregaon East',
      description: 'Emerging business hub with excellent connectivity and affordable options',
      image: '/images/8.jpeg',
      properties: '140+ Properties',
      area: 'West Mumbai'
    },
    {
      id: 'ghatkopar',
      name: 'Ghatkopar',
      description: 'Well-connected suburb with metro connectivity and growing business district',
      image: '/images/9.jpeg',
      properties: '170+ Properties',
      area: 'Central Mumbai'
    },
    {
      id: 'powai',
      name: 'Powai',
      description: 'IT hub with modern infrastructure, lake views and premium amenities',
      image: '/images/12.jpeg',
      properties: '130+ Properties',
      area: 'Central Mumbai'
    }
  ];

  const localMumbaiImages = [
    '/images/mumbai1.jpg',
    '/images/mumbai2.jpg',
    '/images/mumbai3.jpg',
    '/images/mumbai4.jpg',
    '/images/mumbai5.jpg',
    '/images/mumbai6.jpg',
    '/images/mumbai7.jpg',
    '/images/mumbai8.jpg',
  ];

  // Explicit unique image mapping per area (no repeats)
  const imageMap: Record<string, string> = {
    bkc: '/images/mumbai3.jpg',          // BKC uses Thane image as requested
    powai: '/images/mumbai1.jpg',
    ghatkopar: '/images/mumbai2.jpg',
    'andheri-east': '/images/mumbai4.jpg',
    'lower-parel': '/images/mumbai5.jpg',
    'goregaon-east': '/images/mumbai6.jpg',
    thane: '/images/mumbai7.jpg',
  };

  // Ensure order: BKC, Powai, Ghatkopar first, then the rest
  const priorityOrder = ['bkc', 'powai', 'ghatkopar'];
  const baseOrdered = [...mumbaiPlaces].sort((a, b) => {
    const pa = priorityOrder.indexOf(a.id);
    const pb = priorityOrder.indexOf(b.id);
    const aPriority = pa === -1 ? Infinity : pa;
    const bPriority = pb === -1 ? Infinity : pb;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return 0;
  });

  // Compute concrete image for each place (no repeats per imageMap), then
  // bring last three images (mumbai8, mumbai7, mumbai6) to the front in order
  const lastThreeFirst = ['/images/mumbai8.jpg', '/images/mumbai7.jpg', '/images/mumbai6.jpg'];
  const withImages = baseOrdered.map((p, i) => ({
    place: p,
    image: imageMap[p.id] ?? (i < localMumbaiImages.length ? localMumbaiImages[i] : localMumbaiImages[localMumbaiImages.length - 1]),
    originalIndex: i,
  }));
  const orderedItems = withImages.sort((a, b) => {
    const ai = lastThreeFirst.indexOf(a.image);
    const bi = lastThreeFirst.indexOf(b.image);
    const ag = ai === -1 ? 1 : 0;
    const bg = bi === -1 ? 1 : 0;
    if (ag !== bg) return ag - bg; // group with lastThreeFirst first
    if (ag === 0 && bg === 0) return ai - bi; // maintain 8,7,6 order
    return a.originalIndex - b.originalIndex; // then original order
  });

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore{' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Mumbai&apos;s
            </span>{' '}
            Prime Locations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most sought-after neighborhoods in the city of dreams
          </p>
        </div>

        {/* Horizontal Scrollable Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Cards Container */}
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide px-4 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {orderedItems.map((item, index) => (
              <div
                key={item.place.id}
                onMouseEnter={() => setHoveredPlace(item.place.id)}
                onMouseLeave={() => setHoveredPlace(null)}
                className={`group relative flex-shrink-0 w-80 h-96 rounded-3xl overflow-hidden shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#a08efe]/30 cursor-pointer ${
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
                />
                
                {/* Light Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Content positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {/* Area Tag */}
                  <div className="mb-3">
                    <span className="bg-orange-400 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                      {item.place.area}
                    </span>
                  </div>

                  {/* Place Name */}
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.place.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/90 text-sm mb-3 leading-relaxed">
                    {item.place.description}
                  </p>

                  {/* Properties Count and Get Offer Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300 font-semibold text-sm">
                      {item.place.properties}
                    </span>
                    <button
                      onClick={() => handleGetOffer(item.place.name)}
                      className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg shadow-purple-500/30 hover:shadow-cyan-400/40 transition-all duration-300"
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


        {/* Popup Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ✕
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Enter your details to request callback
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Our workspace experts will get in touch to help you with your requirements.
                </p>
              </div>

              {/* Offer Details */}
              <div className="text-center mb-6">
                <div className="mb-2">
                  <span className="text-gray-700 font-medium">Offer valid till </span>
                  <span className="text-orange-500 font-bold">Saturday</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-red-500 font-bold">
                    <span className="line-through">One Month Rent</span>
                  </div>
                  <div className="text-green-600 font-bold text-lg">
                    Zero Brokerage
                  </div>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Enter Your Name *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Enter Your Mobile No *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Enter Your Email Id *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-600">
                    <option value="">Team Size *</option>
                    <option value="1-5">1-5 People</option>
                    <option value="6-10">6-10 People</option>
                    <option value="11-20">11-20 People</option>
                    <option value="21-50">21-50 People</option>
                    <option value="50+">50+ People</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-900 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  Request Callback
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </form>

              {/* Trust Indicator */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your data is 100% Safe with us!
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
