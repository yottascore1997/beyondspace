'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import QuickCategories from '@/components/QuickCategories';
import MumbaiPlaces from '@/components/MumbaiPlaces';
import WorkspaceCategories from '@/components/WorkspaceCategories';
import WhyUs from '@/components/WhyUs';
import About from '@/components/About';
import TrustedCompanies from '@/components/TrustedCompanies';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import Benefits from '@/components/Benefits';
import FeaturedCoworking from '@/components/FeaturedCoworking';
import ShareRequirementsModal from '@/components/ShareRequirementsModal';
import FAQ from '@/components/FAQ';

export default function Home() {
  const [filters, setFilters] = useState({
    city: 'all',
    area: 'all',
    purpose: '',
    search: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // No longer needed as QuickCategories now navigates to area pages
  // const handleAreaSelect = (area: string) => {
  //   setFilters(prev => ({ ...prev, area: area, city: 'Mumbai' }));
  // };

  const resetFilters = () => {
    setFilters({
      city: 'all',
      area: 'all',
      purpose: '',
      search: '',
    });
  };

  const [isShareModalOpen, setShareModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header />
      <div className="h-16 sm:h-20 md:h-24"></div>
      <Hero
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />
      <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12" style={{ maxWidth: '1920px', width: '100%' }}>

        <MumbaiPlaces />

        <TrustedCompanies />

        <WorkspaceCategories onEnterpriseClick={() => setShareModalOpen(true)} />

        <QuickCategories />

        {/* YouTube Video Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Video - Left Side */}
            <div className="relative">
              <div className="relative w-full h-96 md:h-[30rem] lg:h-[34rem] rounded-2xl overflow-hidden shadow-2xl">
                <video
                  className="w-full h-full object-cover"
                  src="/images/promo.mp4"
                  controls
                  preload="metadata"
                  poster="/images/hero4.jpeg"
                />
              </div>
            </div>

            {/* Content - Right Side */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Discover Your Perfect Workspace
                </h2>
                <p className="text-lg text-black leading-relaxed">
                  Watch how Beyond Space Work transforms your office search experience. 
                  From premium coworking spaces to managed offices, we help you find 
                  the perfect workspace that matches your business needs.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Premium Locations</h3>
                    <p className="text-black">Access to the best business districts in Mumbai</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Flexible Solutions</h3>
                    <p className="text-black">From hot desks to private offices, find what works for you</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Expert Support</h3>
                    <p className="text-black">Dedicated team to help you every step of the way</p>
                  </div>
                </div>
              </div>

              <div className="flex">
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
        </section>

        <FeaturedCoworking />

        <Benefits />

        <Testimonials />
      </div>

      <FAQ />

      <Footer />

      <ShareRequirementsModal isOpen={isShareModalOpen} onClose={() => setShareModalOpen(false)} />

    </div>
  );
}