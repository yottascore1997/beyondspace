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
      title: 'Partner with premium brand',
      desc:
        'Certified office spaces across Mumbai’s top micro-markets, tailored to every team’s needs and budget.',
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
        .cta-gradient {
          background: linear-gradient(90deg, #fb923c, #f97316, #ec4899, #fb923c);
          background-size: 200% 200%;
          transition: background-position 0.6s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .cta-gradient:hover {
          background-position: 100% 0%;
          transform: translateY(-3px);
          box-shadow: 0 18px 45px rgba(249, 115, 22, 0.35);
        }
      `
    }} />
      <section className="relative py-8 md:py-10 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
        <div className="max-w-[1600px] mx-auto px-4 xl:px-8 2xl:px-12">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-blue-900">
              Why Choose Us?
            </h2>
            <div className="w-12 md:w-16 h-0.5 md:h-1 bg-orange-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Left Side - Benefit Cards */}
            <div className="space-y-4 md:space-y-5">
              {items.map((it, itemIndex) => {
                // Skip partner item; it will be rendered below the image
                if (it.title === 'Partner with premium brand') {
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
                      className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className={`w-12 h-12 md:w-14 md:h-14 ${it.iconColor} rounded-lg md:rounded-xl text-white flex items-center justify-center flex-shrink-0`}>
                          <div className="w-6 h-6 md:w-7 md:h-7 [&>svg]:w-full [&>svg]:h-full">
                            {it.icon}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold mb-1.5 md:mb-2">
                            <span className="text-black">We&apos;ll Assist You </span>
                            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-red-500 bg-clip-text text-transparent">Find</span>
                            <span className="text-black"> and </span>
                            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-red-500 bg-clip-text text-transparent">Book</span>
                            <span className="text-black"> Your Perfect Workspace In 4 Easy Steps.</span>
                          </h3>
                        </div>
                      </div>
                      
                      {/* Steps with step-like styling */}
                      <div className="space-y-3 md:space-y-4 relative pl-3 md:pl-4">
                        {stepLines.map((stepLine, stepIndex) => {
                          const stepMatch = stepLine.match(/^([1-4])\)\s*(.+?):\s*([\s\S]+?)$/);
                          if (!stepMatch) return null;
                          
                          const [, stepLetter, stepTitle, stepDesc] = stepMatch;
                          
                          return (
                            <div
                              key={stepIndex}
                              className="relative flex gap-3 md:gap-4"
                            >
                              {/* Connecting Line (except for last step) */}
                              {stepIndex < stepLines.length - 1 && (
                                <div className="absolute left-[14px] md:left-[18px] top-[32px] md:top-[40px] w-0.5 h-[calc(100%+0.75rem)] md:h-[calc(100%+1rem)] bg-gradient-to-b from-purple-400 via-blue-400 to-cyan-400 z-0"></div>
                              )}
                              
                              {/* Step Number Badge */}
                              <div className="relative z-10 flex-shrink-0">
                                <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 text-white font-extrabold text-xs md:text-sm shadow-lg shadow-purple-500/40 ring-2 ring-white">
                                  {stepLetter}
                                </div>
                              </div>
                              
                              {/* Step Content */}
                              <div className="flex-1 relative z-10">
                                <h4 className="text-sm md:text-base font-bold text-gray-900 mb-1">
                                  {stepTitle.trim()}:
                                </h4>
                                <p className="text-xs md:text-sm text-black leading-relaxed">
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
                    className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 ${it.iconColor} rounded-lg md:rounded-xl text-white flex items-center justify-center flex-shrink-0`}>
                        <div className="w-6 h-6 md:w-7 md:h-7 [&>svg]:w-full [&>svg]:h-full">
                          {it.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">{it.title}</h3>
                        <div className="text-sm md:text-base text-black leading-relaxed whitespace-pre-line">{it.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side - Client Images Slider */}
            <div className="relative lg:-mt-2">
              <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border-r-4 md:border-r-6 lg:border-r-8 border-b-4 md:border-b-6 lg:border-b-8 border-blue-400 shadow-2xl h-[480px] md:h-[580px] lg:h-[630px]">
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
              
              {/* Partner network card below image */}
              {(() => {
                const partnerItem = items.find(it => it.title === 'Partner with premium brand');
                if (!partnerItem) return null;
                
                return (
                  <div className="mt-10 md:mt-12 lg:mt-14 bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-5 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 ${partnerItem.iconColor} rounded-lg md:rounded-xl text-white flex items-center justify-center flex-shrink-0`}>
                        <div className="w-6 h-6 md:w-7 md:h-7 [&>svg]:w-full [&>svg]:h-full">
                          {partnerItem.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1.5 md:mb-2">{partnerItem.title}</h3>
                        <div className="text-sm md:text-base text-black leading-relaxed whitespace-pre-line">{partnerItem.desc}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="mt-8 md:mt-10 text-center">
            <button
              onClick={() => setShareModalOpen(true)}
              className="cta-gradient inline-flex items-center gap-2 px-8 md:px-10 lg:px-12 py-3 md:py-4 rounded-full text-white text-base md:text-lg lg:text-xl font-semibold shadow-lg"
            >
              Schedule Your Free Workspace Consultation
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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
