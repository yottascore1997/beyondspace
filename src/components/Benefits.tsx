'use client';

import { useState, useEffect } from 'react';

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
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{it.title}</h3>
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
            </div>
          </div>
        </div>
      </section>

      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShareModalOpen(false)}
          style={{
            animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-50 flex flex-col lg:flex-row"
            onClick={(event) => event.stopPropagation()}
            style={{
              animation: 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex-1 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Office Now!</h2>
                <p className="text-gray-700 text-base">Our workspace experts will provide a customized quote with detailed inventory tailored to your needs.</p>
              </div>
              <div className="space-y-4">
                {['Customized Workspaces', 'Prime Locations', 'Free Guided Tours', 'Flexible Terms'].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-800 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 flex-1 relative">
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Interested in this Property</h3>
                <p className="text-gray-600">Fill your details for a customized quote</p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                  <div className="flex gap-2">
                    <select className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                      <option>+91</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300">
                      <option>Select Type</option>
                      <option>Coworking</option>
                      <option>Managed Office</option>
                      <option>Virtual Office</option>
                      <option>Meeting Room</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Of Seats</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300">
                      <option>Select Seats</option>
                      <option>1-5</option>
                      <option>6-10</option>
                      <option>11-20</option>
                      <option>21-50</option>
                      <option>50+</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg"
                >
                  Submit
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-purple-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Connect with our space expert</p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                      contact@beyondspacework.com
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
