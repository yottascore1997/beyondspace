'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { Poppins } from 'next/font/google';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';

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
  sublocation?: string | null;
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
  location?: string;
  locationDetails?: string;
  metroStationDistance?: string | null;
  railwayStationDistance?: string | null;
  googleMapLink?: string | null;
  aboutWorkspace?: string;
  workspaceTimings?: string | null;
  propertyOptions?: SeatingPlan[] | null;
  isActive?: boolean;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  coworking: 'Coworking',
  managed: 'Managed Office',
  dedicateddesk: 'Dedicated Desk',
  flexidesk: 'Flexi Desk',
  virtualoffice: 'Virtual Office',
  meetingroom: 'Meeting Room',
  enterpriseoffices: 'Enterprise Offices',
};

const formatCategoryLabel = (key: string) => CATEGORY_LABELS[key.toLowerCase()] ?? key;

// Helper function to parse workspace timings
const parseWorkspaceTimings = (timings: string | null | undefined): {
  monFri: string | null;
  saturday: string | null;
  sunday: string | null;
} => {
  if (!timings) {
    return {
      monFri: null,
      saturday: null,
      sunday: null,
    };
  }

  const parts = timings.split('|').map(part => part.trim());
  let monFri: string | null = null;
  let saturday: string | null = null;
  let sunday: string | null = null;

  parts.forEach(part => {
    const lowerPart = part.toLowerCase();
    if (lowerPart.includes('mon-fri') || lowerPart.includes('mon - fri')) {
      monFri = part.replace(/mon-fri:?\s*/i, '').replace(/mon - fri:?\s*/i, '').trim();
    } else if (lowerPart.includes('sat')) {
      saturday = part.replace(/sat:?\s*/i, '').trim();
    } else if (lowerPart.includes('sun')) {
      sunday = part.replace(/sun:?\s*/i, '').trim();
    }
  });

  return { monFri, saturday, sunday };
};

