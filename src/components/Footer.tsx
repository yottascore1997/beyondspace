'use client';

import Link from 'next/link';
import { useState } from 'react';
import ShareRequirementsModal from './ShareRequirementsModal';

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

      <ShareRequirementsModal 
        isOpen={isShareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
      />
    </footer>
    </>
  );
}

