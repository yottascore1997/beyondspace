'use client';

import Link from 'next/link';
import { useState } from 'react';

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-gray-200 shadow-lg">
      
      <div className="w-full px-0 relative">
        <div className="flex items-center justify-between py-4 pl-0 pr-2 md:px-4">
          {/* Premium Logo Section */}
          <Link href="/" className="flex items-center gap-5 group">
            <div className="relative">
              {/* Glowing Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 animate-pulse transition-opacity"></div>
              {/* Main Logo */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-2xl shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border-2 border-black/50">
                <img 
                  src="/images/logo.jpeg" 
                  alt="Beyond Space Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-black text-4xl md:text-5xl leading-tight tracking-tight drop-shadow-2xl">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Beyond
                </span>{' '}
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Space
                </span>
              </span>
              <span className="text-sm md:text-base font-bold tracking-widest uppercase text-black">
                One Stop Solution For Your Office Space
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={openRequirementModal}
              className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-400/40 transform hover:scale-110 transition-all duration-300 border border-orange-400/60 shadow-lg"
            >
              Share Requirement
            </button>
            <a
              href="/list-your-space"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 hover:shadow-2xl hover:shadow-blue-400/50 transform hover:scale-110 transition-all duration-300 border border-blue-200/60 shadow-lg"
            >
              List Your Space
            </a>
            <a
              href="https://wa.me/919820744251"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl font-semibold hover:from-green-500 hover:to-green-600 hover:shadow-2xl hover:shadow-green-400/50 transform hover:scale-110 transition-all duration-300 border border-green-300/50 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="hidden lg:inline">+91 9820744251</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/95 backdrop-blur-lg">
            <nav className="flex flex-col gap-3">
              <button
                type="button"
                onClick={openRequirementModal}
                className="px-4 py-3 bg-orange-500 text-white rounded-xl font-bold text-center shadow-lg shadow-orange-400/30 border border-orange-400/40 hover:bg-orange-600 transition-colors"
              >
                Share Requirement
              </button>
              <a 
                href="/list-your-space" 
                className="px-4 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white rounded-xl font-bold text-center shadow-lg shadow-blue-400/30 border border-blue-300/40"
              >
                List Your Space
              </a>
              <a 
                href="https://wa.me/919820744251" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white font-semibold transition-all rounded-xl border border-green-500/50 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                +91 9820744251
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
    {isRequirementModalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={closeRequirementModal}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-50 flex flex-col lg:flex-row"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex-1 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Office Now!</h2>
              <p className="text-gray-700 text-lg">Our space experts will provide customized quote with detailed inventory as per your needs</p>
            </div>
            <div className="space-y-4 mb-8">
              {[
                'Customized Workspaces',
                'Prime Locations',
                'Free Guided Tours',
                'Flexible Terms'
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
              onClick={closeRequirementModal}
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
                className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white py-3 px-6 rounded-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-cyan-400/40 transition-all duration-300"
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

