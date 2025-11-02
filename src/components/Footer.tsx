'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const socialLinks = [
    {
      href: 'https://www.linkedin.com/in/beyond-space-666953a6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
      label: 'LinkedIn',
      iconSrc: 'https://cdn-icons-png.flaticon.com/512/174/174857.png'
    },
    {
      href: 'https://www.instagram.com/beyondspace_realestate?igsh=NHpnMHlvc210YXht&utm_source=qr',
      label: 'Instagram',
      iconSrc: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png'
    },
    {
      href: 'https://youtube.com/@beyondspaceoffical?si=-eHyjKavvUBq09Z4',
      label: 'YouTube',
      iconSrc: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
    },
    {
      href: 'https://www.facebook.com/share/1BVfAnaWtg/?mibextid=wwXIfr',
      label: 'Facebook',
      iconSrc: 'https://cdn-icons-png.flaticon.com/512/733/733547.png'
    }
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
    <footer className="relative overflow-hidden text-white">
      {/* Animated Gradient Background - India Tricolor Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-white to-emerald-700">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.2),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.2),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(251,146,60,0.15)_0%,rgba(255,255,255,0.1)_50%,rgba(16,185,129,0.15)_100%)]" />
      </div>

      {/* Floating Orbs Animation - India Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-16 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo and Description Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img
                    src="/images/logo.jpeg"
                    alt="Beyond Space Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-3xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Beyond
                </span>{' '}
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Space
                </span>
              </span>
            </Link>
            <p className="text-base text-slate-800 leading-relaxed mb-6 font-medium">
              Premium commercial real estate advisors helping enterprises discover, evaluate and close Grade-A office spaces across Mumbai's prime business districts.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500/30 to-amber-600/30 backdrop-blur-md border border-amber-400/40 px-4 py-2.5 text-white shadow-lg hover:from-amber-500/40 hover:to-amber-600/40 hover:border-amber-400/60 transition-all">
                <svg className="w-4 h-4 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-slate-900">Mumbai, India</span>
              </span>
              <a href="tel:+919820744251" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 backdrop-blur-md border border-emerald-400/40 px-4 py-2.5 text-white shadow-lg hover:from-emerald-500/40 hover:to-emerald-600/40 hover:border-emerald-400/60 transition-all">
                <svg className="w-4 h-4 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm font-semibold text-slate-900">+91 98207 44251</span>
              </a>
            </div>
          </div>

          {/* Solutions and Contact Section */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-6 pb-2 border-b border-amber-500/40">Solutions</p>
              <ul className="space-y-3">
                <li><Link href="/category/coworking-space" className="text-slate-800 hover:text-amber-600 hover:translate-x-1 transition-all inline-block font-medium">Coworking Spaces</Link></li>
                <li><Link href="/category/managed-office" className="text-slate-800 hover:text-amber-600 hover:translate-x-1 transition-all inline-block font-medium">Managed Offices</Link></li>
                <li><Link href="/category/dedicated-desk" className="text-slate-800 hover:text-amber-600 hover:translate-x-1 transition-all inline-block font-medium">Dedicated Desks</Link></li>
                <li><Link href="/category/enterprise-solutions" className="text-slate-800 hover:text-amber-600 hover:translate-x-1 transition-all inline-block font-medium">Enterprise Offices</Link></li>
                <li><Link href="/category/virtual-office" className="text-slate-800 hover:text-amber-600 hover:translate-x-1 transition-all inline-block font-medium">Virtual Offices</Link></li>
                <li><Link href="/category/meeting-room" className="text-slate-800 hover:text-amber-600 hover:translate-x-1 transition-all inline-block font-medium">Meeting Rooms</Link></li>
                <li><Link href="/category/flexi-desk" className="text-slate-800 hover:text-amber-600 hover:translate-x-1 transition-all inline-block font-medium">Flexi Desks</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-6 pb-2 border-b border-emerald-500/40">Contact</p>
              <ul className="space-y-3 mb-6">
                <li>
                  <a href="mailto:contact@beyondspacework.com" className="text-slate-800 hover:text-emerald-600 transition-colors font-medium break-all">
                    contact@beyondspacework.com
                  </a>
                </li>
              </ul>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                target="_blank" 
                rel="noopener noreferrer"
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/30 to-emerald-500/30 backdrop-blur-md border border-amber-400/40 flex items-center justify-center hover:from-amber-500/50 hover:to-emerald-500/50 hover:scale-110 hover:border-amber-500/60 transition-all shadow-lg"
                  >
                    <span className="sr-only">{social.label}</span>
                    <img src={social.iconSrc} alt={social.label} className="w-5 h-5 object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl bg-gradient-to-br from-orange-500/20 via-blue-600/20 to-cyan-500/20 backdrop-blur-xl p-8 shadow-2xl border border-orange-400/30 hover:border-orange-400/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <p className="text-xl font-bold text-white mb-3">Let&apos;s curate your next workspace</p>
                <p className="text-white/90 leading-relaxed mb-6">
                  Tell us about your ideal location and team size. Our consultants respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-cyan-400 px-6 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/70 hover:scale-[1.02] transition-all"
                >
                  Share Requirements
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-center text-white/60 text-sm">
            © 2025 Beyond Space. All rights reserved.
          </p>
        </div>

        
      </div>

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
    </footer>
    </>
  );
}

