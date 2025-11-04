'use client';

import { useState, useEffect } from 'react';
import ShareRequirementsModal from './ShareRequirementsModal';

export default function Benefits() {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [currentClientIndex, setCurrentClientIndex] = useState(0);

  // Client images slider - images of clients they've closed deals with
  const clientImages = [
    { src: '/images/1.jpeg', alt: 'Client testimonial' },
    { src: '/images/2.jpeg', alt: 'Client testimonial' },
    { src: '/images/3.jpeg', alt: 'Client testimonial' },
    { src: '/images/4.jpeg', alt: 'Client testimonial' },
    { src: '/images/5.jpeg', alt: 'Client testimonial' },
    { src: '/images/6.jpeg', alt: 'Client testimonial' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentClientIndex((prevIndex) =>
        prevIndex === clientImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [clientImages.length]);

  const items = [
    {
      title: 'Zero brokerage fee',
      desc:
        'Direct access to the best office spaces and property owners with transparent pricing and zero brokerage fee.',
      iconColor: 'bg-blue-400',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3 0 2 3 5 3 5s3-3 3-5c0-1.657-1.343-3-3-3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
        </svg>
      ),
    },
    {
      title: 'Find and Book Your Perfect Workspace in 4 Easy Steps With Beyond Space',
      desc: '1) Share Your Requirements: Provide us with your workspace needs, and we\'ll take care of the rest.\n\n2) Explore Options and Take Personalized Tours: We\'ll present you with curated space options and arrange personalized tours to ensure you find the perfect fit.\n\n3) Negotiation and Agreement Finalization: Our expert team will negotiate the best price on your behalf and handle all necessary paperwork, ensuring a smooth and efficient process.\n\n4) Quick Move-In and Seamless Onboarding: We\'ll ensure a swift and hassle-free transition, getting you settled and operational in no time.',
      iconColor: 'bg-purple-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Your own office consultant',
      desc:
        'One-on-one support to find the right property, finalize terms and ensure smooth onboarding.',
      iconColor: 'bg-red-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 10-6 0 3 3 0 006 0z" />
        </svg>
      ),
    },
    {
      title: 'Partner with premium brand, largest network of offices',
      desc:
        'Verified office spaces across Mumbai&apos;s top micro-markets to match every need and budget.',
      iconColor: 'bg-green-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l9 4 9-4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9 4 9-4" />
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Share Your Requirements',
      desc: 'Provide us with your workspace needs, and we\'ll take care of the rest.',
    },
    {
      number: '2',
      title: 'Explore Options and Take Personalized Tours',
      desc: 'We\'ll present you with curated space options and arrange personalized tours to ensure you find the perfect fit.',
    },
    {
      number: '3',
      title: 'Negotiation and Agreement Finalization',
      desc: 'Our expert team will negotiate the best price on your behalf and handle all necessary paperwork, ensuring a smooth and efficient process.',
    },
    {
      number: '4',
      title: 'Quick Move-In and Seamless Onboarding',
      desc: 'We\'ll ensure a swift and hassle-free transition, getting you settled and operational in no time.',
    },
  ];

  return (
    <>
    <style dangerouslySetInnerHTML={{
      __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `
    }} />
      <section className="relative py-16 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-blue-900">
              Why Choose Us?
            </h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Benefit Cards */}
            <div className="space-y-6">
              {items.map((it, itemIndex) => {
                // Skip "Zero brokerage fee" - it will be shown below the image
                if (it.title === 'Zero brokerage fee') {
                  return null;
                }

                // Check if this is the "4 Easy Steps" item (2nd item, index 1)
                const isStepsItem = it.title.includes('Find and Book Your Perfect Workspace');
                
                if (isStepsItem) {
                  // Parse the steps from description
                  const stepLines = it.desc.split('\n\n').filter(line => line.trim());
                  
                  return (
                    <div
                      key={it.title}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-16 h-16 ${it.iconColor} rounded-xl text-white flex items-center justify-center flex-shrink-0`}>
                          {it.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            <span className="text-blue-400">Find and Book</span>
                            <span className="text-black"> Your Perfect Workspace in 4 Easy Steps With Beyond Space</span>
                          </h3>
                        </div>
                      </div>
                      
                      {/* Steps with step-like styling */}
                      <div className="space-y-4 relative pl-4">
                        {stepLines.map((stepLine, stepIndex) => {
                          const stepMatch = stepLine.match(/^([1-4])\)\s*(.+?):\s*([\s\S]+?)$/);
                          if (!stepMatch) return null;
                          
                          const [, stepLetter, stepTitle, stepDesc] = stepMatch;
                          
                          return (
                            <div
                              key={stepIndex}
                              className="relative flex gap-4"
                            >
                              {/* Connecting Line (except for last step) */}
                              {stepIndex < stepLines.length - 1 && (
                                <div className="absolute left-[18px] top-[40px] w-0.5 h-[calc(100%+1rem)] bg-gradient-to-b from-purple-400 via-blue-400 to-cyan-400 z-0"></div>
                              )}
                              
                              {/* Step Number Badge */}
                              <div className="relative z-10 flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 text-white font-extrabold text-sm shadow-lg shadow-purple-500/40 ring-2 ring-white">
                                  {stepLetter}
                                </div>
                              </div>
                              
                              {/* Step Content */}
                              <div className="flex-1 relative z-10">
                                <h4 className="text-base font-bold text-gray-900 mb-1">
                                  {stepTitle.trim()}:
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {stepDesc.trim()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                
                // Regular item styling
                return (
                  <div
                    key={it.title}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${it.iconColor} rounded-xl text-white flex items-center justify-center flex-shrink-0`}>
                        {it.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{it.title}</h3>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">{it.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side - Client Images Slider */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-r-8 border-b-8 border-blue-400 shadow-2xl h-[600px]">
                {clientImages.map((client, index) => (
                  <img
                    key={index}
                    src={client.src}
                    alt={client.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      index === currentClientIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                {/* Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {clientImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentClientIndex(index)}
                      className={`transition-all duration-300 ${
                        index === currentClientIndex
                          ? 'w-8 h-2 bg-white rounded-full'
                          : 'w-2 h-2 bg-white/60 hover:bg-white/80 rounded-full'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Zero brokerage fee card below image */}
              {(() => {
                const zeroBrokerageItem = items.find(it => it.title === 'Zero brokerage fee');
                if (!zeroBrokerageItem) return null;
                
                return (
                  <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 ${zeroBrokerageItem.iconColor} rounded-xl text-white flex items-center justify-center flex-shrink-0`}>
                        {zeroBrokerageItem.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{zeroBrokerageItem.title}</h3>
                        <div className="text-gray-600 leading-relaxed whitespace-pre-line">{zeroBrokerageItem.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      <ShareRequirementsModal 
        isOpen={isShareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
      />
    </>
  );
}