export default function PropertyDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    type: '',
    seats: ''
  });
  const [contactIsSubmitting, setContactIsSubmitting] = useState(false);
  const [contactSubmitMessage, setContactSubmitMessage] = useState('');
  const [contactSubmitError, setContactSubmitError] = useState('');
  const [isCountryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [isModalCountryDropdownOpen, setModalCountryDropdownOpen] = useState(false);
  const [modalCountryCode, setModalCountryCode] = useState('+91');
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);
  const modalCountryDropdownRef = useRef<HTMLDivElement | null>(null);
  const amenitiesRef = useRef<HTMLDivElement | null>(null);
  const similarPropertiesRef = useRef<HTMLDivElement | null>(null);
  const contactFormRef = useRef<HTMLDivElement | null>(null);

  // Fixed positioning - make form container stick when it reaches top
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const formContainer = contactFormRef.current;
    if (!formContainer) {
      console.log('Form container not found');
      return;
    }
    
    const parentColumn = formContainer.parentElement;
    if (!parentColumn) {
      console.log('Parent column not found');
      return;
    }
    
    let initialTop = 0;
    let initialLeft = 0;
    let initialWidth = 0;
    let isFixed = false;
    let hasInitialized = false;
    
    const updatePosition = () => {
      if (window.innerWidth < 1024) {
        formContainer.style.position = '';
        formContainer.style.top = '';
        formContainer.style.left = '';
        formContainer.style.width = '';
        formContainer.style.zIndex = '';
        isFixed = false;
        hasInitialized = false;
        return;
      }
      
      const formRect = formContainer.getBoundingClientRect();
      const columnRect = parentColumn.getBoundingClientRect();
      const gridContainer = parentColumn.parentElement;
      const scrollY = window.scrollY;
      const viewportTop = 100; // Account for sticky header height (approximately 80-100px)
      
      // Initialize position on first load - store the natural position
      if (!hasInitialized) {
        initialTop = formRect.top + scrollY; // Natural scroll position where form starts
        initialLeft = columnRect.left;
        initialWidth = columnRect.width;
        hasInitialized = true;
      }
      
      // Always update left and width from current column position
      initialLeft = columnRect.left;
      initialWidth = columnRect.width;
      
      // Check if similar properties section is visible - form should stick until similar properties appears
      const similarPropsSection = similarPropertiesRef.current;
      let shouldStopSticky = false;
      if (similarPropsSection) {
        const similarPropsRect = similarPropsSection.getBoundingClientRect();
        // If similar properties section top is in viewport or approaching, stop sticky
        // Form should unfix when similar properties section comes into view
        if (similarPropsRect.top < window.innerHeight) {
          shouldStopSticky = true;
        }
      }
      
      // Check if we've scrolled past the form's natural starting position
      // Form should only become fixed when its natural position reaches viewport top
      const naturalFormTop = initialTop - scrollY; // Where form would be in normal flow
      const shouldBeFixed = naturalFormTop <= viewportTop && scrollY >= initialTop - viewportTop && !shouldStopSticky;
      
      if (shouldBeFixed) {
        // Use fixed positioning - but only if we've scrolled past the natural position
        if (!isFixed) {
          isFixed = true;
          console.log('Form is now fixed at natural position');
        }
        // Force fixed positioning with !important via setProperty
        formContainer.style.setProperty('position', 'fixed', 'important');
        formContainer.style.setProperty('top', `${viewportTop}px`, 'important');
        formContainer.style.setProperty('left', `${initialLeft}px`, 'important');
        formContainer.style.setProperty('width', `${initialWidth}px`, 'important');
        formContainer.style.setProperty('z-index', '10', 'important');
        formContainer.style.setProperty('margin', '0', 'important');
      } else {
        // Form shouldn't be fixed - use normal flow
        if (isFixed) {
          isFixed = false;
          if (shouldStopSticky) {
            console.log('Form unfixed - amenities/similar properties section');
          } else {
            console.log('Form is back to normal flow');
          }
        }
        formContainer.style.removeProperty('position');
        formContainer.style.removeProperty('top');
        formContainer.style.removeProperty('left');
        formContainer.style.removeProperty('width');
        formContainer.style.removeProperty('z-index');
        formContainer.style.removeProperty('margin');
      }
    };
    
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Recalculate on resize
        const columnRect = parentColumn.getBoundingClientRect();
        initialLeft = columnRect.left;
        initialWidth = columnRect.width;
        hasInitialized = false; // Reset to recalculate initialTop
        updatePosition();
      } else {
        formContainer.style.cssText = '';
        isFixed = false;
        hasInitialized = false;
      }
    };
    
    // Initial setup
    updatePosition();
    
    // Add event listeners
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Update after delays
    const timeout1 = setTimeout(updatePosition, 100);
    const timeout2 = setTimeout(updatePosition, 500);
    const timeout3 = setTimeout(updatePosition, 1000);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', handleResize);
    };
  }, [property]);

  const workspaceTypes = [
    'Coworking Space',
    'Managed Office',
    'Dedicated Desk',
    'Enterprise Offices',
    'Virtual Office',
    'Meeting Room',
    'Day Pass / Flexi Desk'
  ];

  const seatOptions = ['1-5', '6-10', '11-20', '21-50', '50-70', '120+'];
  const countryCodes: Array<{ code: string; name: string; flag: string; isoCode: string }> = [
    { code: '+91', name: 'India', flag: 'https://flagcdn.com/w80/in.png', isoCode: 'IN' },
    { code: '+65', name: 'Singapore', flag: 'https://flagcdn.com/w80/sg.png', isoCode: 'SG' },
    { code: '+44', name: 'United Kingdom', flag: 'https://flagcdn.com/w80/gb.png', isoCode: 'GB' },
    { code: '+61', name: 'Australia', flag: 'https://flagcdn.com/w80/au.png', isoCode: 'AU' },
    { code: '+1', name: 'Canada', flag: 'https://flagcdn.com/w80/ca.png', isoCode: 'CA' },
    { code: '+49', name: 'Germany', flag: 'https://flagcdn.com/w80/de.png', isoCode: 'DE' },
    { code: '+31', name: 'Netherlands', flag: 'https://flagcdn.com/w80/nl.png', isoCode: 'NL' },
    { code: '+971', name: 'United Arab Emirates', flag: 'https://flagcdn.com/w80/ae.png', isoCode: 'AE' },
    { code: '+1', name: 'United States', flag: 'https://flagcdn.com/w80/us.png', isoCode: 'US' }
  ];

  const handleEnquireClick = () => {
    const formFields = document.getElementById('contact-form-fields');
    if (formFields) {
      // Only trigger shake animation on form fields, not the entire frame
      formFields.classList.add('animate-shake');
      setTimeout(() => {
        formFields.classList.remove('animate-shake');
      }, 400);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCountryDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setCountryDropdownOpen(false);
      }
      if (
        modalCountryDropdownRef.current &&
        !modalCountryDropdownRef.current.contains(event.target as Node)
      ) {
        setModalCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);


  const handleContactInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setContactSubmitMessage('');
    setContactSubmitError('');
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setContactIsSubmitting(true);
    setContactSubmitMessage('');
    setContactSubmitError('');

    try {
      const solution = contactFormData.type && contactFormData.seats
        ? `${contactFormData.type} - ${contactFormData.seats} seats`
        : contactFormData.type || contactFormData.seats || 'General Inquiry';

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: contactFormData.name,
          mobile: `${contactFormData.countryCode} ${contactFormData.phone}`,
          email: contactFormData.email,
          solution,
          message: `Type: ${contactFormData.type || 'Not specified'}, Seats: ${contactFormData.seats || 'Not specified'}`
        })
      });

      if (response.ok) {
        setContactSubmitMessage('Thank you for your inquiry! We will contact you soon.');
        setContactFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '+91',
          type: '',
          seats: ''
        });
        setCountryDropdownOpen(false);
      } else {
        const errorData = await response.json();
        setContactSubmitError(errorData.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setContactSubmitError('Network error. Please try again.');
    } finally {
      setContactIsSubmitting(false);
    }
  };

  const fetchProperty = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        // Debug: Log property categories
        if (process.env.NODE_ENV === 'development') {
          console.log('[Property Fetch] Property Categories:', data.categories);
          console.log('[Property Fetch] Property Options:', data.propertyOptions?.length, 'plans');
        }
        setProperty(data);
        
        // Fetch similar properties from the same area
        if (data.area) {
          fetchSimilarProperties(data.area, data.id);
        }
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

  const fetchSimilarProperties = async (area: string, currentPropertyId: string) => {
    try {
      setLoadingSimilar(true);
      const response = await fetch(`/api/properties?city=Mumbai`);
      
      if (response.ok) {
        const allProperties = await response.json();
        // Filter properties from the same area, excluding current property
        const similar = allProperties
          .filter((p: Property) => 
            p.area.toLowerCase() === area.toLowerCase() && 
            p.id !== currentPropertyId &&
            p.isActive !== false
          )
          .slice(0, 8); // Show max 8 similar properties
        
        setSimilarProperties(similar);
      }
    } catch (error) {
      console.error('Error fetching similar properties:', error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const selectedCountry = countryCodes.find(country => country.code === contactFormData.countryCode) || countryCodes[0];
  const selectedModalCountry = countryCodes.find(country => country.code === modalCountryCode) || countryCodes[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-16 sm:h-20 md:h-24"></div>
        <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 py-8" style={{ maxWidth: '1920px', width: '100%' }}>
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
        <div className="h-16 sm:h-20 md:h-24"></div>
        <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 py-8" style={{ maxWidth: '1920px', width: '100%' }}>
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
      <style jsx global>{`
        @keyframes smooth-slide {
          0% { transform: translateX(0); }
          25% { transform: translateX(-15px); }
          50% { transform: translateX(15px); }
          75% { transform: translateX(-8px); }
          100% { transform: translateX(0); }
        }

        .animate-shake {
          animation: smooth-slide 0.4s ease-in-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }

        @keyframes backdropFade {
          from { background-color: rgba(0, 0, 0, 0); }
          to { background-color: rgba(0, 0, 0, 0.85); }
        }

        @keyframes imageSlide {
          from { 
            opacity: 0; 
            transform: translateX(20px);
          }
          to { 
            opacity: 1; 
            transform: translateX(0);
          }
        }

        .gallery-image {
          animation: imageSlide 0.3s ease-out;
        }

        .gallery-modal-container {
          max-width: 900px !important;
        }

        @media (min-width: 1536px) {
          .gallery-modal-container {
            max-width: 1200px !important;
          }
        }

        /* Force sticky positioning for contact form */
        @media (min-width: 1024px) {
          .contact-form-sticky-wrapper {
            /* Don't force sticky here - let JavaScript handle it */
            height: fit-content !important;
          }
          
          /* Ensure parent grid allows sticky */
          .main-content-grid {
            align-items: start !important;
            display: grid !important;
            overflow: visible !important;
          }
          
          /* Ensure grid column allows sticky */
          div[class*="lg:col-span-4"] {
            position: relative !important;
            height: fit-content !important;
            overflow: visible !important;
          }
        }
      `}</style>
      <Header />
      <div className="h-16 sm:h-20 md:h-24"></div>
      
      <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 pt-2 pb-5" style={{ maxWidth: '1920px', width: '100%', overflow: 'visible' }}>
        {/* Breadcrumb */}
        <nav className="mb-3">
          <ol className="flex items-center space-x-1.5 text-sm md:text-base text-gray-900 font-bold">
            <li><Link href="/" className="hover:text-gray-800 text-gray-900 font-bold">Home</Link></li>
            <li className="text-gray-700">/</li>
            <li>
              <Link 
                href={searchParams.get('category') ? `/category/${searchParams.get('category')}` : '/'} 
                className="hover:text-gray-800 text-gray-900 font-bold"
              >
                Properties
              </Link>
            </li>
            <li className="text-gray-700">/</li>
            <li className="text-gray-900 font-bold">{property.title}</li>
          </ol>
        </nav>

        {/* Full Width Images Section - Isolated Container */}
        <div 
          className="w-full mb-3 lg:mb-4" 
          style={{ 
            display: 'block', 
            position: 'relative', 
            zIndex: 0, 
            clear: 'both',
            overflow: 'visible'
          }}
        >
          <div 
            className="relative w-full" 
            style={{ 
              display: 'block',
              position: 'relative',
              overflow: 'visible'
            }}
          >
              {/* Get all available images */}
              {(() => {
                const allImages = property.propertyImages && property.propertyImages.length > 0
                  ? [property.image, ...property.propertyImages.map(img => img.imageUrl).filter(img => img !== property.image)]
                  : [property.image];

                return (
              <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6 w-full" 
                style={{ 
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {/* Large Image (Left) */}
                <div 
                  className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group h-[400px] md:h-[450px] lg:h-[450px] xl:h-[450px] 2xl:h-[450px]"
                  style={{ borderRadius: '1rem' }}
                  onClick={() => setShowGallery(true)}
                >
                    <img
                    src={allImages[0]}
                      alt={property.title}
                    className="w-full h-full object-cover object-center"
                    />
                  {/* View All Images Button */}
                        <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowGallery(true);
                    }}
                    className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-white hover:scale-105 transition-all duration-300 z-10"
                        >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                    View All Images
                        </button>
                </div>

                {/* 2x2 Grid of Smaller Images (Right) */}
                <div className="grid grid-cols-2 grid-rows-2 gap-1.5 xl:gap-2 h-[400px] md:h-[450px] lg:h-[450px] xl:h-[450px] 2xl:h-[450px]">
                  {allImages.slice(1, 5).map((image, index) => (
                    <div 
                      key={index} 
                      className="relative rounded-xl overflow-hidden shadow-md cursor-pointer h-full"
                      style={{ borderRadius: '0.75rem' }}
                      onClick={() => {
                        setCurrentImageIndex(index + 1);
                        setShowGallery(true);
                      }}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 2}`}
                        className="w-full h-full object-cover object-center"
                      />
                      {/* View All Photos Button on the last image */}
                      {index === 3 && allImages.length > 5 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index + 1);
                            setShowGallery(true);
                          }}
                          className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-sm font-semibold rounded-xl group hover:bg-black/70 transition-colors z-10"
                        >
                          <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          View All Photos
                        </button>
                      )}
                    </div>
                  ))}
                  {/* Fill remaining spots if less than 4 small images */}
                  {allImages.slice(1, 5).length < 4 && Array.from({ length: 4 - allImages.slice(1, 5).length }).map((_, i) => (
                    <div key={`placeholder-${i}`} className="bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-md h-full">
                      No Image
                    </div>
                        ))}
                      </div>
                      </div>
                );
              })()}
            </div>
        </div>
        {/* End of Images Section - All content below this point */}
        <div style={{ clear: 'both', height: '0', overflow: 'hidden', margin: '0', padding: '0' }}></div>

        {/* Main Content Section - Starts after images section */}
        <div 
          className="main-content-grid grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mt-3" 
          style={{ 
            clear: 'both',
            alignItems: 'start',
            position: 'relative',
            overflow: 'visible'
          }}
        >
          {/* Property Details - Left Side */}
          <div className="lg:col-span-8">
            {/* Property Header */}
            <div className="mb-5">
            {/* Property Title */}
              <h1 className="text-base md:text-lg lg:text-xl 2xl:text-xl font-bold text-gray-900 mb-0.5 2xl:mb-0.5 leading-tight">
              {property.title}
            </h1>
            
              {/* Sub Location, Area, City with Google Maps Button */}
              <div className="flex items-center justify-between gap-3 2xl:gap-3 mb-4 2xl:mb-4 flex-wrap">
                <div className="flex items-center gap-1 2xl:gap-1 text-sm md:text-base 2xl:text-base font-medium text-gray-600 flex-wrap">
              {property.sublocation && (
                <>
                  <span>{property.sublocation}</span>
                      <span className="text-gray-500">,</span>
                </>
              )}
              <span>{property.area}</span>
                  <span className="text-gray-500">,</span>
              <span>{property.city}</span>
                </div>
            </div>

            {/* Metro Station and Railway Station */}
              {(property.metroStationDistance || property.railwayStationDistance) && (
                <div className="mb-4 flex flex-col sm:flex-row gap-4 2xl:gap-6">
                  {property.metroStationDistance && (
                    <div className="flex items-start gap-4 2xl:gap-5 flex-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 2xl:p-5 border border-orange-200 shadow-sm">
                      <div className="w-14 h-14 2xl:w-16 2xl:h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                        <img 
                          src="/images/mumbai-metro.jpg" 
                          alt="Mumbai Metro" 
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            // Fallback to a metro train image if file doesn't exist
                            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Mumbai_Metro_Logo.svg/200px-Mumbai_Metro_Logo.svg.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm 2xl:text-base font-bold text-gray-800 uppercase tracking-wide mb-2.5 2xl:mb-3">
                          Metro Station
                        </p>
                        <div className="space-y-2 2xl:space-y-2.5">
                          {property.metroStationDistance.split('/').map((seg, i) => {
                            const text = seg.trim();
                            if (!text) return null;
                            return (
                              <div key={i} className="text-sm 2xl:text-base text-gray-700 font-semibold leading-relaxed">
                                {text}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {property.railwayStationDistance && (
                    <div className="flex items-start gap-4 2xl:gap-5 flex-1 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 2xl:p-5 border border-orange-200 shadow-sm ml-auto">
                      <div className="w-14 h-14 2xl:w-16 2xl:h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
                        <img 
                          src="/images/mumbai-railway.jpg" 
                          alt="Mumbai Railway" 
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            // Fallback to Indian Railways logo if file doesn't exist
                            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Indian_Railways_logo.svg/200px-Indian_Railways_logo.svg.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm 2xl:text-base font-bold text-gray-800 uppercase tracking-wide mb-2.5 2xl:mb-3">
                          Railway Station
                        </p>
                        <div className="space-y-2 2xl:space-y-2.5">
                          {property.railwayStationDistance.split('/').map((seg, i) => {
                            const text = seg.trim();
                            if (!text) return null;
                            return (
                              <div key={i} className="text-sm 2xl:text-base text-gray-700 font-semibold leading-relaxed">
                                {text}
                              </div>
                            );
                          })}
                      </div>
                </div>
            </div>
            )}
              </div>
            )}
            </div>

            {/* Seating Plans Section */}
            {property.propertyOptions && property.propertyOptions.length > 0 ? (() => {
              // Get category from URL if available (user came from category page)
              const urlCategory = searchParams.get('category');
              
              // Filter seating plans based on property categories or URL category
              const propertyCategories = Array.isArray(property.categories)
                ? property.categories.map((cat: string) => typeof cat === 'string' ? cat.toLowerCase() : String(cat).toLowerCase())
                : [];

              // Normalize URL category
              const normalizeCategory = (cat: string | null): string | null => {
                if (!cat) return null;
                const cleaned = cat.toLowerCase().replace(/[^a-z0-9]/g, '');
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

              const activeCategory = normalizeCategory(urlCategory);

              // Debug: Log property categories for filtering
              if (process.env.NODE_ENV === 'development') {
                console.log('[Seating Plan Filter] URL Category:', activeCategory);
                console.log('[Seating Plan Filter] Property Categories:', propertyCategories);
                console.log('[Seating Plan Filter] Total Plans:', property.propertyOptions?.length);
              }

              // Map seating plan title to property categories that should show this plan
              // This matches the category filtering logic we implemented
              const getSeatingPlanCategory = (title: string): string[] => {
                const titleLower = title.toLowerCase();
                
                // Dedicated Desk: shows in Dedicated Desk, Coworking-Space categories
                if (titleLower.includes('dedicated desk')) return ['dedicateddesk', 'coworking'];
                
                // Flexi Desk: shows in Flexi Desk, Day Pass, Coworking-Space categories
                if (titleLower.includes('flexi desk')) return ['flexidesk', 'daypass', 'coworking'];
                
                // Private Cabin: shows in Private Cabin, Dedicated Desk, Coworking-Space categories
                if (titleLower.includes('private cabin')) return ['privatecabin', 'dedicateddesk', 'coworking'];
                
                // Virtual Office: only shows in Virtual Office, Coworking-Space categories
                if (titleLower.includes('virtual office')) return ['virtualoffice', 'coworking'];
                
                // Meeting Room: only shows in Meeting Room category
                if (titleLower.includes('meeting room')) return ['meetingroom'];
                
                // Managed Office Space: only shows in Managed Office category
                if (titleLower.includes('managed office')) return ['managed'];
                
                // Day Pass: only shows in Day Pass category (not in Coworking)
                if (titleLower.includes('day pass')) return ['daypass'];
                
                return [];
              };

              const shouldShowSeatingPlan = (plan: SeatingPlan): boolean => {
                const planCategories = getSeatingPlanCategory(plan.title);
                if (planCategories.length === 0) return false; // Don't show if no category match found

                // If URL has category filter, only show plans for that category
                if (activeCategory) {
                  // Check if plan's allowed categories include the active category from URL
                  const shouldShow = planCategories.includes(activeCategory);
                  
                  if (process.env.NODE_ENV === 'development') {
                    console.log(`[Seating Plan Filter] Plan: "${plan.title}"`);
                    console.log(`  URL Category: ${activeCategory}`);
                    console.log(`  Allowed Categories: [${planCategories.join(', ')}]`);
                    console.log(`  Should Show: ${shouldShow}`);
                    console.log('---');
                  }
                  
                  return shouldShow;
                }

                // If property has no categories, don't show any plans
                if (propertyCategories.length === 0) {
                  return false;
                }

                // Check if any property category matches any of the plan's allowed categories
                const shouldShow = planCategories.some(planCat => propertyCategories.includes(planCat));
                
                // Debug logging
                if (process.env.NODE_ENV === 'development') {
                  console.log(`[Seating Plan Filter] Plan: "${plan.title}"`);
                  console.log(`  Allowed Categories: [${planCategories.join(', ')}]`);
                  console.log(`  Property Categories: [${propertyCategories.join(', ')}]`);
                  console.log(`  Should Show: ${shouldShow}`);
                  console.log('---');
                }
                
                return shouldShow;
              };

              const filteredPlans = (property.propertyOptions || []).filter(shouldShowSeatingPlan);

              if (filteredPlans.length === 0) return null;

              // Separate Meeting Room plans from other plans
              const meetingRoomPlans = filteredPlans.filter(plan => 
                plan.title.toLowerCase().includes('meeting room')
              );
              const otherPlans = filteredPlans.filter(plan => 
                !plan.title.toLowerCase().includes('meeting room')
              );

              // Combine Meeting Room plans into one
              let combinedMeetingRoom: SeatingPlan & { seatingPrices?: Record<string, string> } | null = null;
              if (meetingRoomPlans.length > 0) {
                const firstMeetingRoom = meetingRoomPlans[0];
                // Collect all seating options with their prices from all meeting room plans
                const seatingWithPrices: Record<string, string> = {};
                meetingRoomPlans.forEach(plan => {
                  if (plan.seating && plan.price) {
                    const seatingOption = plan.seating.trim();
                    seatingWithPrices[seatingOption] = plan.price;
                  }
                });
                
                // Get all unique seating options and sort by seat count
                const uniqueSeatingOptions = Object.keys(seatingWithPrices).sort((a, b) => {
                  const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                  const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                  return numA - numB;
                });
                
                combinedMeetingRoom = {
                  ...firstMeetingRoom,
                  seating: uniqueSeatingOptions.join(', '),
                  seatingPrices: seatingWithPrices,
                };
              }

              // Sort other plans: Virtual Office should be last
              const sortedOtherPlans = [...otherPlans].sort((a, b) => {
                const aIsVirtual = a.title.toLowerCase().includes('virtual office');
                const bIsVirtual = b.title.toLowerCase().includes('virtual office');
                if (aIsVirtual && !bIsVirtual) return 1; // Virtual Office goes to end
                if (!aIsVirtual && bIsVirtual) return -1;
                return 0; // Keep original order for others
              });

              const finalPlans = [...(combinedMeetingRoom ? [combinedMeetingRoom] : []), ...sortedOtherPlans];

              return (
            <div className="mb-5">
              <h3 className="text-base md:text-lg 2xl:text-base 2xl:md:text-lg font-semibold text-gray-900 mb-3 2xl:mb-3 mt-4 2xl:mt-4">Seating Plans</h3>
              
                    {finalPlans.map((plan, index) => {
                  // Map seating plan titles to default images
                  const getImageForPlan = (title: string) => {
                    const titleLower = title.toLowerCase();
                    if (titleLower.includes('meeting room')) return '/images/seating/meeting.jpeg';
                    if (titleLower.includes('private cabin')) return '/images/seating/privatecabin.jpeg';
                    if (titleLower.includes('dedicated desk')) return '/images/seating/dedicated.jpeg';
                    if (titleLower.includes('flexi desk')) return '/images/seating/flexidesk.jpeg';
                    if (titleLower.includes('managed office')) return '/images/seating/managedoffice.jpeg';
                    if (titleLower.includes('virtual office')) return '/images/4.jpeg';
                    return '/images/seating/dedicated.jpeg'; // default
                  };

                  const isMeetingRoom = plan.title.toLowerCase().includes('meeting room');
                  const isSingleMeetingRoom = finalPlans.length === 1 && isMeetingRoom;
                  const isManagedOffice = plan.title.toLowerCase().includes('managed office');
                  const isPrivateCabin = plan.title.toLowerCase().includes('private cabin');
                  const isSingleManagedOffice = finalPlans.length === 1 && isManagedOffice;
                  const isSinglePrivateCabin = finalPlans.length === 1 && isPrivateCabin;
                  const isDayPass = plan.title.toLowerCase().includes('day pass');
                  const isFlexiDesk = plan.title.toLowerCase().includes('flexi desk');
                  const isVirtualOffice = plan.title.toLowerCase().includes('virtual office');
                  const isStandardPlan = ['dedicated desk', 'flexi desk', 'day pass', 'virtual office'].some(type => plan.title.toLowerCase().includes(type));
                  
                  // Get price suffix based on plan type
                  const getPriceSuffix = () => {
                    if (isDayPass) return '/seat/Day';
                    if (isFlexiDesk) return '/seat/month';
                    if (isVirtualOffice) return '/Year';
                    if (isMeetingRoom) return '/Hour';
                    if (isPrivateCabin) return '/seat/month';
                    return '/seat/month'; // default
                  };
                  
                  // Parse Managed Office description for A), B), C) points
                  const parseManagedOfficeDescription = (desc: string) => {
                    const lines = desc.split('\n').filter(line => line.trim());
                    const points: string[] = [];
                    let finalText = '';
                    
                    lines.forEach(line => {
                      const trimmed = line.trim();
                      if (trimmed.match(/^[A-C]\)/)) {
                        points.push(trimmed);
                      } else if (trimmed.toLowerCase().startsWith('to know more')) {
                        finalText = trimmed;
                      }
                    });
                    
                    return { points, finalText };
                  };

                  // Parse Private Cabin description for bullet points
                  const parsePrivateCabinDescription = (desc: string) => {
                    const lines = desc.split('\n');
                    const points: string[] = [];
                    let currentPoint = '';
                    let finalText = '';
                    
                    lines.forEach(line => {
                      const trimmed = line.trim();
                      if (trimmed.toLowerCase().startsWith('to know more')) {
                        finalText = trimmed;
                      } else if (trimmed.startsWith('.')) {
                        // Save previous point if exists
                        if (currentPoint) {
                          points.push(currentPoint.trim());
                        }
                        // Start new point
                        currentPoint = trimmed.substring(1).trim();
                      } else if (trimmed && currentPoint) {
                        // Continue current point if line doesn't start with "."
                        currentPoint += ' ' + trimmed;
                      }
                    });
                    
                    // Add last point
                    if (currentPoint) {
                      points.push(currentPoint.trim());
                    }
                    
                    return { points, finalText };
                  };

                  return (
                    <div
                      key={index}
                      className={`${
                        isSingleManagedOffice || isSinglePrivateCabin
                          ? 'bg-gradient-to-br from-white via-indigo-50/40 via-blue-50/60 to-purple-50/40 rounded-xl shadow-xl border-2 border-indigo-200/60'
                          : 'bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-xl border border-blue-200'
                      } ${
                        isSingleMeetingRoom 
                          ? 'py-6 2xl:py-8 px-4 2xl:px-6' 
                          : isSingleManagedOffice || isSinglePrivateCabin
                          ? 'py-4 2xl:py-5 px-4 2xl:px-5'
                          : 'py-2 2xl:py-2 px-2 2xl:px-2'
                      } ${
                        index < finalPlans.length - 1 ? 'mb-3 2xl:mb-3' : ''
                      }`}
                    >
                      <div className={`flex flex-col md:flex-row 2xl:flex-row gap-3 2xl:gap-4 ${
                        isSingleMeetingRoom ? 'gap-4 2xl:gap-6' : isSingleManagedOffice || isSinglePrivateCabin ? 'gap-3 2xl:gap-4' : ''
                      }`}>
                        {/* Image on Left - Square */}
                        <div className={`${
                          isSingleMeetingRoom ? 'md:w-1/3 2xl:w-1/3' 
                          : isSingleManagedOffice || isSinglePrivateCabin ? 'md:w-1/4 2xl:w-1/4'
                          : 'md:w-1/4 2xl:w-1/4'
                        } flex-shrink-0 aspect-[4/3]`}>
                          <img 
                            src={getImageForPlan(plan.title)} 
                            alt={plan.title} 
                            className={`w-full h-full object-cover rounded-xl shadow-md ${
                              isSingleMeetingRoom ? 'rounded-2xl' : isSingleManagedOffice || isSinglePrivateCabin ? 'rounded-xl' : 'rounded-lg'
                            }`}
                          />
                        </div>

                        {/* Content on Right */}
                        <div className={`${
                          isSingleMeetingRoom ? 'md:w-2/3 2xl:w-2/3' 
                          : isSingleManagedOffice || isSinglePrivateCabin ? 'md:w-3/4 2xl:w-3/4'
                          : 'md:w-3/4 2xl:w-3/4'
                        } flex flex-col relative min-h-0`}>
                          {/* Left Side - Title and Content */}
                          <div className={`flex-1 pr-2 2xl:pr-2 ${
                            isSingleMeetingRoom ? 'pt-1 2xl:pt-1 pb-2 2xl:pb-2' : isStandardPlan ? 'pt-1 2xl:pt-1 pb-1 2xl:pb-1' : 'pt-2 2xl:pt-2 pb-2 2xl:pb-2'
                          }`}>
                            <h4 className={`${
                              isSingleMeetingRoom 
                                ? 'text-xl md:text-2xl 2xl:text-2xl font-bold' 
                                : isSingleManagedOffice || isSinglePrivateCabin
                                ? 'text-lg md:text-xl 2xl:text-xl font-bold text-gray-900'
                                : isStandardPlan
                                ? 'text-base md:text-lg 2xl:text-base 2xl:md:text-lg font-bold text-gray-900'
                                : 'text-base md:text-lg 2xl:text-base 2xl:md:text-lg font-semibold'
                            } ${isSingleManagedOffice || isSinglePrivateCabin ? '' : 'text-gray-900'} ${isStandardPlan ? 'mb-2 2xl:mb-2' : 'mb-2 2xl:mb-2.5'}`}>
                              {plan.title}
                            </h4>
                            
                            {plan.description && (
                              isManagedOffice || isPrivateCabin ? (
                                (() => {
                                  let displayPoints: string[] = [];
                                  let finalText = '';
                                  
                                  if (isPrivateCabin) {
                                    // For Private Cabin, use Private Cabin parser
                                    const { points: cabinPoints, finalText: cabinFinalText } = parsePrivateCabinDescription(plan.description);
                                    displayPoints = cabinPoints.map((p, idx) => {
                                      const labels = ['A', 'B', 'C'];
                                      return `${labels[idx]}) ${p}`;
                                    });
                                    // If no finalText in description, use default message
                                    finalText = cabinFinalText || "To know more about private cabin, reach out to us, and let's discuss how our private cabin solutions can cater to your specific business needs.";
                                  } else {
                                    // For Managed Office, use Managed Office parser
                                    const parsed = parseManagedOfficeDescription(plan.description);
                                    displayPoints = parsed.points;
                                    finalText = parsed.finalText;
                                  }
                                  
                                  if (displayPoints.length === 0) {
                                    // Fallback: show description as plain text if no points found
                                    return (
                                      <p className={`text-gray-700 ${isStandardPlan ? 'mb-2.5 2xl:mb-3' : 'mb-3 2xl:mb-3'} ${
                                        isSingleMeetingRoom 
                                          ? 'text-base 2xl:text-lg font-normal leading-relaxed' 
                                          : isStandardPlan
                                          ? 'text-sm 2xl:text-sm font-normal leading-relaxed line-clamp-2'
                                          : 'text-sm 2xl:text-sm font-normal leading-snug line-clamp-2'
                                      }`}>
                                        {plan.description}
                                      </p>
                                    );
                                  }
                                  
                                  return (
                                    <div className="mb-3 2xl:mb-4">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 2xl:gap-3">
                                        {displayPoints.map((point, idx) => {
                                          const pointText = point.replace(/^[A-C]\)\s*/, '');
                                          const pointLabel = point.match(/^([A-C])\)/)?.[1] || '';
                                          // Different gradient colors for each point
                                          const badgeGradients = [
                                            'from-blue-500 via-blue-600 to-indigo-600',
                                            'from-purple-500 via-purple-600 to-indigo-600',
                                            'from-indigo-500 via-indigo-600 to-blue-600'
                                          ];
                                          return (
                                            <div key={idx} className="flex flex-col items-center text-center bg-gradient-to-br from-white to-blue-50/50 rounded-lg p-2.5 2xl:p-3 border-2 border-blue-200/60 hover:border-blue-500 hover:from-white hover:to-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                                              <div className={`flex-shrink-0 w-7 h-7 2xl:w-8 2xl:h-8 rounded-full bg-gradient-to-br ${badgeGradients[idx]} flex items-center justify-center shadow-md mb-2 ring-2 ring-white/50`}>
                                                <span className="text-white font-bold text-xs 2xl:text-sm">{pointLabel}</span>
                                              </div>
                                              <p className="text-xs 2xl:text-sm text-gray-800 leading-snug font-medium">
                                                {pointText}
                                              </p>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      {finalText && (
                                        <div className="mt-3 2xl:mt-3.5 p-3 2xl:p-3.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 rounded-lg shadow-sm border border-blue-200/60">
                                          <p className="text-xs 2xl:text-sm text-gray-800 leading-snug font-semibold text-center">
                                            {finalText}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                <p className={`text-gray-700 ${isStandardPlan ? 'mb-2.5 2xl:mb-3' : 'mb-3 2xl:mb-3'} ${
                                  isSingleMeetingRoom 
                                    ? 'text-base 2xl:text-lg font-normal leading-relaxed' 
                                    : isStandardPlan
                                    ? 'text-sm 2xl:text-sm font-normal leading-relaxed line-clamp-2'
                                    : 'text-sm 2xl:text-sm font-normal leading-snug line-clamp-2'
                                }`}>
                                  {plan.description}
                                </p>
                              )
                            )}
                            
                            {(plan.seating || isManagedOffice || isPrivateCabin || isStandardPlan) && (
                              <div className={`${
                                isSingleMeetingRoom ? 'text-base 2xl:text-lg' : isStandardPlan ? 'text-sm 2xl:text-sm' : 'text-sm 2xl:text-sm'
                              } font-medium ${isStandardPlan ? 'mt-2 2xl:mt-2.5' : 'mt-3 2xl:mt-4'}`}>
                                {isMeetingRoom ? (
                                  <div className="flex items-center gap-2 mb-4 2xl:mb-5">
                                    <div className="flex items-center justify-center w-8 h-8 2xl:w-10 2xl:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
                                      <svg className="w-4 h-4 2xl:w-5 2xl:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                    </div>
                                    <span className={`${
                                      isSingleMeetingRoom ? 'text-lg 2xl:text-xl' : 'text-base 2xl:text-lg'
                                    } font-bold text-gray-800`}>Available Seating Options</span>
                                  </div>
                                ) : null}
                                {isManagedOffice || isPrivateCabin ? (
                                  <div className="bg-white rounded-lg p-4 2xl:p-5 border-2 border-blue-200/60 shadow-sm">
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-2">
                                        <div className="flex-shrink-0 w-6 h-6 2xl:w-7 2xl:h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                                          <svg className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                          </svg>
                                        </div>
                                        <span className="text-xs 2xl:text-sm font-medium text-gray-600">Seating :</span>
                                        <span className="text-sm 2xl:text-base font-semibold text-gray-800">
                                          {plan.seating && plan.seating.trim() !== '' 
                                            ? (plan.seating.split(',')[0]?.trim() || plan.seating)
                                            : '2, 4, 8, 10 to 30+'
                                          }
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        {(() => {
                                          // Check if price exists and is valid
                                          const priceValue = plan.price;
                                          
                                          // Debug logging
                                          if (process.env.NODE_ENV === 'development' && isPrivateCabin) {
                                            console.log('[Private Cabin Price Debug]', {
                                              priceValue,
                                              type: typeof priceValue,
                                              isNull: priceValue === null,
                                              isUndefined: priceValue === undefined,
                                              isEmpty: priceValue === '',
                                              stringValue: String(priceValue),
                                              trimmed: String(priceValue).trim()
                                            });
                                          }
                                          
                                          // More lenient check - just ensure it exists and is not empty
                                          const hasValidPrice = priceValue != null && 
                                                               priceValue !== '' && 
                                                               String(priceValue).trim() !== '';
                                          
                                          if (!hasValidPrice) {
                                            if (process.env.NODE_ENV === 'development' && isPrivateCabin) {
                                              console.log('[Private Cabin] Price not valid, returning null');
                                            }
                                            return null;
                                          }
                                          
                                          // Format price
                                          const priceStr = String(priceValue).trim();
                                          const priceNum = parseFloat(priceStr);
                                          const formattedPrice = isNaN(priceNum) ? priceStr : priceNum.toLocaleString('en-IN');
                                          
                                          if (process.env.NODE_ENV === 'development' && isPrivateCabin) {
                                            console.log('[Private Cabin] Rendering price:', formattedPrice);
                                          }
                                          
                                          return (
                                            <div className="text-right flex items-baseline gap-1">
                                              <span className="text-base 2xl:text-lg font-bold text-gray-900 font-sans">₹</span>
                                              <span className="text-base 2xl:text-lg font-bold text-gray-900">
                                                {formattedPrice}
                                              </span>
                                              <span className="text-sm 2xl:text-base font-normal text-gray-600 ml-0.5 2xl:ml-0.5">{getPriceSuffix()}</span>
                                            </div>
                                          );
                                        })()}
                                        <button
                                          type="button"
                                          onClick={handleEnquireClick}
                                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 2xl:px-5 py-2 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                                        >
                                          Enquire Now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : isMeetingRoom ? (
                                  <div className="flex flex-wrap gap-2 2xl:gap-2.5">
                                    {plan.seating.split(',').map((s) => {
                                      const label = s.trim();
                                      if (!label) return null;
                                      const seatingPrice = (plan as SeatingPlan & { seatingPrices?: Record<string, string> }).seatingPrices?.[label];
                                      return (
                                        <div 
                                          key={label} 
                                          className="group relative flex-1 min-w-[110px] max-w-[140px] 2xl:min-w-[125px] 2xl:max-w-[155px] overflow-hidden bg-white rounded-lg border border-gray-200 hover:border-blue-500 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                        >
                                          {/* Top accent bar */}
                                          <div className="h-1 2xl:h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                                          
                                          {/* Content */}
                                          <div className="relative p-3 2xl:p-3.5 flex flex-col">
                                            {/* Seating Count */}
                                            <div className="flex items-center gap-1.5 mb-2 2xl:mb-2.5">
                                              <div className="flex-shrink-0 w-6 h-6 2xl:w-7 2xl:h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                                                <svg className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                              </div>
                                              <span className="text-sm 2xl:text-base font-semibold text-gray-800 leading-tight">
                                                {label}
                                              </span>
                                            </div>
                                            
                                            {/* Price */}
                                            {seatingPrice && (
                                              <div className="mt-auto pt-2 2xl:pt-2.5 border-t border-gray-100">
                                                <div className="flex items-baseline gap-0.5">
                                                  <span className="text-xs 2xl:text-sm font-semibold text-gray-700 font-sans">₹</span>
                                                  <span className="text-base 2xl:text-lg font-bold text-gray-900">
                                                    {seatingPrice}
                                                  </span>
                                                  <span className="text-xs 2xl:text-sm font-normal text-gray-600">/Hour</span>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : isStandardPlan ? (
                                  <div className="bg-white rounded-lg p-4 2xl:p-5 border-2 border-blue-200/60 shadow-sm">
                                    <div className="flex items-center justify-between gap-4">
                                      {plan.seating && plan.seating.trim() !== '' && (
                                        <div className="flex items-center gap-2">
                                          <div className="flex-shrink-0 w-6 h-6 2xl:w-7 2xl:h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                                            <svg className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                          </div>
                                          <span className="text-sm 2xl:text-base font-medium text-gray-600">Seating :</span>
                                          <span className="text-base 2xl:text-lg font-semibold text-gray-800">
                                            {plan.seating.split(',')[0]?.trim() || plan.seating}
                                          </span>
                                        </div>
                                      )}
                                      <div className={`flex items-center gap-3 ${!plan.seating || plan.seating.trim() === '' ? 'ml-auto' : ''}`}>
                                        {(() => {
                                          // Check if price exists and is valid
                                          const priceValue = plan.price;
                                          const hasValidPrice = priceValue != null && 
                                                               priceValue !== '' && 
                                                               String(priceValue).trim() !== '';
                                          
                                          if (!hasValidPrice) return null;
                                          
                                          // Format price
                                          const priceStr = String(priceValue).trim();
                                          const priceNum = parseFloat(priceStr.replace(/[₹,\s]/g, ''));
                                          const formattedPrice = isNaN(priceNum) ? priceStr : priceNum.toLocaleString('en-IN');
                                          
                                          return (
                                            <div className="text-right flex items-baseline gap-1">
                                              <span className="text-base 2xl:text-lg font-bold text-gray-900 font-sans">₹</span>
                                              <span className="text-base 2xl:text-lg font-bold text-gray-900">
                                                {formattedPrice}
                                              </span>
                                              <span className="text-sm 2xl:text-base font-normal text-gray-600 ml-0.5 2xl:ml-0.5">{getPriceSuffix()}</span>
                                            </div>
                                          );
                                        })()}
                                        <button
                                          type="button"
                                          onClick={handleEnquireClick}
                                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 2xl:px-5 py-2 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                                        >
                                          Enquire Now
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-700">{plan.seating}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right Side - Price and Button */}
                          <div className={`absolute right-0 ${
                            isMeetingRoom ? 'top-0' : 'top-1/2 -translate-y-1/2'
                          } flex flex-col items-end`}>
                            {/* Don't show general price for Meeting Room, Managed Office, Private Cabin, and Standard Plans as we show them in seating section */}
                            {plan.price && !isMeetingRoom && !isManagedOffice && !isPrivateCabin && !isStandardPlan && (
                              <div className="text-right mb-1.5 2xl:mb-1.5">
                                <span className="text-base md:text-lg 2xl:text-base 2xl:md:text-lg font-bold text-gray-900">{plan.price}</span>
                                <span className="text-sm md:text-base 2xl:text-sm 2xl:md:text-base font-normal text-gray-600 ml-0.5 2xl:ml-0.5">{isVirtualOffice ? '/Year' : '/month'}</span>
                              </div>
                            )}
                            
                            {!isManagedOffice && !isPrivateCabin && !isStandardPlan && (
                              <button
                                type="button"
                                onClick={handleEnquireClick}
                                className={`${
                                  isSingleMeetingRoom
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 2xl:px-8 py-2.5 2xl:py-3 rounded-xl text-sm 2xl:text-base font-bold shadow-xl hover:from-blue-600 hover:to-blue-700 hover:shadow-2xl'
                                    : isMeetingRoom
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 2xl:px-5 py-2 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105'
                                    : 'bg-blue-400 text-white px-3 2xl:px-3 py-1 2xl:py-1 rounded-lg text-xs 2xl:text-xs font-semibold shadow-lg hover:bg-blue-500'
                                } transition-all duration-300 transform hover:scale-105`}
                              >
                                Enquire Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
              );
            })() : null}

            {/* Price Disclaimer */}
            <div className="mb-4">
              <p className={`${poppins.className} text-sm 2xl:text-sm text-gray-900 font-medium italic`}>*Prices mentioned above are starting prices & as per availability</p>
            </div>

            {/* Managed Office Space and Enterprise Solutions Section */}
            <div className="mb-5 2xl:mb-5 mt-6 2xl:mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-3 2xl:gap-3">
                {/* Managed Office Space Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mx-auto w-full max-w-lg 2xl:max-w-lg">
                  <div className="w-full h-48 md:h-56 lg:h-60 2xl:h-56 2xl:md:h-56 2xl:lg:h-60 overflow-hidden">
                    <img 
                      src="/images/amenity/image0.jpeg" 
                      alt="Managed Office Space" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 2xl:p-3 space-y-2 2xl:space-y-2">
                    <h4 className="text-base 2xl:text-base font-semibold text-gray-900">Managed Office Space</h4>
                    <p className="text-gray-600 text-sm 2xl:text-sm leading-relaxed">
                      An end-to-end office space solution customized to your needs including sourcing, design, building and operations
                    </p>
                    <button 
                      type="button"
                      onClick={handleEnquireClick}
                      className="w-full bg-blue-400 text-white py-2 2xl:py-2 px-4 2xl:px-4 rounded-lg text-xs 2xl:text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>

                {/* Enterprise Solutions Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mx-auto w-full max-w-lg 2xl:max-w-lg">
                  <div className="w-full h-48 md:h-56 lg:h-60 2xl:h-56 2xl:md:h-56 2xl:lg:h-60 overflow-hidden">
                    <img 
                      src="/images/amenity/image1.jpeg" 
                      alt="Enterprise Solutions" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 2xl:p-3 space-y-2 2xl:space-y-2">
                    <h4 className="text-base 2xl:text-base font-semibold text-gray-900">Enterprise Solutions</h4>
                    <p className="text-gray-600 text-sm 2xl:text-sm leading-relaxed">
                      Fully equipped offices for larger teams with flexibility to scale and customize your office in prime locations & LEED certified buildings
                    </p>
                    <button 
                      type="button"
                      onClick={handleEnquireClick}
                      className="w-full bg-blue-400 text-white py-2 2xl:py-2 px-4 2xl:px-4 rounded-lg text-xs 2xl:text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Why book coworking space with Beyond Space Section */}
            <div className="mb-5 2xl:mb-5 mt-5 2xl:mt-5">
              <h3 className="text-base md:text-lg 2xl:text-base 2xl:md:text-lg font-semibold text-gray-900 mb-3 2xl:mb-3">Why book coworking space with Beyond Space?</h3>
              <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-lg shadow-lg p-4 md:p-5 2xl:p-4 2xl:md:p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-3 gap-3 2xl:gap-3">
                  {/* Left Side - Points in 2x2 grid */}
                  <div className="md:col-span-2 2xl:col-span-2 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-2 2xl:gap-2">
                    <div className="flex items-start gap-2 2xl:gap-2">
                      <span className="text-green-600 text-base 2xl:text-base font-bold">✓</span>
                      <p className="text-gray-800 text-xs 2xl:text-xs font-medium">Exclusive Pricing & Zero Booking fee</p>
                    </div>
                    <div className="flex items-start gap-2 2xl:gap-2">
                      <span className="text-green-600 text-base 2xl:text-base font-bold">✓</span>
                      <p className="text-gray-800 text-xs 2xl:text-xs font-medium">Guided Office Space Tours</p>
                    </div>
                    <div className="flex items-start gap-2 2xl:gap-2">
                      <span className="text-green-600 text-base 2xl:text-base font-bold">✓</span>
                      <p className="text-gray-800 text-xs 2xl:text-xs font-medium">Verified Spaces and Trusted Operators</p>
                    </div>
                    <div className="flex items-start gap-2 2xl:gap-2">
                      <span className="text-green-600 text-base 2xl:text-base font-bold">✓</span>
                      <p className="text-gray-800 text-xs 2xl:text-xs font-medium">Dedicated Relationship Manager</p>
                    </div>
                  </div>
                  {/* Right Side - Button */}
                  <div className="flex items-center justify-center md:justify-end 2xl:justify-end">
                    <button
                      type="button"
                      onClick={handleEnquireClick}
                      className="bg-blue-400 text-white py-2 2xl:py-2 px-5 2xl:px-5 rounded-lg text-xs 2xl:text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {(property.aboutWorkspace || property.description) && (
              <div className="mb-5 2xl:mb-5">
                <h3 className="text-lg md:text-xl 2xl:text-lg 2xl:md:text-xl font-semibold text-gray-900 mb-2 2xl:mb-2">About Space</h3>
                <p className="text-gray-700 text-base 2xl:text-base font-normal leading-relaxed">
                  {property.aboutWorkspace || property.description}
                </p>
              </div>
            )}

            {/* Location Details */}
            <div className="mb-5 2xl:mb-5">
              <h3 className="text-lg md:text-xl 2xl:text-lg 2xl:md:text-xl font-semibold text-gray-900 mb-2 2xl:mb-2">Location Details</h3>
              <p className="text-gray-700 text-base 2xl:text-base font-normal">
                {property.locationDetails || property.area}
              </p>
            </div>

            {/* Google Maps Section - Below Location Details */}
            {property && (() => {
              // Helper function to get Google Maps embed URL
              const getMapEmbedUrl = () => {
                // If googleMapLink is provided and is already an embed URL, use it directly
                if (property.googleMapLink && property.googleMapLink.includes('/embed')) {
                  return property.googleMapLink;
                }
                
                // If googleMapLink is a regular Google Maps URL, try to extract location
                if (property.googleMapLink) {
                  // Try to extract coordinates from URL
                  const coordMatch = property.googleMapLink.match(/@([-\d.]+),([-\d.]+)/);
                  if (coordMatch) {
                    return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
                  }
                  
                  // Try to extract place ID
                  const placeMatch = property.googleMapLink.match(/place\/([^\/\?]+)/);
                  if (placeMatch) {
                    return `https://www.google.com/maps?q=place_id:${encodeURIComponent(placeMatch[1])}&output=embed`;
                  }
                }
                
                // Fallback: Create embed URL from location details (no API key needed)
                const locationQuery = property.locationDetails || `${property.sublocation ? property.sublocation + ', ' : ''}${property.area}, ${property.city}`;
                return `https://www.google.com/maps?q=${encodeURIComponent(locationQuery)}&output=embed`;
              };

              const locationText = property.locationDetails || `${property.sublocation ? property.sublocation + ', ' : ''}${property.area}, ${property.city}`;

              return (
                <div className="mb-5 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden">
                  <div className="w-full h-[200px] md:h-[250px] lg:h-[300px]">
                    <iframe
                      src={getMapEmbedUrl()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                      title={`Map showing location of ${property.title}`}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Benefits Section */}
            <div className="mb-5 2xl:mb-5">
              <div className="bg-gradient-to-br from-orange-100 via-pink-100 to-pink-200 rounded-lg shadow-lg p-4 md:p-5 2xl:p-4 2xl:md:p-5">
                <div className="flex flex-col md:flex-row 2xl:flex-row gap-3 2xl:gap-3 items-start md:items-center 2xl:items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm 2xl:text-sm font-medium mb-1.5 2xl:mb-1.5">Explore flexible workspace solutions just for you in Mumbai</p>
                    <p className="text-gray-800 text-sm 2xl:text-sm font-medium">Zero pressure advice, recommendations and negotiations at no extra cost</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleEnquireClick}
                    className="bg-blue-400 text-white py-2 2xl:py-2 px-5 2xl:px-5 rounded-lg text-xs 2xl:text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300 whitespace-nowrap"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>

            {/* Office Timing Section */}
            {property.workspaceTimings && (() => {
              const { monFri, saturday, sunday } = parseWorkspaceTimings(property.workspaceTimings);
              return (
            <div className="mb-5 2xl:mb-5">
              <h3 className="text-lg md:text-xl 2xl:text-lg 2xl:mb-3 font-semibold text-gray-900 mb-3">Office Timing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-3 gap-2 2xl:gap-2">
                {/* Monday to Friday */}
                <div className="p-3 2xl:p-3 bg-white rounded-lg shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 2xl:gap-2 mb-1.5 2xl:mb-1.5">
                    <div className="w-8 h-8 2xl:w-8 2xl:h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500">
                      <svg className="w-4 h-4 2xl:w-4 2xl:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm 2xl:text-sm">Mon - Fri</p>
                      <p className="text-xs 2xl:text-xs text-gray-600">Weekdays</p>
                    </div>
                  </div>
                      <p className="font-semibold text-gray-900 text-sm 2xl:text-sm">
                        {monFri || 'Not specified'}
                      </p>
                </div>

                {/* Saturday */}
                <div className="p-3 2xl:p-3 bg-white rounded-lg shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 2xl:gap-2 mb-1.5 2xl:mb-1.5">
                    <div className="w-8 h-8 2xl:w-8 2xl:h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
                      <svg className="w-4 h-4 2xl:w-4 2xl:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm 2xl:text-sm">Saturday</p>
                    </div>
                  </div>
                      <p className="font-semibold text-gray-900 text-sm 2xl:text-sm">
                        {saturday || 'Not specified'}
                      </p>
                </div>

                {/* Sunday */}
                <div className="p-3 2xl:p-3 bg-white rounded-lg shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 2xl:gap-2 mb-1.5 2xl:mb-1.5">
                        {(() => {
                          const isClosed = sunday ? sunday.toLowerCase().includes('closed') : false;
                          return (
                            <>
                              <div className={`w-8 h-8 2xl:w-8 2xl:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isClosed
                                  ? 'bg-red-500' 
                                  : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
                              }`}>
                      <svg className="w-4 h-4 2xl:w-4 2xl:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {isClosed ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  )}
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm 2xl:text-sm">Sunday</p>
                    </div>
                            </>
                          );
                        })()}
                  </div>
                      <p className={`font-semibold text-sm 2xl:text-sm ${
                        sunday && sunday.toLowerCase().includes('closed')
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}>
                        {sunday || 'Not specified'}
                      </p>
                </div>
              </div>
            </div>
              );
            })()}

            {/* Amenities Section */}
            <div ref={amenitiesRef} className="mb-8 2xl:mb-8">
              <h3 className="text-xl 2xl:text-xl font-semibold text-gray-900 mb-5 2xl:mb-5">Amenities</h3>
              
              <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-2xl p-6 2xl:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4 2xl:gap-4">
                {/* High Speed WiFi */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/wify.jpeg" 
                      alt="WiFi" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">High Speed WiFi</span>
                </div>

                {/* Meeting Rooms */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/meetingroom.PNG" 
                      alt="Meeting Rooms" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Meeting Rooms</span>
                </div>

                {/* Ergo Workstations */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-orange-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/workstation.jpeg" 
                      alt="Ergo Workstations" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Ergo Workstations</span>
                </div>

                {/* Printer */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/printer.jpg" 
                      alt="Printer" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Printer</span>
                </div>

                {/* Car / Bike Parking */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/carparking.PNG" 
                      alt="Car / Bike Parking" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Car / Bike Parking</span>
                </div>

                {/* Pantry */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/pantry.png" 
                      alt="Pantry" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Pantry</span>
                </div>

                {/* Housekeeping */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/housekeeping.jpeg" 
                      alt="Housekeeping" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Housekeeping</span>
                </div>

                {/* Reception */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-red-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/reception.PNG" 
                      alt="Reception" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Reception</span>
                </div>

                {/* Air Conditioning */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/aircooler.jpg" 
                      alt="Air Conditioning" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Air Conditioning</span>
                </div>

                {/* Tea/Coffee */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-orange-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/cofee.jpg" 
                      alt="Tea/Coffee" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Tea/Coffee</span>
                </div>

                {/* Phone Booth */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/phonebooth.jpeg" 
                      alt="Phone Booth" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Phone Booth</span>
                </div>

                {/* Lounge */}
                <div className="flex items-center gap-3 2xl:gap-3 p-4 2xl:p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-14 h-14 2xl:w-16 2xl:h-16 bg-pink-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src="/images/amenity/loungue.jpeg" 
                      alt="Lounge" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<svg class="w-8 h-8 2xl:w-10 2xl:h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
                        }
                      }}
                    />
                  </div>
                  <span className="font-medium 2xl:font-medium text-gray-900 2xl:text-sm">Lounge</span>
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div 
            className="lg:col-span-4 lg:order-2" 
            style={{ alignSelf: 'start', position: 'relative', height: 'fit-content' }}
          >
            <div 
              ref={contactFormRef}
              className="contact-form-sticky-wrapper"
            >
              <div id="contact-form-section" className="bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 rounded-xl shadow-2xl border-2 border-blue-200/50 p-5 2xl:p-5 relative overflow-visible">
                {/* Background Pattern Container - with overflow-hidden for decorative elements only */}
                <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sky-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
                  <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                </div>
              
              <div className="relative z-10">
                <div className="mb-4 2xl:mb-4">
                  <h4 className="text-sm md:text-base 2xl:text-sm 2xl:md:text-base font-semibold text-black mb-1.5 2xl:mb-1.5">Tell Us About Your Workspace Needs</h4>
                  <p className="text-xs 2xl:text-xs text-gray-700">Share your requirements and we'll tailor a proposal for you.</p>
                </div>

                <form id="contact-form-fields" onSubmit={handleContactSubmit} className="space-y-3 2xl:space-y-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactInputChange}
                      placeholder="Enter your name"
                      required
                      className="w-full px-3 2xl:px-3 py-2 2xl:py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm 2xl:text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={contactFormData.email}
                      onChange={handleContactInputChange}
                      placeholder="Enter your email"
                      required
                      className="w-full px-3 2xl:px-3 py-2 2xl:py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm 2xl:text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <div className="flex gap-2">
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen(prev => !prev)}
                          className="flex w-20 2xl:w-20 items-center gap-1 2xl:gap-1 rounded-lg border-2 border-gray-300 bg-white px-2 2xl:px-2 py-2 2xl:py-2 text-xs 2xl:text-xs font-semibold text-black shadow-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-7 h-5 object-contain rounded border border-gray-200" style={{ imageRendering: 'crisp-edges' }} />
                          <span>{selectedCountry.code}</span>
                          <svg
                            className={`ml-auto h-2.5 w-2.5 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isCountryDropdownOpen && (
                          <div className="absolute left-0 bottom-full z-50 mb-2 w-56 max-h-56 overflow-y-auto rounded-lg border border-blue-100 bg-white shadow-xl">
                            {countryCodes.map(country => (
                              <button
                                type="button"
                                key={country.code}
                                onClick={() => {
                                  setContactFormData(prev => ({ ...prev, countryCode: country.code }));
                                  setCountryDropdownOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition hover:bg-blue-50"
                              >
                                <img src={country.flag} alt={country.name} className="w-8 h-6 object-contain rounded border border-gray-200 flex-shrink-0" style={{ imageRendering: 'crisp-edges' }} />
                                <div className="flex flex-col">
                                  <span className="text-xs font-semibold text-gray-900">{country.name}</span>
                                  <span className="text-[10px] text-gray-500">{country.code}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    <input
                      type="tel"
                        name="phone"
                        value={contactFormData.phone}
                        onChange={handleContactInputChange}
                        placeholder="Enter your phone number"
                        required
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <select
                        name="type"
                        value={contactFormData.type}
                        onChange={handleContactInputChange}
                        className="w-full px-3 2xl:px-3 py-2 2xl:py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm 2xl:text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 appearance-none shadow-sm"
                      >
                        <option value="">Select Type</option>
                        {workspaceTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                      <select
                        name="seats"
                        value={contactFormData.seats}
                        onChange={handleContactInputChange}
                        className="w-full px-3 2xl:px-3 py-2 2xl:py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm 2xl:text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 appearance-none shadow-sm"
                      >
                        <option value="">Select Seats</option>
                        {seatOptions.map(option => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {contactSubmitMessage && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800">{contactSubmitMessage}</p>
                  </div>
                  )}

                  {contactSubmitError && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-800">{contactSubmitError}</p>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={contactIsSubmitting}
                    className={`w-full py-2.5 2xl:py-2.5 px-4 2xl:px-4 rounded-lg font-semibold text-sm 2xl:text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
                      contactIsSubmitting ? 'bg-blue-300 cursor-not-allowed text-white' : 'bg-blue-400 text-white hover:bg-blue-500'
                    }`}
                  >
                    {contactIsSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-gray-200">
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-900 text-center">Connect with our space expert</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-orange-50 via-pink-50 to-pink-100 rounded-lg flex-shrink-0">
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <div>
                        <p className="text-[10px] text-gray-500 mb-0.5">Contact</p>
                        <p className="text-xs font-semibold text-gray-900">+91 98765 43210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-orange-50 via-pink-50 to-pink-100 rounded-lg flex-1">
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] text-gray-500 mb-0.5">Email</p>
                        <p className="text-xs font-semibold text-gray-900 break-words">contact@beyondspacework.com</p>
                      </div>
                    </div>
                  </div>

            </div>
            </div>

          </div>
        </div>
      </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section ref={similarPropertiesRef} className="pt-6 pb-12 md:pt-8 md:pb-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12" style={{ maxWidth: '1920px', width: '100%' }}>
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                Similar Properties in {property?.area}
              </h2>
              <p className="text-gray-600 text-xs md:text-sm">
                Explore more properties in the same area
              </p>
            </div>

            {loadingSimilar ? (
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-80 bg-white rounded-xl shadow-md animate-pulse">
                    <div className="h-64 bg-gray-300 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {similarProperties.map((similarProperty) => (
                  <div key={similarProperty.id} className="flex-shrink-0 w-80">
                    <PropertyCard
                      property={similarProperty}
                      hideCategory={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />

      {/* Gallery Modal Popup */}
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
          <div 
            className={`${poppins.className} fixed inset-0 z-50 flex items-center justify-center p-4`}
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0)',
              animation: 'backdropFade 0.3s ease-out forwards'
            }}
            onClick={() => setShowGallery(false)}
          >
            {/* Popup Container - Fixed Aspect Ratio */}
            <div 
              className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl relative overflow-hidden flex items-center justify-center gallery-modal-container"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                width: '70vw',
                height: '80vh',
                maxHeight: '800px',
                opacity: 0,
                transform: 'scale(0.95)',
                animation: 'fadeInScale 0.4s ease-out 0.1s forwards'
              }}
            >
              {/* Close Button - Top Right */}
              <button
                onClick={() => setShowGallery(false)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Main Image - Perfect Fit */}
              <img
                key={currentImageIndex}
                src={allImages[currentImageIndex]}
                alt={`${property.title} ${currentImageIndex + 1}`}
                className="w-full h-full object-contain gallery-image p-4"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />

                {/* Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm z-10"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Dots Indicator */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                    {allImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
            </div>
          </div>
        );
      })()}

      {/* Modal Popup */}
      {isModalOpen && (
        <div 
          className={`${poppins.className} fixed inset-0 flex items-center justify-center z-50 p-4`}
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-50 flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Panel - Office Space Features */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex-1 rounded-l-2xl">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Find Your Perfect Office Now!</h2>
                <p className="text-black text-lg">Our space experts will provide customized quote with detailed inventory as per your needs</p>
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
                <h3 className="text-lg md:text-xl font-semibold text-black mb-2">Tell Us About Your Workspace Needs</h3>
                <p className="text-gray-600">Share your requirements and we'll tailor a proposal for you.</p>
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
                    <div className="relative" ref={modalCountryDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setModalCountryDropdownOpen(prev => !prev)}
                        className="flex w-32 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <img src={selectedModalCountry.flag} alt={selectedModalCountry.name} className="w-8 h-6 object-contain rounded border border-gray-200" style={{ imageRendering: 'crisp-edges' }} />
                        <span>{selectedModalCountry.code}</span>
                        <svg
                          className={`ml-auto h-3 w-3 transition-transform ${isModalCountryDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isModalCountryDropdownOpen && (
                        <div className="absolute left-0 bottom-full z-30 mb-2 w-64 max-h-64 overflow-y-auto rounded-xl border border-blue-100 bg-white shadow-2xl">
                          {countryCodes.map(country => (
                            <button
                              type="button"
                              key={`modal-${country.code}`}
                              onClick={() => {
                                setModalCountryCode(country.code);
                                setModalCountryDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-blue-50"
                            >
                              <img src={country.flag} alt={country.name} className="w-8 h-6 object-contain rounded border border-gray-200 flex-shrink-0" style={{ imageRendering: 'crisp-edges' }} />
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">{country.name}</span>
                                <span className="text-xs text-gray-500">{country.code}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
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
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-orange-500 text-base">hello@beyondspacework.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}



