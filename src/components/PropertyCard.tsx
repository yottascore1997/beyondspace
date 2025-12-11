'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

interface PropertyImage {
  id: string;
  imageUrl: string;
  propertyId: string;
  createdAt: string;
}

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
  propertyTier?: string | null;
  propertyOptions?: SeatingPlan[] | null;
}

interface PropertyCardProps {
  property: Property;
  onEnquireClick?: () => void;
  hideCategory?: boolean;
  category?: string; // Category from which page user is viewing (for filtering seating plans)
}

export default function PropertyCard({ property, onEnquireClick, hideCategory = false, category }: PropertyCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const categoryLabelMap: Record<string, string> = {
    coworking: 'Coworking',
    managed: 'Managed Office',
    dedicateddesk: 'Dedicated Desk',
    flexidesk: 'Flexi Desk',
    virtualoffice: 'Virtual Office',
    meetingroom: 'Meeting Room',
    enterpriseoffices: 'Enterprise Offices',
  };

  // Get price from seating plans with priority: Managed Office first, then Dedicated Desk, then Private Cabin
  const getMinSeatingPlanPrice = () => {
    if (!property.propertyOptions || !Array.isArray(property.propertyOptions) || property.propertyOptions.length === 0) {
      return null;
    }

    // Helper function to extract numeric price from price string
    const extractNumericPrice = (priceStr: string): number | null => {
      if (!priceStr || priceStr.trim() === '') return null;
      // Remove currency symbols, commas, and spaces, then parse
      const numericPrice = parseFloat(priceStr.replace(/[₹,\s]/g, ''));
      return isNaN(numericPrice) ? null : numericPrice;
    };

    // Check if property has Managed Office category
    const hasManagedCategory = property.categories?.some(cat => 
      cat.toLowerCase().includes('managed')
    ) || category?.toLowerCase().includes('managed');

    // Check if property is in Dedicated category
    const hasDedicatedCategory = property.categories?.some(cat => 
      cat.toLowerCase().includes('dedicateddesk') || cat.toLowerCase().includes('dedicated')
    ) || category?.toLowerCase().includes('dedicated');

    // Check if property is in Private Cabin category
    const hasPrivateCabinCategory = property.categories?.some(cat => 
      cat.toLowerCase().includes('privatecabin') || cat.toLowerCase().includes('private cabin')
    ) || category?.toLowerCase().includes('privatecabin') || category?.toLowerCase().includes('private-cabin');

    // Check if property is in Virtual Office category
    const hasVirtualOfficeCategory = property.categories?.some(cat => 
      cat.toLowerCase().includes('virtualoffice') || cat.toLowerCase().includes('virtual office')
    ) || category?.toLowerCase().includes('virtualoffice') || category?.toLowerCase().includes('virtual-office');

    // Check if property is in Day Pass category
    const hasDayPassCategory = property.categories?.some(cat => 
      cat.toLowerCase().includes('daypass') || cat.toLowerCase().includes('day pass')
    ) || category?.toLowerCase().includes('daypass') || category?.toLowerCase().includes('day-pass');

    // Check if property is in Meeting Room category
    const hasMeetingRoomCategory = property.categories?.some(cat => 
      cat.toLowerCase().includes('meetingroom') || cat.toLowerCase().includes('meeting room')
    ) || category?.toLowerCase().includes('meetingroom') || category?.toLowerCase().includes('meeting-room');

    // Priority 1: Look for Managed Office Space (if property has Managed category)
    // For Managed Office, ONLY show Managed Office Space price, no fallback
    if (hasManagedCategory) {
      const managedOfficePlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('managed office')
      );
      if (managedOfficePlan && managedOfficePlan.price) {
        const numericPrice = extractNumericPrice(managedOfficePlan.price);
        if (numericPrice !== null) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Managed category but no Managed Office Space price found, return null (don't show other prices)
      return null;
    }

    // Priority 2: Look for Private Cabin (if property has Private Cabin category)
    // For Private Cabin category, ONLY show Private Cabin price, no fallback
    if (hasPrivateCabinCategory) {
      const privateCabinPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('private cabin')
      );
      if (privateCabinPlan && privateCabinPlan.price) {
        const numericPrice = extractNumericPrice(privateCabinPlan.price);
        if (numericPrice !== null) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Private Cabin category but no Private Cabin price found, return null (don't show other prices)
      return null;
    }

    // Priority 3: Look for Dedicated Desk
    const dedicatedDeskPlan = property.propertyOptions.find((plan: SeatingPlan) => 
      plan.title.toLowerCase().includes('dedicated desk')
    );
    if (dedicatedDeskPlan && dedicatedDeskPlan.price) {
      const numericPrice = extractNumericPrice(dedicatedDeskPlan.price);
      if (numericPrice !== null) {
        return `₹ ${numericPrice.toLocaleString('en-IN')}`;
      }
    }

    // For Dedicated category, ONLY show Dedicated Desk price, no Private Cabin fallback
    if (hasDedicatedCategory) {
      // If Dedicated category but no Dedicated Desk price found, return null (don't show Private Cabin price)
      return null;
    }

    // Priority 4: Look for Virtual Office (if property has Virtual Office category)
    // For Virtual Office category, ONLY show Virtual Office price, no fallback
    if (hasVirtualOfficeCategory) {
      const virtualOfficePlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('virtual office')
      );
      if (virtualOfficePlan && virtualOfficePlan.price) {
        const numericPrice = extractNumericPrice(virtualOfficePlan.price);
        if (numericPrice !== null) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Virtual Office category but no Virtual Office price found, return null
      return null;
    }

    // Priority 5: Look for Day Pass (if property has Day Pass category)
    // For Day Pass category, ONLY show Day Pass price, no fallback
    if (hasDayPassCategory) {
      const dayPassPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('day pass')
      );
      if (dayPassPlan && dayPassPlan.price) {
        const numericPrice = extractNumericPrice(dayPassPlan.price);
        if (numericPrice !== null) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Day Pass category but no Day Pass price found, return null
      return null;
    }

    // Check if property is in Flexi Desk category
    const hasFlexiCategory = property.categories?.some(cat => 
      cat.toLowerCase().includes('flexidesk') || cat.toLowerCase().includes('flexi desk')
    ) || category?.toLowerCase().includes('flexidesk') || category?.toLowerCase().includes('flexi-desk');

    // Priority 5.5: Look for Flexi Desk (if property has Flexi Desk category)
    // For Flexi Desk category, ONLY show Flexi Desk price, no fallback
    if (hasFlexiCategory) {
      const flexiDeskPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('flexi desk')
      );
      if (flexiDeskPlan && flexiDeskPlan.price) {
        const numericPrice = extractNumericPrice(flexiDeskPlan.price);
        if (numericPrice !== null) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Flexi Desk category but no Flexi Desk price found, return null
      return null;
    }

    // Priority 6: Look for Meeting Room (if property has Meeting Room category)
    // For Meeting Room, get 04 Seater or lowest price
    if (hasMeetingRoomCategory) {
      const meetingRoomPlans = property.propertyOptions.filter((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('meeting room')
      );

      if (meetingRoomPlans.length > 0) {
        // First, try to find 04 Seater
        const fourSeaterPlan = meetingRoomPlans.find(plan => 
          plan.seating && (plan.seating.toLowerCase().includes('04') || plan.seating.toLowerCase().includes('4 seater'))
        );

        if (fourSeaterPlan && fourSeaterPlan.price) {
          const numericPrice = extractNumericPrice(fourSeaterPlan.price);
          if (numericPrice !== null) {
            return `₹ ${numericPrice.toLocaleString('en-IN')}`;
          }
        }

        // If no 04 Seater, get the lowest price
        const pricesWithNumeric = meetingRoomPlans
          .map(plan => ({
            plan,
            numericPrice: extractNumericPrice(plan.price)
          }))
          .filter(item => item.numericPrice !== null)
          .sort((a, b) => a.numericPrice! - b.numericPrice!);

        if (pricesWithNumeric.length > 0) {
          return `₹ ${pricesWithNumeric[0].numericPrice!.toLocaleString('en-IN')}`;
        }
      }
      // If Meeting Room category but no Meeting Room price found, return null
      return null;
    }

    // Priority 7: Look for Private Cabin (only for non-managed, non-dedicated, and non-private-cabin properties)
    const privateCabinPlan = property.propertyOptions.find((plan: SeatingPlan) => 
      plan.title.toLowerCase().includes('private cabin')
    );
    if (privateCabinPlan && privateCabinPlan.price) {
      const numericPrice = extractNumericPrice(privateCabinPlan.price);
      if (numericPrice !== null) {
        return `₹ ${numericPrice.toLocaleString('en-IN')}`;
      }
    }

    // Fallback: Get minimum price from all available plans
    const prices = property.propertyOptions
      .map((plan: SeatingPlan) => extractNumericPrice(plan.price))
      .filter((price): price is number => price !== null);

    if (prices.length === 0) return null;

    const minPrice = Math.min(...prices);
    return `₹ ${minPrice.toLocaleString('en-IN')}`;
  };

  const minSeatingPrice = getMinSeatingPlanPrice();

  // Get all available images (main image + additional images)
  const allImages = property.propertyImages && property.propertyImages.length > 0 
    ? [property.image, ...property.propertyImages.map(img => img.imageUrl).filter(img => img !== property.image)]
    : [property.image];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => {
      // Stop at last image, don't loop back
      if (prev >= allImages.length - 1) {
        return prev;
      }
      return prev + 1;
    });
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => {
      // Stop at first image, don't loop back
      if (prev <= 0) {
        return prev;
      }
      return prev - 1;
    });
  };

  // Build property URL with category query param if provided
  const propertyUrl = category 
    ? `/property/${property.id}?category=${encodeURIComponent(category)}`
    : `/property/${property.id}`;

  return (
    <Link 
      href={propertyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <article className={`${poppins.className} bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}>
        <div className="relative h-56 sm:h-64 md:h-72 2xl:h-80 overflow-hidden rounded-t-xl group">
        {property.propertyTier && (
          <span className="absolute top-2 left-2 z-20 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-md capitalize">
            {property.propertyTier}
          </span>
        )}
        <div className="relative w-full h-full overflow-hidden">
          <div 
            className="flex h-full will-change-transform"
            style={{ 
              transform: `translateX(-${currentImageIndex * 100}%)`,
              transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {allImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={property.title}
                className="w-full h-full object-cover flex-shrink-0"
                style={{ minWidth: '100%', width: '100%' }}
                loading={index === 0 ? "lazy" : "eager"}
              />
            ))}
          </div>
        </div>
        
        {/* Image Navigation Arrows - Only show if multiple images */}
        {allImages.length > 1 && (
          <>
            {/* Previous Button - Hide when at first image */}
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 text-black rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-30"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {/* Next Button - Hide when at last image */}
            {currentImageIndex < allImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 text-black rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-30"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        )}
        
        {/* Image Indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-30">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        </div>
      
        <div className="p-3 sm:p-4 space-y-1.5">
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight cursor-pointer line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 flex-wrap">
          {property.sublocation && (
            <>
              <span>{property.sublocation}</span>
              <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
            </>
          )}
          <span>{property.area}</span>
          <span className="w-0.5 h-0.5 bg-gray-400 rounded-full"></span>
          <span>{property.city}</span>
        </div>

        {!hideCategory && property.categories && property.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 text-[10px] sm:text-xs text-blue-700 font-medium">
            {property.categories.map((category) => (
              <span
                key={category}
                className="px-1.5 py-0.5 bg-blue-50 border border-blue-100 rounded-full"
              >
                {categoryLabelMap[category.toLowerCase()] ?? category}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="font-semibold text-gray-800 text-sm sm:text-base font-sans">
            {(() => {
              // Get the appropriate suffix based on category
              const hasVirtualOfficeCategory = property.categories?.some(cat => 
                cat.toLowerCase().includes('virtualoffice') || cat.toLowerCase().includes('virtual office')
              ) || category?.toLowerCase().includes('virtualoffice') || category?.toLowerCase().includes('virtual-office');
              
              const hasDayPassCategory = property.categories?.some(cat => 
                cat.toLowerCase().includes('daypass') || cat.toLowerCase().includes('day pass')
              ) || category?.toLowerCase().includes('daypass') || category?.toLowerCase().includes('day-pass');
              
              const hasMeetingRoomCategory = property.categories?.some(cat => 
                cat.toLowerCase().includes('meetingroom') || cat.toLowerCase().includes('meeting room')
              ) || category?.toLowerCase().includes('meetingroom') || category?.toLowerCase().includes('meeting-room');
              
              const hasFlexiCategory = property.categories?.some(cat => 
                cat.toLowerCase().includes('flexidesk') || cat.toLowerCase().includes('flexi desk')
              ) || category?.toLowerCase().includes('flexidesk') || category?.toLowerCase().includes('flexi-desk');

              let priceSuffix = '/month';
              if (hasVirtualOfficeCategory) priceSuffix = '/Year';
              else if (hasDayPassCategory) priceSuffix = '/seat/Day';
              else if (hasMeetingRoomCategory) priceSuffix = '/Per Hour';
              else if (hasFlexiCategory) priceSuffix = '/seat/month';

              if (minSeatingPrice) {
                return <span>{minSeatingPrice}<span className="text-gray-600 font-normal text-xs">{priceSuffix}</span></span>;
              } else {
                return <span>{property.priceDisplay}<span className="text-gray-600 font-normal text-xs">{priceSuffix}</span></span>;
              }
            })()}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEnquireClick?.();
            }}
            className="px-3 sm:px-4 py-1.5 bg-blue-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Get Quote
          </button>
        </div>
        </div>
      </article>
    </Link>
  );
}
