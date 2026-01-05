'use client';

import { useState } from 'react';

interface ShareRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareRequirementsModal({ isOpen, onClose }: ShareRequirementsModalProps) {
  const workspaceTypes = [
    'Coworking Space',
    'Managed Office',
    'Dedicated Desk',
    'Enterprise Offices',
    'Virtual Office',
    'Meeting Room',
    'Day Pass / Flexi Desk'
  ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    seats: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSubmitError('');
    setSubmitMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('');

    try {
      // Combine type and seats into solution field
      const solution = formData.type && formData.seats 
        ? `${formData.type} - ${formData.seats} seats`
        : formData.type || formData.seats || 'General Inquiry';

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.phone,
          email: formData.email,
          solution: solution,
          message: `Type: ${formData.type || 'Not specified'}, Seats: ${formData.seats || 'Not specified'}`
        }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you for your inquiry! We will contact you soon.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: '',
          seats: ''
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSubmitMessage('');
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: '',
      seats: ''
    });
    setSubmitMessage('');
    setSubmitError('');
  };

  if (!isOpen) return null;

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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 font-['Poppins']"
        onClick={handleClose}
        style={{
          animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div
          className="bg-gradient-to-b from-blue-50 via-blue-50 to-blue-50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] relative z-50 flex flex-col lg:flex-row overflow-hidden"
          onClick={(event) => event.stopPropagation()}
          style={{
            animation: 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          <div className="p-8 flex-1 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">We Curate Workspaces That Work</h2>
              <p className="text-gray-700 text-base">Share your goals and we'll shortlist fully managed options, negotiate savings, and coordinate a stress-free move-in.</p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 leading-none">Trusted by teams at</p>
              <div className="grid grid-cols-3 gap-2 md:gap-3 gap-y-3 md:gap-y-4 items-center">
                {[
                  '/images/trusted/c1.png',
                  '/images/trusted/c2.png',
                  '/images/trusted/c3.png',
                  '/images/trusted/c4-removebg-preview.png',
                  '/images/trusted/c5.png',
                  '/images/trusted/c6.png',
                  '/images/trusted/c7.png',
                  '/images/trusted/c8.png',
                  '/images/trusted/c9.png'
                ].map((logo, index) => (
                  <div
                    key={index}
                    className={`relative mx-auto flex items-center justify-center ${
                      index === 0 ? 'h-20 w-full sm:h-24 md:h-28' : 'h-14 w-full sm:h-16 md:h-18'
                    }`}
                  >
                    <img
                      src={logo}
                      alt={`Client logo ${index + 1}`}
                      className="max-h-full max-w-full w-auto h-auto object-contain"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.display = 'none';
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 flex-1 relative bg-white/80 backdrop-blur-sm lg:rounded-r-2xl lg:rounded-tl-none rounded-b-2xl flex flex-col overflow-y-auto">
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Interested in this Property</h3>
              <p className="text-gray-600">Fill your details for a customized quote</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    style={{ color: '#111827' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    style={{ color: '#111827' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone*</label>
                <div className="flex gap-2">
                  <select className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" style={{ color: '#111827' }}>
                    <option>+91</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    style={{ color: '#111827' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    style={{ color: '#111827' }}
                  >
                    <option value="">Select Type</option>
                    {workspaceTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Of Seats</label>
                  <select
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    style={{ color: '#111827' }}
                  >
                    <option value="">Select Seats</option>
                    <option>1-5</option>
                    <option>6-10</option>
                    <option>11-20</option>
                    <option>21-50</option>
                    <option>50-70</option>
                    <option>120+</option>
                  </select>
                </div>
              </div>

              {submitMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">{submitMessage}</p>
                </div>
              )}

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                    isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 mt-6">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
                alt="Workspace consultant"
                className="w-12 h-12 rounded-full object-cover border border-blue-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">Workspace Consultant</p>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+919820744251" className="text-base font-bold text-orange-500">+91 98207 44251</a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-purple-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">Connect with our space expert</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-base font-semibold text-orange-500">
                    contact@beyondspacework.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

