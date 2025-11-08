'use client';

import { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

interface PropertyImage {
  id: string;
  imageUrl: string;
  propertyId: string;
  createdAt: string;
}

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

interface SeatingPlan {
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
  location?: string;
  locationDetails?: string;
  aboutWorkspace?: string;
  propertyOptions?: SeatingPlan[] | null;
  createdAt: string;
}

interface PrimeLocation {
  name: string;
  slug: string;
  image: string;
}

const primeLocations: PrimeLocation[] = [
  { name: 'Thane', slug: 'thane', image: '/images/mumbai7.jpeg' },
  { name: 'Navi Mumbai', slug: 'navi mumbai', image: '/images/mumbai8.jpeg' },
  { name: 'Andheri West', slug: 'andheri west', image: '/images/mumbai4.jpeg' },
  { name: 'Andheri East', slug: 'andheri east', image: '/images/mumbai4.jpeg' },
  { name: 'Andheri', slug: 'andheri', image: '/images/mumbai4.jpeg' },
  { name: 'BKC', slug: 'bkc', image: '/images/mumbai3.jpeg' },
  { name: 'Lower Parel', slug: 'lower parel', image: '/images/mumbai5.jpeg' },
  { name: 'Powai', slug: 'powai', image: '/images/mumbai8.jpeg' }
];

const contactSliderImages = ['/images/1.jpeg', '/images/2.jpeg', '/images/3.jpeg', '/images/mumbai3.jpeg'];

export default function PropertyDetails() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactSlideIndex, setContactSlideIndex] = useState(0);

  const handleEnquireClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setContactSlideIndex((prev) => (prev + 1) % contactSliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleContactPrev = () => {
    setContactSlideIndex((prev) => (prev - 1 + contactSliderImages.length) % contactSliderImages.length);
  };

  const handleContactNext = () => {
    setContactSlideIndex((prev) => (prev + 1) % contactSliderImages.length);
  };

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        setError('Property not found');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
            >
              ← Back to Properties
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${poppins.className} min-h-screen bg-white`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
            <li>/</li>
            <li><Link href="/" className="hover:text-gray-700">Properties</Link></li>
            <li>/</li>
            <li className="text-gray-900">{property.title}</li>
          </ol>
        </nav>

        {/* Full Width Images Section */}
        <div className="relative mb-8">
              {/* Get all available images */}
              {(() => {
                const allImages = property.propertyImages && property.propertyImages.length > 0
                  ? [property.image, ...property.propertyImages.map(img => img.imageUrl).filter(img => img !== property.image)]
                  : [property.image];

                return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px] md:h-[600px] lg:h-[700px]">
                {/* Large Image (Left) */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group">
                    <img
                    src={allImages[0]}
                      alt={property.title}
                    className="w-full h-full object-cover"
                    />
                  {/* View All Images Button */}
                        <button
                    onClick={() => setShowGallery(true)}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md hover:bg-white hover:scale-105 transition-all duration-300"
                        >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                    View All Images
                        </button>
                </div>

                {/* 2x2 Grid of Smaller Images (Right) */}
                <div className="grid grid-cols-2 gap-2 h-full">
                  {allImages.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative rounded-xl overflow-hidden shadow-md">
                      <img
                        src={image}
                        alt={`${property.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                      {/* View All Photos Button on the last image */}
                      {index === 3 && allImages.length > 5 && (
                        <button
                          onClick={() => setShowGallery(true)}
                          className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-lg font-semibold rounded-xl group hover:bg-black/70 transition-colors"
                        >
                          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          View All Photos
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Fill remaining spots if less than 4 small images */}
                  {allImages.slice(1, 5).length < 4 && Array.from({ length: 4 - allImages.slice(1, 5).length }).map((_, i) => (
                    <div key={`placeholder-${i}`} className="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-md">
                      No Image
                    </div>
                        ))}
                      </div>
                      </div>
                );
              })()}
            </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details - Left Side */}
          <div className="lg:col-span-2">
            {/* Property Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {property.title}
            </h1>

            {/* Location */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Details</h3>
              <p className="text-gray-600 text-lg">
                {property.locationDetails || property.area}
              </p>
            </div>

            {/* Description */}
            {(property.aboutWorkspace || property.description) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600 text-lg">
                  {property.aboutWorkspace || property.description}
                </p>
              </div>
            )}

            {/* Seating Plans Section */}
            {property.propertyOptions && property.propertyOptions.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Seating Plans</h3>
              
                {property.propertyOptions.map((plan, index) => {
                  // Map seating plan titles to default images
                  const getImageForPlan = (title: string) => {
                    const titleLower = title.toLowerCase();
                    if (titleLower.includes('dedicated desk')) return '/images/1.jpeg';
                    if (titleLower.includes('private cabin')) return '/images/2.jpeg';
                    if (titleLower.includes('virtual office')) return '/images/4.jpeg';
                    return '/images/1.jpeg'; // default
                  };

                  return (
                    <div
                      key={index}
                      className={`bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-lg p-3 md:p-4 ${
                        index < property.propertyOptions!.length - 1 ? 'mb-3' : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-3">
                        {/* Image on Left - Square */}
                        <div className="md:w-1/5">
                          <img 
                            src={getImageForPlan(plan.title)} 
                            alt={plan.title} 
                            className="w-full aspect-square object-cover rounded-lg"
                          />
              </div>

                        {/* Content on Right */}
                        <div className="md:w-4/5 flex flex-col relative">
                          {/* Left Side - Title and Content */}
                          <div className="flex-1 pr-3 pt-2">
                            <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{plan.title}</h4>
                            
                            {plan.description && (
                              <p className="text-gray-800 mb-2 text-sm font-medium">{plan.description}</p>
                            )}
                            
                            {plan.seating && (
                              <p className="text-gray-600 mb-2 text-sm">
                                <span className="mr-1">👤</span>
                                <span>Seating : {plan.seating}</span>
                              </p>
                            )}
              </div>

                          {/* Right Side - Price and Button (Vertically Centered) */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end">
                            {plan.price && (
                              <div className="text-right mb-3">
                                <span className="text-2xl md:text-3xl font-bold text-gray-900">{plan.price}</span>
                                <span className="text-xl md:text-2xl font-normal text-gray-600 ml-1">/month</span>
                  </div>
                            )}
                            
                            <button
                              onClick={handleEnquireClick}
                              className="bg-blue-400 text-white px-6 py-2 rounded-lg text-base font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                            >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                  );
                })}
            </div>
            )}

            {/* Managed Office Space and Enterprise Solutions Section */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Managed Office Space Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mx-auto w-full max-w-lg">
                  <div className="w-full h-48 md:h-56 overflow-hidden">
                    <img 
                      src="/images/1.jpeg" 
                      alt="Managed Office Space" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <h4 className="text-xl font-semibold text-gray-900">Managed Office Space</h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      An end-to-end office space solution customized to your needs including sourcing, design, building and operations
                    </p>
                    <button 
                      onClick={() => {
                        const contactForm = document.querySelector('.lg\\:col-span-1');
                        if (contactForm) {
                          contactForm.scrollIntoView({ behavior: 'smooth' });
                          // Add strong shake animation
                          contactForm.style.animation = 'shake 0.8s ease-in-out';
                          setTimeout(() => {
                            contactForm.style.animation = '';
                          }, 800);
                        }
                      }}
                      className="w-full bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>

                {/* Enterprise Solutions Card */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mx-auto w-full max-w-lg">
                  <div className="w-full h-48 md:h-56 overflow-hidden">
                    <img 
                      src="/images/2.jpeg" 
                      alt="Enterprise Solutions" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <h4 className="text-xl font-semibold text-gray-900">Enterprise Solutions</h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Fully equipped offices for larger teams with flexibility to scale and customize your office in prime locations & LEED certified buildings
                    </p>
                    <button 
                      onClick={() => {
                        const contactForm = document.querySelector('.lg\\:col-span-1');
                        if (contactForm) {
                          contactForm.scrollIntoView({ behavior: 'smooth' });
                          // Add strong shake animation
                          contactForm.style.animation = 'shake 0.8s ease-in-out';
                          setTimeout(() => {
                            contactForm.style.animation = '';
                          }, 800);
                        }
                      }}
                      className="w-full bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Timing Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Office Timing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Monday to Friday */}
                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Mon - Fri</p>
                      <p className="text-xs text-gray-600">Weekdays</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">09:00 AM - 06:00 PM</p>
                </div>

                {/* Saturday */}
                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Sat</p>
                      <p className="text-xs text-gray-600">Saturday</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">09:00 AM - 06:00 PM</p>
                </div>

                {/* Sunday */}
                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Sun</p>
                      <p className="text-xs text-gray-600">Sunday</p>
                    </div>
                  </div>
                  <p className="font-semibold text-red-600 text-sm">Closed</p>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenities</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* High Speed WiFi */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">High Speed WiFi</span>
                </div>

                {/* Meeting Rooms */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Meeting Rooms</span>
                </div>

                {/* Ergo Workstations */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Ergo Workstations</span>
                </div>

                {/* Printer */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Printer</span>
                </div>

                {/* Car / Bike Parking */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Car / Bike Parking</span>
                </div>

                {/* Pantry */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Pantry</span>
                </div>

                {/* Housekeeping */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Housekeeping</span>
                </div>

                {/* Reception */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Reception</span>
                </div>

                {/* Air Conditioning */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Air Conditioning</span>
                </div>

                {/* Tea/Coffee */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Tea/Coffee</span>
                </div>

                {/* Phone Booth */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Phone Booth</span>
                </div>

                {/* Lounge */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Lounge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 rounded-2xl shadow-2xl border-2 border-blue-200/50 p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-sky-200/20 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
                    Get Office Spaces in Mumbai
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed font-medium">
                    Beyond Space Work Consultant assisted <span className="font-bold text-blue-600">150+ corporates</span> in Mumbai to move into their new office.
                  </p>
                </div>

                <form className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <select className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 appearance-none shadow-sm">
                      <option>Select Area</option>
                      <option>Andheri</option>
                      <option>Thane</option>
                      <option>Navi Mumbai</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      placeholder="Tell us about your requirements..."
                      rows={4}
                      className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 resize-none placeholder-gray-500 shadow-sm"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-400 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Connect with us
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">Connect with our space expert</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&q=80"
                      alt="Beyond Space expert"
                      className="w-10 h-10 rounded-full object-cover border border-blue-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-blue-600 font-semibold text-lg">contact@beyondspacework.com</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-10">
              <h4 className="text-lg font-semibold text-gray-900 text-center mb-4">Workspace Gallery</h4>
              <div className="relative">
                <div className="overflow-hidden rounded-2xl shadow-xl h-80 sm:h-96">
                  <img
                    src={contactSliderImages[contactSlideIndex]}
                    alt="Workspace highlight"
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                </div>
                {contactSliderImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handleContactPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:scale-110 transition-transform"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleContactNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:scale-110 transition-transform"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              {contactSliderImages.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {contactSliderImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setContactSlideIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === contactSlideIndex ? 'bg-blue-500 w-6' : 'bg-gray-300 w-2'
                      }`}
                      aria-label={`Go to workspace slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      <section className="py-12 md:py-16 bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Explore Top Coworking Locations in Mumbai</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {primeLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/area/${encodeURIComponent(location.slug)}`}
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
                  <h4 className="text-lg font-semibold text-gray-900">
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
            ))}
          </div>
        </div>
      </section>
 
      <Footer />

      {/* Simple Gallery Modal with Big Image and Next/Previous */}
      {showGallery && (() => {
        const allImages = property.propertyImages && property.propertyImages.length > 0
          ? [property.image, ...property.propertyImages.map(img => img.imageUrl).filter(img => img !== property.image)]
          : [property.image];

        const handleNext = () => {
          setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        };

        const handlePrevious = () => {
          setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
        };

        return (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold z-10">
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Previous Button */}
            {allImages.length > 1 && (
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Main Image */}
            <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
              <img
                src={allImages[currentImageIndex]}
                alt={`${property.title} ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        );
      })()}

      {/* Modal Popup */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-50 flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Panel - Office Space Features */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex-1 rounded-l-2xl">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Office Now!</h2>
                <p className="text-gray-700 text-lg">Our space experts will provide customized quote with detailed inventory as per your needs</p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">Customized Workspaces</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">Prime Locations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">Free Guided Tours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 font-medium">Flexible Terms</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Contact Form */}
            <div className="p-8 flex-1 relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Interested in this Property</h3>
                <p className="text-gray-600">Fill your details for a customized quote</p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                  <div className="flex gap-2">
                    <select className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      <option>+91</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300">
                      <option>Select Type</option>
                      <option>Coworking</option>
                      <option>Managed Office</option>
                      <option>Virtual Office</option>
                      <option>Meeting Room</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Of Seats</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300">
                      <option>Select Seats</option>
                      <option>1-5</option>
                      <option>6-10</option>
                      <option>11-20</option>
                      <option>21-50</option>
                      <option>50+</option>
                    </select>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg"
                >
                  Submit
                </button>
              </form>

              {/* Contact Expert Section */}
              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Connect with our space expert</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-blue-600 text-sm">hello@beyondspacework.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


