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
      name: 'Enterprise Solutions',
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
    '/images/co4.jpeg', // Enterprise Solutions
    '/images/co5.jpeg', // Virtual Office
    '/images/co6.jpeg'  // Meeting Room
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Quick Search by{' '}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Popular Categories
            </span>
          </h2>
          <p className="text-gray-600">Choose the perfect workspace solution for your business needs</p>
        </div>

        {/* Categories Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Category Image */}
              <div className="w-full h-96 rounded-lg overflow-hidden mb-4">
                <img
                  src={categoryImages[index]}
                  alt={`${category.name} workspace`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Category Heading */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">
                {category.description}
              </p>

              {/* Bullet Points */}
              <ul className="space-y-2 mb-6">
                {category.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <span className="text-orange-400 mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Explore Link */}
              <div className="pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click when clicking the button
                    handleCategoryClick(category.name);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors flex items-center"
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
