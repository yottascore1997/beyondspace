'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspaceCategories() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/category/${encodeURIComponent(categoryName.toLowerCase().replace(/\s+/g, '-'))}`);
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
      description: 'Full-time offices for teams of all sizes',
      features: [
        'Dedicated seats & private cabins',
        'Fully-equipped coworking spaces',
        'Ideal for individual or small teams'
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
      name: 'Dedicated Desk',
      description: 'Personal workspace in a shared environment',
      features: [
        'Fixed desk with storage',
        'Access to shared facilities',
        'Cost-effective for individuals'
      ]
    },
    {
      name: 'Enterprise Offices',
      description: 'Custom-built offices for fast-growing teams',
      features: [
        'End-to-end design, build and manage',
        'Full customizations, branding and amenities',
        'Ideal for 100+ team size'
      ]
    },
    {
      name: 'Virtual Office',
      description: 'Professional address and communication services',
      features: [
        'Business address & mail handling',
        'Call answering & forwarding',
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
    '/images/co3.jpeg', // Dedicated Desk
    '/images/co4.jpeg', // Enterprise Offices
    '/images/co5.jpeg', // Virtual Office
    '/images/co6.jpeg'  // Meeting Room
  ];

  return (
    <section className="py-8 md:py-10 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Quick Search by{' '}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Popular Categories
            </span>
          </h2>
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Category Image */}
              <div className="w-full h-56 md:h-64 rounded-lg overflow-hidden mb-3">
                <img
                  src={categoryImages[index]}
                  alt={`${category.name} workspace`}
                  className="w-full h-full object-cover"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when clicking the button
                    handleCategoryClick(category.name);
                  }}
                  className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg shadow-purple-500/30 hover:shadow-cyan-400/40 transition-all duration-300 w-full"
                >
                  Explore {category.name} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
