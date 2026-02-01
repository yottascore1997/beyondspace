'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { prefetchCategoryData } from '@/lib/categoryPrefetch';

interface WorkspaceCategoriesProps {
  onEnterpriseClick?: () => void;
}

export default function WorkspaceCategories({ onEnterpriseClick }: WorkspaceCategoriesProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/category/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`);
  };

  const handleEnterpriseClick = () => {
    if (onEnterpriseClick) {
      onEnterpriseClick();
    } else {
      handleCategoryClick('Enterprise Offices');
    }
  };

  // Hero images from public/images folder (same as Hero component)
  const heroImages = [
    {
      src: '/images/co1.jpeg',
      alt: 'Modern coworking lounge with premium interiors',
      category: 'Coworking'
    },
    {
      src: '/images/co2.jpeg',
      alt: 'Managed office floor with collaborative zones',
      category: 'Managed Office'
    },
    {
      src: '/images/co3.jpeg',
      alt: 'Enterprise office with contemporary conference area',
      category: 'Enterprise Office'
    },
    {
      src: '/images/co4.jpeg',
      alt: 'Premium meeting room with high-end amenities',
      category: 'Meeting Room'
    },
    {
      src: '/images/co5.jpeg',
      alt: 'Flexible workspace featuring collaborative desks',
      category: 'Dedicated Desk'
    }
  ];

  useEffect(() => {
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

  const categories = [
    {
      name: 'Coworking Space',
      description: 'Full-time premium offices for teams of all sizes',
      features: [
        'Dedicated seats & private cabins',
        'Fully-equipped coworking spaces',
        'Ideal for professionals or small businesses'
      ]
    },
    {
      name: 'Managed Office',
      description: 'Dedicated office space managed by a provider',
      features: [
        'Fully furnished customized office',
        'Fully managed operations & housekeeping',
        'Ideal for 50+ team size'
      ]
    },
    {
      name: 'Private Cabin',
      description: 'Fully private, lockable room for confidentiality',
      features: [
        'Enclosed & secure workspace',
        'Available in various sizes (2, 4, 8, 10, 30+ seater)',
        'Perfect for businesses of all sizes'
      ]
    },
    {
      name: 'Dedicated Desk',
      description: 'Personal workspace in a shared environment',
      features: [
        'Fixed desk with storage',
        'Access to shared facilities',
        'Cost-effective for individuals'
      ]
    },
    {
      name: 'Virtual Office',
      description: 'Professional address and communication services',
      features: [
        'Now register your Business address & GST',
        'Call answering & mail handling',
        'Ideal for remote teams'
      ]
    },
    {
      name: 'Meeting Room',
      description: 'Book meeting rooms for your business needs',
      features: [
        'Flexible booking options',
        'Equipped with modern amenities',
        'Perfect for presentations & meetings'
      ]
    }
  ];

  // Assign images to categories
  const categoryImages = [
    '/images/co1.jpeg', // Coworking Space
    '/images/co2.jpeg', // Managed Office
    '/images/seating/privatecabin.png', // Private Cabin
    '/images/co3.jpeg', // Dedicated Desk
    '/images/co5.jpeg', // Virtual Office
    '/images/co6.jpeg'  // Meeting Room
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 xl:px-8 2xl:px-12">
        {/* Section Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-2">
            Quick Search by{' '}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Popular Categories
            </span>
          </h2>
        </div>

        {/* Categories Section - Link enables prefetch for faster navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 md:gap-6 xl:gap-8">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              prefetch={true}
              onMouseEnter={() => prefetchCategoryData(category.name.toLowerCase().replace(/\s+/g, '-'), 'Mumbai')}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-5 xl:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer block"
            >
              {/* Category Image */}
              <div className="w-full h-56 md:h-64 xl:h-72 rounded-lg overflow-hidden mb-3">
                <img
                  src={categoryImages[index]}
                  alt={`${category.name} workspace`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Category Heading */}
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-black text-xs md:text-sm mb-3 font-medium">
                {category.description}
              </p>

              {/* Bullet Points */}
              <ul className="space-y-1.5 mb-4">
                {category.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs md:text-sm text-black">
                    <span className="text-orange-400 mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Explore Link */}
              <div className="pt-1">
                <span className="inline-block w-full text-center bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-cyan-400/40 transition-all duration-300">
                  Explore {category.name} →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Enterprise Offices Section */}
        <div className="mt-12 md:mt-16 xl:mt-20">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl border border-gray-200 p-6 md:p-8 xl:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-center">
              {/* Left Side - Image */}
              <div className="w-full h-64 md:h-80 xl:h-96 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/enterprise.png"
                  alt="Enterprise Offices"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Right Side - Content */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900">
                  Enterprise Offices
                </h3>
                
                <p className="text-black text-sm md:text-base font-medium">
                  Custom-built offices for fast-growing teams
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex items-start text-sm md:text-base text-black">
                    <span className="text-orange-400 mr-3 mt-1">•</span>
                    <span>End-to-end design, build and manage</span>
                  </li>
                  <li className="flex items-start text-sm md:text-base text-black">
                    <span className="text-orange-400 mr-3 mt-1">•</span>
                    <span>Full customizations, branding and amenities</span>
                  </li>
                  <li className="flex items-start text-sm md:text-base text-black">
                    <span className="text-orange-400 mr-3 mt-1">•</span>
                    <span>Ideal for 100+ team size</span>
                  </li>
                </ul>

                {/* Explore Button */}
                <div className="pt-2">
                  <button
                    onClick={handleEnterpriseClick}
                    className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-sm md:text-base font-semibold shadow-lg shadow-purple-500/30 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105"
                  >
                    Explore Enterprise Offices →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
