'use client';

import { useState } from 'react';

export default function Benefits() {
  const [isShareModalOpen, setShareModalOpen] = useState(false);

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
      title: 'Quick turnaround time',
      desc:
        'Experience swift and effective solutions — from shortlisting to onboarding in record time.',
      iconColor: 'bg-purple-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
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
      title: 'Largest network',
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
      desc: 'Tell us what you need and a dedicated advisor will handle everything end-to-end.',
    },
    {
      number: '2',
      title: 'Get Space Options & Personalised Tours',
      desc: 'Shortlist from curated options and experience guided walkthroughs of your favourites.',
    },
    {
      number: '3',
      title: 'We Negotiate, You Save',
      desc: 'Leverage our relationships to secure the most flexible terms and best value deals.',
    },
    {
      number: '4',
      title: 'Move-In Quickly & Get To Work',
      desc: 'We coordinate paperwork, fit-outs and onboarding so your team can start immediately.',
    },
  ];

  return (
    <>
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
              {items.map((it) => (
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
                      <p className="text-gray-600 leading-relaxed">{it.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border-r-8 border-b-8 border-blue-400 shadow-2xl">
                <img
                  src="/images/chooseus.jpeg"
                  alt="Premium office space"
                  className="w-full h-[600px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-blue-500 mb-3">How It Works</p>
                <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold text-slate-900 leading-snug">
                  Find and <span className="text-orange-500">Book</span> Your Perfect Workspace
                  <br />in 4 Easy Steps with{' '}
                  <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    Beyond Space
                  </span>
                </h2>
              </div>

              <div className="space-y-5">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className="relative flex gap-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-orange-300/40">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 px-5 py-3 text-white font-semibold shadow-lg shadow-orange-400/40 hover:shadow-pink-400/40 transition-all w-full text-sm md:text-base md:w-[calc(100%-64px)]"
              >
                Connect with a Workspace Expert Today
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-blue-200/30 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border-8 border-white shadow-[0_40px_90px_rgba(30,64,175,0.35)] h-[520px]">
                <img
                  src="/images/co4.jpeg"
                  alt="Workspace lounge"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-50 flex flex-col lg:flex-row"
            onClick={(event) => event.stopPropagation()}
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
