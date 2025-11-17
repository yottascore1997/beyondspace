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

  // Get minimum price from seating plans
  const getMinSeatingPlanPrice = () => {
    if (!property.propertyOptions || !Array.isArray(property.propertyOptions) || property.propertyOptions.length === 0) {
      return null;
    }

    const prices = property.propertyOptions
      .map((plan: SeatingPlan) => {
        if (!plan.price || plan.price.trim() === '') return null;
        // Remove currency symbols, commas, and spaces, then parse
        const numericPrice = parseFloat(plan.price.replace(/[₹,\s]/g, ''));
        return isNaN(numericPrice) ? null : numericPrice;
      })
      .filter((price): price is number => price !== null);

    if (prices.length === 0) return null;

    const minPrice = Math.min(...prices);
    // Format back to currency format
    return `₹ ${minPrice.toLocaleString('en-IN')}`;
  };

  const minSeatingPrice = getMinSeatingPlanPrice();

  // Get all available images (main image + additional images)
  const allImages = property.propertyImages && property.propertyImages.length > 0 
    ? [property.image, ...property.propertyImages.map(img => img.imageUrl).filter(img => img !== property.image)]
    : [property.image];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
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
        <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden rounded-t-xl group">
        {property.propertyTier && (
          <span className="absolute top-2 left-2 z-20 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-md capitalize">
            {property.propertyTier}
          </span>
        )}
        <img
          src={allImages[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Image Navigation Arrows - Only show if multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 text-black rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 text-black rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Image Indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
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
        
        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
            {currentImageIndex + 1}/{allImages.length}
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
          <div className="font-semibold text-gray-800 text-sm sm:text-base">
            {minSeatingPrice ? (
              <span>{minSeatingPrice}<span className="text-gray-600 font-normal text-xs">/month</span></span>
            ) : (
              <span>{property.priceDisplay}<span className="text-gray-600 font-normal text-xs">/month</span></span>
            )}
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
