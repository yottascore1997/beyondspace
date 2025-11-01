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
    <footer className="relative overflow-hidden text-white bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(107,114,255,0.35),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.35),_transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(135deg,rgba(79,70,229,0.18)_0%,rgba(14,165,233,0)_45%,rgba(59,130,246,0)_100%)]" />
      </div>

      <div className="relative container mx-auto px-4 py-12 text-slate-900">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/20 shadow-lg shadow-blue-500/30 group-hover:scale-105 group-hover:rotate-2 transition-all duration-500">
                  <img
                    src="/images/logo.jpeg"
                    alt="Beyond Space Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            <span
              className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent"
              style={{ textShadow: '0 0 18px rgba(255,194,122,0.45)' }}
            >
              Beyond Space
            </span>
            </Link>
            <p className="text-lg text-slate-700 leading-relaxed">
              Premium commercial real estate advisors helping enterprises discover, evaluate and close Grade-A office spaces across Mumbai’s prime business districts.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-white shadow-lg shadow-slate-900/25">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Mumbai, India
              </span>
              <a href="tel:+919820744251" className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-2 text-white shadow-lg shadow-slate-900/25 hover:bg-slate-900 transition-colors">
                <svg className="w-4 h-4 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +91 98207 44251
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-14 text-lg text-slate-800">
            <div>
              <p className="text-base font-bold uppercase tracking-[0.35em] text-blue-700 mb-4">Solutions</p>
              <ul className="space-y-3.5 text-slate-700 font-semibold">
                <li><Link href="/category/coworking-space" className="hover:text-[#0b7adf] transition-colors">Coworking Spaces</Link></li>
                <li><Link href="/category/managed-office" className="hover:text-[#0b7adf] transition-colors">Managed Offices</Link></li>
                <li><Link href="/category/dedicated-desk" className="hover:text-[#0b7adf] transition-colors">Dedicated Desks</Link></li>
                <li><Link href="/category/enterprise-solutions" className="hover:text-[#0b7adf] transition-colors">Enterprise Offices</Link></li>
                <li><Link href="/category/virtual-office" className="hover:text-[#0b7adf] transition-colors">Virtual Offices</Link></li>
                <li><Link href="/category/meeting-room" className="hover:text-[#0b7adf] transition-colors">Meeting Rooms</Link></li>
                <li><Link href="/category/flexi-desk" className="hover:text-[#0b7adf] transition-colors">Flexi Desks</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-base font-bold uppercase tracking-[0.35em] text-blue-700 mb-4">Contact</p>
              <ul className="space-y-3.5 text-slate-700 font-semibold">
                <li>
                  <a href="mailto:contact@beyondspacework.com" className="hover:text-[#0b7adf] transition-colors">
                    contact@beyondspacework.com
                  </a>
                </li>
              </ul>
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-white/15 bg-white flex items-center justify-center hover:border-[#70f3d1] hover:shadow-lg transition-all"
                  >
                    <span className="sr-only">{social.label}</span>
                    <img src={social.iconSrc} alt={social.label} className="w-5 h-5 object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-md rounded-2xl bg-slate-900/90 backdrop-blur-xl p-8 shadow-xl shadow-black/40 border border-white/10">
            <p className="text-lg font-semibold text-white">Let&apos;s curate your next workspace</p>
            <p className="mt-3 text-base text-slate-200/90 leading-relaxed">
              Tell us about your ideal location and team size. Our consultants respond within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0aff9d] via-[#1de5ff] to-[#5a4bff] px-6 py-3.5 text-lg font-semibold text-white shadow-lg shadow-[#1de5ff]/30 hover:shadow-[#5a4bff]/40 transition-shadow"
            >
              Share Requirements
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        
      </div>

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
    </footer>
  );
}

