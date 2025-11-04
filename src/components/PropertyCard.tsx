'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PropertyImage {
  id: string;
  imageUrl: string;
  propertyId: string;
  createdAt: string;
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
}

interface PropertyCardProps {
  property: Property;
  onEnquireClick?: () => void;
}

export default function PropertyCard({ property, onEnquireClick }: PropertyCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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

  return (
    <Link 
      href={`/property/${property.id}`} 
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <article className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
        <div className="relative h-96 overflow-hidden group cursor-pointer">
        <img
          src={allImages[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1}/{allImages.length}
          </div>
        )}
        
        {property.tag && (
          <span className="absolute top-3 right-12 bg-white text-gray-900 px-3 py-1 rounded-full font-bold text-xs">
            {property.tag}
          </span>
        )}
        <button
          onClick={() => setIsFav(!isFav)}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isFav 
              ? 'bg-[#a08efe] text-white' 
              : 'bg-white/85 text-gray-700 hover:bg-white'
          }`}
        >
          <svg 
            viewBox="0 0 24 24" 
            fill={isFav ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth={2}
            className="w-5 h-5"
          >
            <path d="M12.1 21s-7.1-4.4-9.2-8.3c-1.5-2.7-.5-6.1 2.2-7.6 2.1-1.2 4.9-.7 6.4 1.1 1.4-1.8 4.3-2.3 6.4-1.1 2.7 1.5 3.7 4.9 2.2 7.6C19.2 16.6 12.1 21 12.1 21z"/>
          </svg>
                  </button>
        </div>
      
        <div className="p-4 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg leading-tight cursor-pointer">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
          <span>{property.city}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{property.area}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>{property.type}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span className="flex items-center gap-1">
            ⭐ {property.rating}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="font-bold text-gray-900 text-lg">
            {property.priceDisplay}<span className="text-gray-500 font-normal">/month</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEnquireClick?.();
            }}
            className="px-6 py-2 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
          >
            Get Quote
          </button>
        </div>
        </div>
      </article>
    </Link>
  );
}
