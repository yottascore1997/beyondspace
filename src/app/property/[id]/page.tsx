'use client';

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react';
import { Poppins } from 'next/font/google';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const countryCodes: Array<{ code: string; name: string; flag: string }> = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
    { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
    { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
    { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: '+972', name: 'Israel', flag: '🇮🇱' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦' },
    { code: '+975', name: 'Bhutan', flag: '🇧🇹' },
    { code: '+977', name: 'Nepal', flag: '🇳🇵' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹' },
    { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪' },
    { code: '+354', name: 'Iceland', flag: '🇮🇸' },
    { code: '+355', name: 'Albania', flag: '🇦🇱' },
    { code: '+356', name: 'Malta', flag: '🇲🇹' },
    { code: '+357', name: 'Cyprus', flag: '🇨🇾' },
    { code: '+358', name: 'Finland', flag: '🇫🇮' },
    { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
    { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
    { code: '+381', name: 'Serbia', flag: '🇷🇸' },
    { code: '+386', name: 'Slovenia', flag: '🇸🇮' },
    { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
    { code: '+853', name: 'Macau', flag: '🇲🇴' },
    { code: '+855', name: 'Cambodia', flag: '🇰🇭' },
    { code: '+856', name: 'Laos', flag: '🇱🇦' },
    { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
    { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
    { code: '+960', name: 'Maldives', flag: '🇲🇻' }
  ];

  const handleEnquireClick = () => {
    const formSection = document.getElementById('contact-form-section');
    if (formSection) {
      // Only trigger shake animation, no scrolling to prevent sticky form from shifting
      formSection.classList.add('animate-shake');
      setTimeout(() => {
        formSection.classList.remove('animate-shake');
      }, 600);
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

  const selectedCountry = countryCodes.find(country => country.code === contactFormData.countryCode) || countryCodes[0];
  const selectedModalCountry = countryCodes.find(country => country.code === modalCountryCode) || countryCodes[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
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
        @keyframes subtle-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }

        .animate-shake {
          animation: subtle-shake 0.6s ease-in-out;
        }
      `}</style>
      <Header />
      
      <div className="container mx-auto px-3 py-5 max-w-7xl" style={{ maxWidth: '1280px', width: 'calc(100% - 24px)' }}>
        {/* Breadcrumb */}
        <nav className="mb-3">
          <ol className="flex items-center space-x-1.5 text-xs text-gray-500">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[350px] md:h-[400px] lg:h-[450px]">
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
                    className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-white hover:scale-105 transition-all duration-300"
                        >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                    View All Images
                        </button>
                </div>

                {/* 2x2 Grid of Smaller Images (Right) */}
                <div className="grid grid-cols-2 gap-1.5 h-full">
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
                          className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-sm font-semibold rounded-xl group hover:bg-black/70 transition-colors"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Property Details - Left Side */}
          <div className="lg:col-span-7">
            {/* Property Header */}
            <div className="mb-5">
            {/* Property Title */}
              <h1 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 leading-tight">
              {property.title}
            </h1>
            
              {/* Sub Location, Area, City with Google Maps Button */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-600 flex-wrap">
              {property.sublocation && (
                <>
                  <span>{property.sublocation}</span>
                      <span className="text-gray-400">•</span>
                </>
              )}
              <span>{property.area}</span>
                  <span className="text-gray-400">•</span>
              <span>{property.city}</span>
                </div>
                {property.googleMapLink && (
                  <a
                    href={property.googleMapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-all duration-300 text-xs font-semibold shadow-md flex-shrink-0"
                  >
                    <div className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span>View on Google Maps</span>
                  </a>
                )}
            </div>

            {/* Metro Station and Railway Station */}
              {(property.metroStationDistance || property.railwayStationDistance) && (
                <div className="mb-4 flex flex-col sm:flex-row gap-3">
                  {property.metroStationDistance && (
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-xl">🚇</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Metro Station
                        </p>
                        <div className="space-y-1.5">
                          {property.metroStationDistance.split('/').map((seg, i) => {
                            const text = seg.trim();
                            if (!text) return null;
                            return (
                              <div key={i} className="text-sm text-gray-700 font-medium leading-relaxed">{text}</div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  {property.railwayStationDistance && (
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-xl">🚆</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Railway Station
                        </p>
                        <div className="space-y-1.5">
                          {property.railwayStationDistance.split('/').map((seg, i) => {
                            const text = seg.trim();
                            if (!text) return null;
                            return (
                              <div key={i} className="text-sm text-gray-700 font-medium leading-relaxed">{text}</div>
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
              const getSeatingPlanCategory = (title: string): string[] => {
                const titleLower = title.toLowerCase();
                // Dedicated Desk: shows if property has Private Cabin, Dedicated Desk, Flexi Desk, or Coworking
                if (titleLower.includes('dedicated desk')) return ['dedicateddesk', 'privatecabin', 'flexidesk', 'coworking'];
                // Flexi Desk: shows if property has Flexi Desk, Dedicated Desk, or Coworking
                if (titleLower.includes('flexi desk')) return ['flexidesk', 'dedicateddesk', 'coworking'];
                // Private Cabin: shows if property has Private Cabin, Dedicated Desk, Flexi Desk, or Coworking
                if (titleLower.includes('private cabin')) return ['privatecabin', 'dedicateddesk', 'flexidesk', 'coworking'];
                // Virtual Office: only shows if property has Virtual Office
                if (titleLower.includes('virtual office')) return ['virtualoffice'];
                // Meeting Room: only shows if property has Meeting Room
                if (titleLower.includes('meeting room')) return ['meetingroom'];
                // Managed Office Space: only shows if property has Managed
                if (titleLower.includes('managed office')) return ['managed'];
                // Day Pass: only shows if property has Day Pass
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

              const finalPlans = [...(combinedMeetingRoom ? [combinedMeetingRoom] : []), ...otherPlans];

              return (
            <div className="mb-5">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 mt-4">Seating Plans</h3>
              
                    {finalPlans.map((plan, index) => {
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
                      className={`bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-lg shadow-lg py-2 px-2 ${
                        index < finalPlans.length - 1 ? 'mb-3' : ''
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-2">
                        {/* Image on Left - Square */}
                        <div className="md:w-1/6 flex-shrink-0">
                          <img 
                            src={getImageForPlan(plan.title)} 
                            alt={plan.title} 
                            className="w-full aspect-square object-cover rounded-lg"
                          />
              </div>

                        {/* Content on Right */}
                        <div className="md:w-5/6 flex flex-col relative min-h-0">
                          {/* Left Side - Title and Content */}
                          <div className="flex-1 pr-2 pt-2 pb-2">
                            <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{plan.title}</h4>
                            
                            {plan.description && (
                              <p className="text-gray-700 mb-2 text-sm font-normal leading-snug line-clamp-2">{plan.description}</p>
                            )}
                            
                            {plan.seating && (
                              <div className="text-sm font-medium mt-1.5">
                                <span className="mr-2 inline-block align-middle">👤 Seating:</span>
                                {plan.title.toLowerCase().includes('meeting room') ? (
                                  <span className="inline-flex flex-wrap gap-2 align-middle">
                                    {plan.seating.split(',').map((s) => {
                                      const label = s.trim();
                                      if (!label) return null;
                                      const seatingPrice = (plan as SeatingPlan & { seatingPrices?: Record<string, string> }).seatingPrices?.[label];
                                      return (
                                        <span key={label} className="inline-flex flex-col items-center gap-0.5 px-1.5 py-1 rounded bg-white border border-blue-200 shadow-sm">
                                          <span className="text-[10px] font-semibold text-blue-700">
                                            {label}
                                          </span>
                                          {seatingPrice && (
                                            <span className="text-[10px] font-bold text-gray-900">
                                              {seatingPrice}
                                            </span>
                                          )}
                                        </span>
                                      );
                                    })}
                                  </span>
                                ) : (
                                  <span className="text-gray-700">{plan.seating}</span>
                                )}
                              </div>
                            )}
              </div>

                          {/* Right Side - Price and Button (Vertically Centered) */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-end">
                            {/* Don't show general price for Meeting Room as we show individual seating prices */}
                            {plan.price && !plan.title.toLowerCase().includes('meeting room') && (
                              <div className="text-right mb-1.5">
                                <span className="text-base md:text-lg font-bold text-gray-900">{plan.price}</span>
                                <span className="text-sm md:text-base font-normal text-gray-600 ml-0.5">/month</span>
                  </div>
                            )}
                            
                            <button
                        type="button"
                              onClick={handleEnquireClick}
                              className="bg-blue-400 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
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
              );
            })() : null}

            {/* Price Disclaimer */}
            <div className="mb-4">
              <p className={`${poppins.className} text-sm text-gray-600 italic`}>*Prices mentioned above are starting prices & as per availability</p>
            </div>

            {/* Managed Office Space and Enterprise Solutions Section */}
            <div className="mb-5 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Managed Office Space Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mx-auto w-full max-w-lg">
                  <div className="w-full h-40 md:h-48 overflow-hidden">
                    <img 
                      src="/images/1.jpeg" 
                      alt="Managed Office Space" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <h4 className="text-base font-semibold text-gray-900">Managed Office Space</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      An end-to-end office space solution customized to your needs including sourcing, design, building and operations
                    </p>
                    <button 
                      type="button"
                      onClick={handleEnquireClick}
                      className="w-full bg-blue-400 text-white py-2 px-4 rounded-lg text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>

                {/* Enterprise Solutions Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 mx-auto w-full max-w-lg">
                  <div className="w-full h-40 md:h-48 overflow-hidden">
                    <img 
                      src="/images/2.jpeg" 
                      alt="Enterprise Solutions" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <h4 className="text-base font-semibold text-gray-900">Enterprise Solutions</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Fully equipped offices for larger teams with flexibility to scale and customize your office in prime locations & LEED certified buildings
                    </p>
                    <button 
                      type="button"
                      onClick={handleEnquireClick}
                      className="w-full bg-blue-400 text-white py-2 px-4 rounded-lg text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Why book coworking space with Beyond Space Section */}
            <div className="mb-5 mt-5">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Why book coworking space with Beyond Space?</h3>
              <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-lg shadow-lg p-4 md:p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Left Side - Points in 2x2 grid */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 text-base font-bold">✓</span>
                      <p className="text-gray-800 text-xs font-medium">Exclusive Pricing & Zero Booking fee</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 text-base font-bold">✓</span>
                      <p className="text-gray-800 text-xs font-medium">Guided Office Space Tours</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 text-base font-bold">✓</span>
                      <p className="text-gray-800 text-xs font-medium">Verified Spaces and Trusted Operators</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 text-base font-bold">✓</span>
                      <p className="text-gray-800 text-xs font-medium">Dedicated Relationship Manager</p>
                    </div>
                  </div>
                  {/* Right Side - Button */}
                  <div className="flex items-center justify-center md:justify-end">
                    <button
                      type="button"
                      onClick={handleEnquireClick}
                      className="bg-blue-400 text-white py-2 px-5 rounded-lg text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {(property.aboutWorkspace || property.description) && (
              <div className="mb-5">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">About</h3>
                <p className="text-gray-700 text-base font-normal leading-relaxed">
                  {property.aboutWorkspace || property.description}
                </p>
              </div>
            )}

            {/* Location Details */}
            <div className="mb-5">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Location Details</h3>
              <p className="text-gray-700 text-base font-normal">
                {property.locationDetails || property.area}
              </p>
            </div>

            {/* Benefits Section */}
            <div className="mb-5">
              <div className="bg-gradient-to-br from-orange-100 via-pink-100 to-pink-200 rounded-lg shadow-lg p-4 md:p-5">
                <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm font-medium mb-1.5">Explore flexible workspace solutions just for you in Mumbai</p>
                    <p className="text-gray-800 text-sm font-medium">Zero pressure advice, recommendations and negotiations at no extra cost</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleEnquireClick}
                    className="bg-blue-400 text-white py-2 px-5 rounded-lg text-xs font-semibold shadow-lg hover:bg-blue-500 transition-all duration-300 whitespace-nowrap"
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
            <div className="mb-5">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Office Timing</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Monday to Friday */}
                <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm">Mon - Fri</p>
                      <p className="text-xs text-gray-600">Weekdays</p>
                    </div>
                  </div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {monFri || 'Not specified'}
                      </p>
                </div>

                {/* Saturday */}
                <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm">Sat</p>
                      <p className="text-xs text-gray-600">Saturday</p>
                    </div>
                  </div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {saturday || 'Not specified'}
                      </p>
                </div>

                {/* Sunday */}
                <div className="p-3 bg-white rounded-lg shadow-lg border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                        {(() => {
                          const isClosed = sunday ? sunday.toLowerCase().includes('closed') : false;
                          return (
                            <>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isClosed
                                  ? 'bg-red-500' 
                                  : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
                              }`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {isClosed ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  )}
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm">Sun</p>
                      <p className="text-xs text-gray-600">Sunday</p>
                    </div>
                            </>
                          );
                        })()}
                  </div>
                      <p className={`font-semibold text-sm ${
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
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-5">Amenities</h3>
              
              <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-2xl p-6">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Reception</span>
                </div>

                {/* Air Conditioning */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="lg:sticky lg:top-24">
            <div id="contact-form-section" className="bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 rounded-xl shadow-2xl border-2 border-blue-200/50 p-5 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-sky-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
              <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-r from-blue-100/30 to-cyan-100/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="mb-4">
                  <h4 className="text-sm md:text-base font-semibold text-black mb-1.5">Tell Us About Your Workspace Needs</h4>
                  <p className="text-xs text-gray-700">Share your requirements and we'll tailor a proposal for you.</p>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={contactFormData.name}
                      onChange={handleContactInputChange}
                      placeholder="Enter your name"
                      required
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-sm"
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
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 placeholder-gray-500 shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <div className="flex gap-2">
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen(prev => !prev)}
                          className="flex w-28 items-center gap-1.5 rounded-lg border-2 border-gray-300 bg-white px-2.5 py-2 text-xs font-semibold text-black shadow-sm transition-all duration-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <span className="text-base leading-none">{selectedCountry.flag}</span>
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
                          <div className="absolute left-0 bottom-full z-30 mb-2 w-56 max-h-56 overflow-y-auto rounded-lg border border-blue-100 bg-white shadow-xl">
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
                                <span className="text-base leading-none">{country.flag}</span>
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
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 appearance-none shadow-sm"
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
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white text-black text-sm font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-300 appearance-none shadow-sm"
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
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg ${
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

      </div>

      <section className="py-12 md:py-16 bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Explore Top Coworking Locations in Mumbai</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {primeLocations.map((location) => (
              <Link
                key={location.slug}
                href={`/category/coworking-space`}
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
          <div className={`${poppins.className} fixed inset-0 bg-black/95 z-50 flex items-center justify-center`}>
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
                        <span className="text-lg leading-none">{selectedModalCountry.flag}</span>
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
                              <span className="text-lg leading-none">{country.flag}</span>
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
  );
}



