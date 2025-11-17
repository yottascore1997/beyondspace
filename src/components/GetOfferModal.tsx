'use client';

import { useState } from 'react';

interface GetOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaName?: string;
}

export default function GetOfferModal({ isOpen, onClose, areaName }: GetOfferModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    teamSize: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form submission logic here
    console.log('Form submitted:', formData);
    // Reset form and close modal
    setFormData({ name: '', mobile: '', email: '', teamSize: '' });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-5 sm:p-6 max-w-md w-full relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">
            Enter your details to request callback
          </h3>
          <p className="text-black text-xs sm:text-sm leading-relaxed">
            Our workspace experts will get in touch to help you with your requirements.
          </p>
        </div>

        {/* Offer Details */}
        <div className="text-center mb-4">
          <div className="mb-1.5">
            <span className="text-gray-700 font-medium text-xs sm:text-sm">Offer valid till </span>
            <span className="text-orange-500 font-bold text-xs sm:text-sm">Saturday</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="text-red-500 font-bold text-xs sm:text-sm">
              <span className="line-through">One Month Rent</span>
            </div>
            <div className="text-green-600 font-bold text-sm sm:text-base">
              Zero Brokerage
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Your Name *"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter Your Mobile No *"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email Id *"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              required
            />
          </div>
          <div>
            <select 
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-600"
              required
            >
              <option value="">Team Size *</option>
              <option value="1-5">1-5 People</option>
              <option value="6-10">6-10 People</option>
              <option value="11-20">11-20 People</option>
              <option value="21-50">21-50 People</option>
              <option value="50+">50+ People</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-900 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Request Callback
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>

        {/* Trust Indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-black">
          <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Your data is 100% Safe with us!
        </div>
      </div>
    </div>
  );
}

