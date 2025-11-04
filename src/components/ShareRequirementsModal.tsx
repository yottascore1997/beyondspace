'use client';

import { useState } from 'react';

interface ShareRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareRequirementsModal({ isOpen, onClose }: ShareRequirementsModalProps) {
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={handleClose}
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
              onClick={handleClose}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                  >
                    <option value="">Select Type</option>
                    <option>Coworking</option>
                    <option>Managed Office</option>
                    <option>Virtual Office</option>
                    <option>Meeting Room</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Of Seats</label>
                  <select
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
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
    </>
  );
}

