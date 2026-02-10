'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  priority?: boolean; // Above-fold cards load images first
}

export default function PropertyCard({ property, onEnquireClick, hideCategory = false, category, priority = false }: PropertyCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(
    priority ? new Set([0, 1, 2, 3, 4]) : new Set([0])
  );
  const cardRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  
  // Get all available images (main image + additional images)
  const allImages = property.propertyImages && property.propertyImages.length > 0 
    ? [property.image, ...property.propertyImages.map(img => img.imageUrl).filter(img => img !== property.image)]
    : [property.image];
  
  // Lazy load images when card comes into view (skip if priority)
  useEffect(() => {
    if (priority || !cardRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load all images when card is visible
            setLoadedImages(new Set(allImages.map((_, idx) => idx)));
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' } // Start loading 50px before card is visible
    );
    
    observer.observe(cardRef.current);
    
    return () => observer.disconnect();
  }, [allImages.length]); // Only depend on length, not the array itself
  
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

    // Check category parameter first - this is critical for category page filtering
    const normalizedCategory = category?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const categoryLower = category?.toLowerCase() || '';
    
    // Check if we're on virtual-office category page (from URL parameter)
    const isVirtualOfficeCategoryPage = normalizedCategory === 'virtualoffice' || 
                                        categoryLower === 'virtual-office' ||
                                        categoryLower === 'virtualoffice' ||
                                        categoryLower === 'virtual office' ||
                                        categoryLower.includes('virtual-office');
    
    // CRITICAL: If we're on virtual-office category page, ONLY show Virtual Office price
    // Check for Virtual Office plan FIRST, before any other category checks
    if (isVirtualOfficeCategoryPage) {
      const virtualOfficePlan = property.propertyOptions.find((plan: SeatingPlan) => {
        if (!plan || !plan.title) return false;
        const titleLower = plan.title.toLowerCase().trim();
        return titleLower.includes('virtual office') || 
               titleLower.includes('virtualoffice') ||
               titleLower === 'virtual office' ||
               titleLower.startsWith('virtual') ||
               (titleLower.includes('virtual') && titleLower.includes('office'));
      });
      
      if (virtualOfficePlan && virtualOfficePlan.price) {
        const numericPrice = extractNumericPrice(virtualOfficePlan.price);
        if (numericPrice !== null && numericPrice > 0) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Virtual Office plan not found, return null (don't show any other price)
      return null;
    }
    
    // Check if we're on meeting-room category page (from URL parameter)
    const isMeetingRoomCategoryPage = normalizedCategory === 'meetingroom' || 
                                      categoryLower === 'meeting-room' ||
                                      categoryLower === 'meetingroom' ||
                                      categoryLower === 'meeting room' ||
                                      categoryLower.includes('meeting-room');
    
    // CRITICAL: If we're on meeting-room category page, ONLY show Meeting Room price
    // Check for Meeting Room plan FIRST, before any other category checks
    if (isMeetingRoomCategoryPage) {
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
          if (numericPrice !== null && numericPrice > 0) {
            return `₹ ${numericPrice.toLocaleString('en-IN')}`;
          }
        }

        // If no 04 Seater, get the lowest price
        const pricesWithNumeric = meetingRoomPlans
          .map(plan => ({
            plan,
            numericPrice: extractNumericPrice(plan.price)
          }))
          .filter(item => item.numericPrice !== null && item.numericPrice > 0)
          .sort((a, b) => a.numericPrice! - b.numericPrice!);

        if (pricesWithNumeric.length > 0) {
          return `₹ ${pricesWithNumeric[0].numericPrice!.toLocaleString('en-IN')}`;
        }
      }
      // If Meeting Room plan not found, return null (don't show any other price)
      return null;
    }
    
    // Check if we're on day-pass category page (from URL parameter)
    const isDayPassCategoryPage = normalizedCategory === 'daypass' || 
                                   categoryLower === 'day-pass' ||
                                   categoryLower === 'daypass' ||
                                   categoryLower === 'day pass' ||
                                   categoryLower.includes('day-pass') ||
                                   categoryLower.includes('daypass');
    
    // CRITICAL: If we're on day-pass category page, ONLY show Day Pass price
    // Check for Day Pass plan FIRST, before any other category checks
    if (isDayPassCategoryPage) {
      const dayPassPlan = property.propertyOptions.find((plan: SeatingPlan) => {
        if (!plan || !plan.title) return false;
        const titleLower = plan.title.toLowerCase().trim();
        return titleLower.includes('day pass') || 
               titleLower.includes('daypass') ||
               titleLower === 'day pass';
      });
      
      if (dayPassPlan && dayPassPlan.price) {
        const numericPrice = extractNumericPrice(dayPassPlan.price);
        if (numericPrice !== null && numericPrice > 0) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Day Pass plan not found, return null (don't show any other price)
      return null;
    }
    
    // Check if we're on coworking category page (from URL parameter)
    const isCoworkingCategoryPage = normalizedCategory === 'coworking' || 
                                     normalizedCategory === 'coworkingspace' ||
                                     categoryLower === 'coworking-space' ||
                                     categoryLower === 'coworking' ||
                                     categoryLower.includes('coworking');
    
    // CRITICAL: If we're on coworking category page, show Dedicated Desk first, then Private Cabin
    // Both should use /seat/month suffix
    if (isCoworkingCategoryPage) {
      // First, try to find Dedicated Desk
      const dedicatedDeskPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('dedicated desk')
      );
      
      if (dedicatedDeskPlan && dedicatedDeskPlan.price) {
        const numericPrice = extractNumericPrice(dedicatedDeskPlan.price);
        if (numericPrice !== null && numericPrice > 0) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      
      // If Dedicated Desk not found, try Private Cabin
      const privateCabinPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('private cabin')
      );
      
      if (privateCabinPlan && privateCabinPlan.price) {
        const numericPrice = extractNumericPrice(privateCabinPlan.price);
        if (numericPrice !== null && numericPrice > 0) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      
      // If neither found, return null (don't show other prices)
      return null;
    }
    
    // Check if we're on dedicated-desk category page (from URL parameter)
    const isDedicatedDeskCategoryPage = normalizedCategory === 'dedicateddesk' || 
                                        normalizedCategory === 'dedicateddesks' ||
                                        categoryLower === 'dedicated-desk' ||
                                        categoryLower === 'dedicateddesk' ||
                                        categoryLower.includes('dedicated-desk');
    
    // CRITICAL: If we're on dedicated-desk category page, ONLY show Dedicated Desk price
    // Use /seat/month suffix
    if (isDedicatedDeskCategoryPage) {
      const dedicatedDeskPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('dedicated desk')
      );
      
      if (dedicatedDeskPlan && dedicatedDeskPlan.price) {
        const numericPrice = extractNumericPrice(dedicatedDeskPlan.price);
        if (numericPrice !== null && numericPrice > 0) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Dedicated Desk plan not found, return null (don't show other prices)
      return null;
    }
    
    // Check if we're on private-cabin category page (from URL parameter)
    const isPrivateCabinCategoryPage = normalizedCategory === 'privatecabin' || 
                                       normalizedCategory === 'privatecabins' ||
                                       categoryLower === 'private-cabin' ||
                                       categoryLower === 'privatecabin' ||
                                       categoryLower.includes('private-cabin');
    
    // CRITICAL: If we're on private-cabin category page, ONLY show Private Cabin price
    // Use /seat/month suffix
    if (isPrivateCabinCategoryPage) {
      const privateCabinPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('private cabin')
      );
      
      if (privateCabinPlan && privateCabinPlan.price) {
        const numericPrice = extractNumericPrice(privateCabinPlan.price);
        if (numericPrice !== null && numericPrice > 0) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Private Cabin plan not found, return null (don't show other prices)
      return null;
    }
    
    // Check if we're on managed-office category page (from URL parameter)
    const isManagedOfficeCategoryPage = normalizedCategory === 'managed' || 
                                        normalizedCategory === 'managedoffice' ||
                                        categoryLower === 'managed-office' ||
                                        categoryLower === 'managedoffice' ||
                                        categoryLower.includes('managed-office');
    
    // CRITICAL: If we're on managed-office category page, ONLY show Managed Office Space price
    if (isManagedOfficeCategoryPage) {
      const managedOfficePlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('managed office')
      );
      
      if (managedOfficePlan && managedOfficePlan.price) {
        const numericPrice = extractNumericPrice(managedOfficePlan.price);
        if (numericPrice !== null && numericPrice > 0) {
          // Return price without suffix - suffix will be added in display
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Managed Office plan not found, return null (don't show other prices)
      return null;
    }
    
    // Check if property has virtualoffice in its categories (for non-category-page scenarios)
    const propertyHasVirtualOffice = property.categories?.some(cat => {
      const catLower = cat.toLowerCase();
      return catLower.includes('virtualoffice') || 
             catLower.includes('virtual office') ||
             catLower === 'virtual office';
    }) || false;
    
    // If property has virtualoffice category (but we're not on virtual-office category page)
    const hasVirtualOfficeCategory = propertyHasVirtualOffice;

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

    // Priority 3: Look for Virtual Office (if property has Virtual Office category) - Check BEFORE Dedicated Desk
    // For Virtual Office category, ONLY show Virtual Office price, no fallback to other plans
    if (hasVirtualOfficeCategory) {
      // Try multiple variations of Virtual Office title - be very flexible
      const virtualOfficePlan = property.propertyOptions.find((plan: SeatingPlan) => {
        if (!plan || !plan.title) return false;
        const titleLower = plan.title.toLowerCase().trim();
        // Check for various Virtual Office title patterns
        return titleLower.includes('virtual office') || 
               titleLower.includes('virtualoffice') ||
               titleLower === 'virtual office' ||
               titleLower.startsWith('virtual') ||
               (titleLower.includes('virtual') && titleLower.includes('office'));
      });
      
      if (virtualOfficePlan && virtualOfficePlan.price) {
        const numericPrice = extractNumericPrice(virtualOfficePlan.price);
        if (numericPrice !== null && numericPrice > 0) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
      // If Virtual Office category but no Virtual Office price found, return null (don't show other prices)
      return null;
    }
    

    // Priority 4: Look for Dedicated Desk (only if not Virtual Office category)
    // Skip Dedicated Desk if we're on Virtual Office category page
    if (!hasVirtualOfficeCategory) {
      const dedicatedDeskPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('dedicated desk')
      );
      if (dedicatedDeskPlan && dedicatedDeskPlan.price) {
        const numericPrice = extractNumericPrice(dedicatedDeskPlan.price);
        if (numericPrice !== null) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
    }

    // For Dedicated category, ONLY show Dedicated Desk price, no Private Cabin fallback
    if (hasDedicatedCategory) {
      // If Dedicated category but no Dedicated Desk price found, return null (don't show Private Cabin price)
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

    // Priority 6: Look for Meeting Room (if property has Meeting Room category, but not on meeting-room category page)
    // For Meeting Room, get 04 Seater or lowest price
    // Note: If we're on meeting-room category page, this check is already done above
    if (hasMeetingRoomCategory && !isMeetingRoomCategoryPage) {
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

    // Priority 7: Look for Private Cabin (only for non-managed, non-dedicated, non-private-cabin, non-virtual-office, and non-meeting-room properties)
    // Skip Private Cabin if we're on virtual-office or meeting-room category page
    if (!isVirtualOfficeCategoryPage && !isMeetingRoomCategoryPage) {
      const privateCabinPlan = property.propertyOptions.find((plan: SeatingPlan) => 
        plan.title.toLowerCase().includes('private cabin')
      );
      if (privateCabinPlan && privateCabinPlan.price) {
        const numericPrice = extractNumericPrice(privateCabinPlan.price);
        if (numericPrice !== null) {
          return `₹ ${numericPrice.toLocaleString('en-IN')}`;
        }
      }
    }

    // Fallback: Get minimum price from all available plans
    // BUT: If we're on category-specific pages and plan was not found, return null
    if (isVirtualOfficeCategoryPage || isMeetingRoomCategoryPage || isManagedOfficeCategoryPage) {
      return null; // Don't show any price if category-specific plan not found on category page
    }
    
    const prices = property.propertyOptions
      .map((plan: SeatingPlan) => extractNumericPrice(plan.price))
      .filter((price): price is number => price !== null);

    if (prices.length === 0) return null;

    const minPrice = Math.min(...prices);
    return `₹ ${minPrice.toLocaleString('en-IN')}`;
  };

  const minSeatingPrice = getMinSeatingPlanPrice();

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

  // Touch swipe for mobile - hand se swipe karne par images change
  const SWIPE_THRESHOLD = 50;
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Use release position so tap (no touchMove) is not treated as swipe
    if (e.changedTouches?.[0]) {
      touchEndX.current = e.changedTouches[0].clientX;
    }
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD && allImages.length > 1) {
      e.preventDefault();
      e.stopPropagation();
      if (diff > 0) nextImage(); // swipe left -> next
      else prevImage(); // swipe right -> prev
    }
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
      <article ref={cardRef} className={`${poppins.className} bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-full flex flex-col`}>
        <div className="relative h-56 sm:h-64 md:h-72 2xl:h-80 overflow-hidden rounded-t-xl group">
        {property.propertyTier && (
          <span className="absolute top-2 left-2 z-20 inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-md capitalize">
            {property.propertyTier}
          </span>
        )}
        <div 
          className="relative w-full h-full overflow-hidden touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex h-full will-change-transform"
            style={{ 
              transform: `translateX(-${currentImageIndex * 100}%)`,
              transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {allImages.map((image, index) => (
              loadedImages.has(index) ? (
                <Image
                  key={image}
                  src={image}
                  alt={`${property.title} - Image ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover flex-shrink-0"
                  style={{ minWidth: '100%', width: '100%' }}
                  loading={priority && index === 0 ? "eager" : "lazy"}
                  quality={100}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  unoptimized={image.startsWith('http')}
                  priority={priority && index === 0}
                />
              ) : (
                <div
                  key={image}
                  className="w-full h-full flex-shrink-0 bg-gray-200 animate-pulse"
                  style={{ minWidth: '100%', width: '100%' }}
                />
              )
            ))}
          </div>
        </div>
        
        {/* Image Navigation Arrows - Only show if multiple images */}
        {allImages.length > 1 && (
          <>
            {/* Previous Button - Grayed out when at first image */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentImageIndex > 0) {
                  prevImage();
                }
              }}
              disabled={currentImageIndex === 0}
              className={`hidden md:flex absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full items-center justify-center shadow-md md:opacity-0 md:group-hover:opacity-100 transition-opacity z-30 ${
                currentImageIndex === 0
                  ? 'bg-gray-100/90 text-gray-400 cursor-not-allowed'
                  : 'bg-white/90 text-black cursor-pointer'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Next Button - Grayed out when at last image */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (currentImageIndex < allImages.length - 1) {
                  nextImage();
                }
              }}
              disabled={currentImageIndex >= allImages.length - 1}
              className={`hidden md:flex absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full items-center justify-center shadow-md md:opacity-0 md:group-hover:opacity-100 transition-opacity z-30 ${
                currentImageIndex >= allImages.length - 1
                  ? 'bg-gray-100/90 text-gray-400 cursor-not-allowed'
                  : 'bg-white/90 text-black cursor-pointer'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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
      
        <div className="p-3 sm:p-4 space-y-1.5 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-tight cursor-pointer line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center text-xs sm:text-sm text-gray-600 flex-wrap">
          {property.sublocation && (
            <>
              <span>{property.sublocation}</span>
              <span className="mx-1">,</span>
            </>
          )}
          <span>{property.area}</span>
          <span className="mx-1">,</span>
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

        {/* Show seating options for Meeting Room category page */}
        {(() => {
          const categoryLowerForSeating = category?.toLowerCase() || '';
          const normalizedCategoryForSeating = category?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
          const isMeetingRoomCategoryPageForSeating = normalizedCategoryForSeating === 'meetingroom' || 
                                                        categoryLowerForSeating === 'meeting-room' ||
                                                        categoryLowerForSeating === 'meetingroom' ||
                                                        categoryLowerForSeating === 'meeting room' ||
                                                        categoryLowerForSeating.includes('meeting-room');
          
          if (isMeetingRoomCategoryPageForSeating && property.propertyOptions && property.propertyOptions.length > 0) {
            // Find meeting room plans
            const meetingRoomPlans = property.propertyOptions.filter((plan: SeatingPlan) => 
              plan.title.toLowerCase().includes('meeting room')
            );
            
            if (meetingRoomPlans.length > 0) {
              // Get all unique seating options from all meeting room plans
              const allSeatingOptions = new Set<string>();
              meetingRoomPlans.forEach((plan: SeatingPlan) => {
                if (plan.seating) {
                  plan.seating.split(',').forEach((s: string) => {
                    const trimmed = s.trim();
                    if (trimmed) {
                      // Map "12+ Seats" to "12+ Seater" for consistency
                      const normalizedSeating = trimmed === '12+ Seats' ? '12+ Seater' : trimmed;
                      allSeatingOptions.add(normalizedSeating);
                    }
                  });
                }
              });
              
              // Convert to array and sort
              const sortedSeatingOptions = Array.from(allSeatingOptions).sort((a, b) => {
                // Extract numbers for sorting (e.g., "04 Seater" -> 4, "12+ Seater" -> 12)
                const numA = parseInt(a.match(/\d+/)?.[0] || '0');
                const numB = parseInt(b.match(/\d+/)?.[0] || '0');
                return numA - numB;
              });
              
              if (sortedSeatingOptions.length > 0) {
                return (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-black">Available Options :</span>
                    {sortedSeatingOptions.map((seating, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-md text-[10px] sm:text-xs text-indigo-700 font-semibold shadow-sm"
                      >
                        {seating}
                      </span>
                    ))}
                  </div>
                );
              }
            }
          }
          return null;
        })()}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="font-semibold text-gray-800 text-sm sm:text-base font-sans">
              {(() => {
                // Get the appropriate suffix based on category
                // Check category parameter first (for category pages)
                const categoryLowerForSuffix = category?.toLowerCase() || '';
                const normalizedCategoryForSuffix = category?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
                
                // Check if we're on virtual-office category page
                const isVirtualOfficeCategoryPageForSuffix = normalizedCategoryForSuffix === 'virtualoffice' || 
                                                              categoryLowerForSuffix === 'virtual-office' ||
                                                              categoryLowerForSuffix === 'virtualoffice' ||
                                                              categoryLowerForSuffix === 'virtual office' ||
                                                              categoryLowerForSuffix.includes('virtual-office');
                
                // Check if we're on meeting-room category page
                const isMeetingRoomCategoryPageForSuffix = normalizedCategoryForSuffix === 'meetingroom' || 
                                                            categoryLowerForSuffix === 'meeting-room' ||
                                                            categoryLowerForSuffix === 'meetingroom' ||
                                                            categoryLowerForSuffix === 'meeting room' ||
                                                            categoryLowerForSuffix.includes('meeting-room');
                
                // Check if we're on coworking category page
                const isCoworkingCategoryPageForSuffix = normalizedCategoryForSuffix === 'coworking' || 
                                                         normalizedCategoryForSuffix === 'coworkingspace' ||
                                                         categoryLowerForSuffix === 'coworking-space' ||
                                                         categoryLowerForSuffix === 'coworking' ||
                                                         categoryLowerForSuffix.includes('coworking');
                
                // Check if we're on dedicated-desk category page
                const isDedicatedDeskCategoryPageForSuffix = normalizedCategoryForSuffix === 'dedicateddesk' || 
                                                              normalizedCategoryForSuffix === 'dedicateddesks' ||
                                                              categoryLowerForSuffix === 'dedicated-desk' ||
                                                              categoryLowerForSuffix === 'dedicateddesk' ||
                                                              categoryLowerForSuffix.includes('dedicated-desk');
                
                // Check if we're on private-cabin category page
                const isPrivateCabinCategoryPageForSuffix = normalizedCategoryForSuffix === 'privatecabin' || 
                                                           normalizedCategoryForSuffix === 'privatecabins' ||
                                                           categoryLowerForSuffix === 'private-cabin' ||
                                                           categoryLowerForSuffix === 'privatecabin' ||
                                                           categoryLowerForSuffix.includes('private-cabin');
                
                // Check if we're on managed-office category page
                const isManagedOfficeCategoryPageForSuffix = normalizedCategoryForSuffix === 'managed' || 
                                                              normalizedCategoryForSuffix === 'managedoffice' ||
                                                              categoryLowerForSuffix === 'managed-office' ||
                                                              categoryLowerForSuffix === 'managedoffice' ||
                                                              categoryLowerForSuffix === 'managed' ||
                                                              categoryLowerForSuffix.includes('managed-office') ||
                                                              categoryLowerForSuffix.includes('managed');
                
                // Check if we're on day-pass category page
                const isDayPassCategoryPageForSuffix = normalizedCategoryForSuffix === 'daypass' || 
                                                        categoryLowerForSuffix === 'day-pass' ||
                                                        categoryLowerForSuffix === 'daypass' ||
                                                        categoryLowerForSuffix === 'day pass' ||
                                                        categoryLowerForSuffix.includes('day-pass') ||
                                                        categoryLowerForSuffix.includes('daypass');
                
                const hasVirtualOfficeCategory = property.categories?.some(cat => 
                  cat.toLowerCase().includes('virtualoffice') || cat.toLowerCase().includes('virtual office')
                ) || isVirtualOfficeCategoryPageForSuffix;
                
                const hasDayPassCategory = property.categories?.some(cat => 
                  cat.toLowerCase().includes('daypass') || cat.toLowerCase().includes('day pass')
                ) || category?.toLowerCase().includes('daypass') || category?.toLowerCase().includes('day-pass');
                
                const hasMeetingRoomCategory = property.categories?.some(cat => 
                  cat.toLowerCase().includes('meetingroom') || cat.toLowerCase().includes('meeting room')
                ) || isMeetingRoomCategoryPageForSuffix;
                
                const hasFlexiCategory = property.categories?.some(cat => 
                  cat.toLowerCase().includes('flexidesk') || cat.toLowerCase().includes('flexi desk')
                ) || category?.toLowerCase().includes('flexidesk') || category?.toLowerCase().includes('flexi-desk');

                let priceSuffix = '/month';
                // Priority order: Check category page first, then property categories
                if (isVirtualOfficeCategoryPageForSuffix) priceSuffix = '/Year';
                else if (isMeetingRoomCategoryPageForSuffix) priceSuffix = '/Hour';
                else if (isDayPassCategoryPageForSuffix) priceSuffix = '/seat/Day';
                else if (isManagedOfficeCategoryPageForSuffix) priceSuffix = '/seat/month';
                else if (isCoworkingCategoryPageForSuffix) priceSuffix = '/seat/month';
                else if (isDedicatedDeskCategoryPageForSuffix) priceSuffix = '/seat/month';
                else if (isPrivateCabinCategoryPageForSuffix) priceSuffix = '/seat/month';
                else if (hasVirtualOfficeCategory) priceSuffix = '/Year';
                else if (hasDayPassCategory) priceSuffix = '/seat/Day';
                else if (hasMeetingRoomCategory) priceSuffix = '/Hour';
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

        {(() => {
          // Only show text if we're on specific category pages: coworking, dedicated, private, or managed
          const categoryLower = category?.toLowerCase() || '';
          const normalizedCategory = category?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
          
          // Check if we're on coworking category page
          const isCoworkingPage = normalizedCategory === 'coworking' || 
                                  normalizedCategory === 'coworkingspace' ||
                                  categoryLower === 'coworking-space' ||
                                  categoryLower === 'coworking' ||
                                  categoryLower.includes('coworking');
          
          // Check if we're on dedicated-desk category page
          const isDedicatedPage = normalizedCategory === 'dedicateddesk' || 
                                 normalizedCategory === 'dedicateddesks' ||
                                 categoryLower === 'dedicated-desk' ||
                                 categoryLower === 'dedicateddesk' ||
                                 categoryLower.includes('dedicated-desk');
          
          // Check if we're on private-cabin category page
          const isPrivatePage = normalizedCategory === 'privatecabin' || 
                               normalizedCategory === 'privatecabins' ||
                               categoryLower === 'private-cabin' ||
                               categoryLower === 'privatecabin' ||
                               categoryLower.includes('private-cabin');
          
          // Check if we're on managed-office category page
          const isManagedPage = normalizedCategory === 'managed' || 
                               normalizedCategory === 'managedoffice' ||
                               categoryLower === 'managed-office' ||
                               categoryLower === 'managedoffice' ||
                               categoryLower === 'managed' ||
                               categoryLower.includes('managed-office') ||
                               categoryLower.includes('managed');
          
          // Only show if we're on one of these specific category pages
          if (isCoworkingPage || isDedicatedPage || isPrivatePage || isManagedPage) {
            return (
              <div className="mt-1">
                <span className="text-xs sm:text-sm text-blue-600">
                  (Quoted price is negotiable)
                </span>
              </div>
            );
          }
          return null;
        })()}
        </div>
      </article>
    </Link>
  );
}
