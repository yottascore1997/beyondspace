'use client';

import { useState } from 'react';

interface PropertyContactFormProps {
  propertyTitle?: string;
  propertyType?: string;
  propertyCity?: string;
  isShaking?: boolean;
}

export default function PropertyContactForm({ propertyTitle, propertyType, propertyCity, isShaking }: PropertyContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    area: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          solution: propertyType || 'property-inquiry',
          message: `Interested in: ${propertyTitle || 'Property'}\n${formData.message}`
        }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you! We will contact you soon.');
        setFormData({
          name: '',
          email: '',
          mobile: '',
          area: '',
          message: ''
        });
      } else {
        setSubmitMessage('Failed to submit. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-blue-200/95 via-indigo-200/95 to-purple-200/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 lg:sticky lg:top-4 border border-indigo-400/50 transition-all duration-500 ${isShaking ? 'animate-bounce' : ''}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
          Get {propertyType || 'Property'} in {propertyCity || 'Mumbai'}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          Beyond Space Work Consultant assisted 150+ corporates in Mumbai to move into their new office.
        </p>
      </div>

      {/* Status Message */}
      {submitMessage && (
        <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${
          submitMessage.includes('Thank you') 
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200' 
            : 'bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border border-rose-200'
        }`}>
          {submitMessage}
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name*"
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 backdrop-blur-sm transition-all duration-300"
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address*"
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 backdrop-blur-sm transition-all duration-300"
            required
          />
        </div>
        <div>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Phone Number*"
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 backdrop-blur-sm transition-all duration-300"
            required
            maxLength={10}
          />
        </div>
        <div>
          <select 
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 backdrop-blur-sm transition-all duration-300"
          >
            <option value="">Select Area</option>
            <option value="Andheri">Andheri</option>
            <option value="Bandra">Bandra</option>
            <option value="Juhu">Juhu</option>
            <option value="Worli">Worli</option>
            <option value="Powai">Powai</option>
            <option value="Thane">Thane</option>
            <option value="Colaba">Colaba</option>
            <option value="Malad">Malad</option>
          </select>
        </div>
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your requirements..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm bg-slate-50/50 backdrop-blur-sm transition-all duration-300"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? 'Submitting...' : 'Connect with us'}
        </button>
      </form>

      {/* Space Expert Contact */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">Connect with our space expert</h4>
        <div className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-slate-200">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-600">Email</div>
            <a 
              href="mailto:contact@beyondspacework.com" 
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              contact@beyondspacework.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

