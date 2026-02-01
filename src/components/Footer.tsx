'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Poppins } from 'next/font/google';
import ShareRequirementsModal from './ShareRequirementsModal';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

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
    <footer className={`${poppins.className} bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 text-gray-800 w-full border-t-2 border-gray-500`}>
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-0.5 group">
              <div className="relative mt-2.5 -ml-4">
                {/* Main Logo */}
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <img 
                    src="/images/logo.png" 
                    alt="Beyond Space Logo" 
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-0.5 min-w-[200px] sm:min-w-[240px] md:min-w-[280px]">
                <span className="font-black text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight drop-shadow-lg">
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Beyond
                  </span>{' '}
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Space
                  </span>
                </span>
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold tracking-wide normal-case text-black">
                  ✦ One Stop Solution For Your Office Space ✦
                </span>
              </div>
            </Link>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-5 font-medium">
              Premium commercial real estate advisors helping enterprises discover Grade-A office spaces across Mumbai.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>Mumbai, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-base font-bold text-blue-700 mb-5 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/category/coworking-space" className="text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors inline-block hover:translate-x-1 transition-transform">Coworking Spaces</Link></li>
              <li><Link href="/category/managed-office" className="text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors inline-block hover:translate-x-1 transition-transform">Managed Offices</Link></li>
              <li><Link href="/category/dedicated-desk" className="text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors inline-block hover:translate-x-1 transition-transform">Dedicated Desks</Link></li>
              <li><Link href="/category/enterprise-solutions" className="text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors inline-block hover:translate-x-1 transition-transform">Enterprise Offices</Link></li>
              <li><Link href="/category/virtual-office" className="text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors inline-block hover:translate-x-1 transition-transform">Virtual Offices</Link></li>
              <li><Link href="/category/meeting-room" className="text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors inline-block hover:translate-x-1 transition-transform">Meeting Rooms</Link></li>
            </ul>
          </div>

          {/* Contact and Social */}
          <div className="md:col-span-1">
            <h3 className="text-base font-bold text-blue-700 mb-5 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="mailto:contact@beyondspacework.com" className="text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors break-all inline-block">
                  contact@beyondspacework.com
                </a>
              </li>
              <li>
                <a href="tel:+919820744251" className="text-sm md:text-base text-gray-700 hover:text-blue-600 font-medium transition-colors inline-block">
                  +91 9820 744 251
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mb-5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:bg-blue-600 hover:border-blue-600 flex items-center justify-center transition-all hover:scale-110 shadow-md hover:shadow-lg"
                >
                  <span className="sr-only">{social.label}</span>
                  <img src={social.iconSrc} alt={social.label} className="w-5 h-5 object-contain" loading="lazy" decoding="async" />
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm md:text-base font-bold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105"
            >
              Share Requirements
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom - Links */}
      <div className="border-t border-gray-300 pt-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600 font-medium">
            © {new Date().getFullYear()} Beyond Space. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Privacy Policy
            </Link>
          </div>
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

