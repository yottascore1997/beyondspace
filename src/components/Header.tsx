'use client';

import Link from 'next/link';
import { useState } from 'react';
import ShareRequirementsModal from './ShareRequirementsModal';

// Set to true to show "List Your Space" in header
const SHOW_LIST_YOUR_SPACE = false;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRequirementModalOpen, setRequirementModalOpen] = useState(false);

  const openRequirementModal = () => {
    setIsMenuOpen(false);
    setRequirementModalOpen(true);
  };

  const closeRequirementModal = () => {
    setRequirementModalOpen(false);
  };

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
        header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 50 !important;
          width: 100% !important;
        }
        body {
          padding-top: 0 !important;
        }
        /* Add spacing after fixed header */
        header + * {
          margin-top: 0;
        }
      `
    }} />
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-lg" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, width: '100%' }}>
      <div className="w-full px-0 relative">
        <div className="mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12" style={{ maxWidth: '1920px', width: '100%' }}>
          <div className="flex items-center justify-between py-1 sm:py-1.5">
          {/* Premium Logo Section */}
          <Link href="/" className="flex items-center gap-0.5 group">
            <div className="relative mt-2.5 -ml-4">
              {/* Main Logo */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <img 
                  src="/images/logo.png" 
                  alt="Beyond Space Logo" 
                  className="w-full h-full object-contain"
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={openRequirementModal}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-400/40 transform hover:scale-105 transition-all duration-300 border border-orange-400/60 shadow-md"
            >
              Share Requirement
            </button>
            {SHOW_LIST_YOUR_SPACE && (
              <a
                href="/list-your-space"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-400/50 transform hover:scale-105 transition-all duration-300 border border-blue-200/60 shadow-md"
              >
                List Your Space
              </a>
            )}
            <a
              href="https://wa.me/919820744251"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:from-green-500 hover:to-green-600 hover:shadow-xl hover:shadow-green-400/50 transform hover:scale-105 transition-all duration-300 border border-green-300/50 group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="hidden lg:inline">Chat on WhatsApp</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 bg-white/95 backdrop-blur-lg">
            <nav className="flex flex-col gap-2 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12">
              <button
                type="button"
                onClick={openRequirementModal}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold text-center shadow-md shadow-orange-400/30 border border-orange-400/40 hover:bg-orange-600 transition-colors"
              >
                Share Requirement
              </button>
              {SHOW_LIST_YOUR_SPACE && (
                <a 
                  href="/list-your-space" 
                  className="px-3 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white rounded-lg text-sm font-semibold text-center shadow-md shadow-blue-400/30 border border-blue-300/40"
                >
                  List Your Space
                </a>
              )}
              <a 
                href="https://wa.me/919820744251" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white font-medium transition-all rounded-lg border border-green-500/50 backdrop-blur-sm text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Chat on WhatsApp
              </a>
            </nav>
          </div>
        )}
        </div>
      </div>
    </header>
    <ShareRequirementsModal 
      isOpen={isRequirementModalOpen} 
      onClose={closeRequirementModal} 
    />
    </>
  );
}

