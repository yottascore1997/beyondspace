'use client';

import { useState } from 'react';

interface ShareRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showFullForm?: boolean; // If false, shows only "Interested in this Property" section
  customLeftContent?: React.ReactNode; // Custom left side content (e.g., for Enterprise Office)
}

export default function ShareRequirementsModal({ isOpen, onClose, showFullForm = true, customLeftContent }: ShareRequirementsModalProps) {
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
  const [submitError, setSubmitError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

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
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: '',
          seats: ''
        });
        setShowSuccessPopup(true);
        // Naya popup 5 sec baad band + main modal bhi close
        setTimeout(() => {
          setShowSuccessPopup(false);
          onClose();
        }, 5000);
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
    setSubmitError('');
    setShowSuccessPopup(false);
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
          @keyframes successPopIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes progressShrink {
            from { width: 100%; }
            to { width: 0%; }
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
          className={`${showFullForm 
            ? 'bg-gradient-to-b from-blue-50 via-blue-50 to-blue-50 rounded-2xl shadow-2xl max-w-lg lg:max-w-5xl w-full max-h-[90vh] relative z-50 flex flex-col lg:flex-row overflow-hidden'
            : 'bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] relative z-50 flex flex-col overflow-hidden'
          }`}
          onClick={(event) => event.stopPropagation()}
          style={{
            animation: 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {showFullForm && (
            <div className="hidden lg:flex p-8 flex-1 rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none flex-col">
              {customLeftContent ? (
                // Custom left content (e.g., for Enterprise Office)
                customLeftContent
              ) : (
                // Default left content
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">We Curate Workspaces That Work</h2>
                    <p className="text-gray-700 text-base">Share your goals and we'll shortlist fully managed options, negotiate savings, and coordinate a stress-free move-in.</p>
                  </div>

                  <div className="flex-1 flex flex-col items-start justify-start mt-0 relative">
                    <h3 className="text-xs md:text-sm font-medium text-gray-400 mb-1 text-left w-full">Trusted by Leading Companies</h3>
                    <img
                      src="/images/clientForm.png"
                      alt="Client form"
                      className="w-full h-auto max-w-[95%] object-contain rounded-lg mt-2"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className={`p-6 lg:p-8 flex-1 relative ${showFullForm ? 'bg-white lg:bg-white/80 backdrop-blur-sm lg:rounded-r-2xl lg:rounded-tl-none rounded-2xl' : 'bg-white rounded-2xl'} flex flex-col overflow-y-auto`}>
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className={showFullForm ? 'mb-6' : 'mb-4'}>
              <h3 className={`${showFullForm ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 ${showFullForm ? 'mb-2' : 'mb-1.5'}`}>Interested in this Property</h3>
              <p className={`${showFullForm ? 'text-gray-600' : 'text-gray-600 text-sm'}`}>Fill your details for a customized quote</p>
            </div>

            <form onSubmit={handleSubmit} className={showFullForm ? 'space-y-4' : 'space-y-3'}>
              <div className={`grid grid-cols-1 ${showFullForm ? 'sm:grid-cols-2' : ''} ${showFullForm ? 'gap-4' : 'gap-3'}`}>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 ${showFullForm ? 'mb-1' : 'mb-1'}`}>Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                    className={`w-full ${showFullForm ? 'px-4 py-3' : 'px-3 py-2'} border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm`}
                    style={{ color: '#111827' }}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 ${showFullForm ? 'mb-1' : 'mb-1'}`}>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className={`w-full ${showFullForm ? 'px-4 py-3' : 'px-3 py-2'} border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm`}
                    style={{ color: '#111827' }}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium text-gray-700 ${showFullForm ? 'mb-1' : 'mb-1'}`}>Phone*</label>
                <div className="flex gap-2">
                  <select className={`${showFullForm ? 'px-3 py-3' : 'px-2 py-2'} border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm`} style={{ color: '#111827' }}>
                    <option>+91</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                    className={`flex-1 ${showFullForm ? 'px-4 py-3' : 'px-3 py-2'} border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm`}
                    style={{ color: '#111827' }}
                  />
                </div>
              </div>

              <div className={`grid grid-cols-1 ${showFullForm ? 'sm:grid-cols-2' : ''} ${showFullForm ? 'gap-4' : 'gap-3'}`}>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 ${showFullForm ? 'mb-1' : 'mb-1'}`}>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full ${showFullForm ? 'px-4 py-3' : 'px-3 py-2'} border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm`}
                    style={{ color: '#111827' }}
                  >
                    <option value="">Select Type</option>
                    {workspaceTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium text-gray-700 ${showFullForm ? 'mb-1' : 'mb-1'}`}>No. Of Seats</label>
                  <select
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    className={`w-full ${showFullForm ? 'px-4 py-3' : 'px-3 py-2'} border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm`}
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

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{submitError}</p>
                </div>
              )}

              <div className={showFullForm ? 'pt-2' : 'pt-1'}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full ${showFullForm ? 'py-3' : 'py-2.5'} rounded-lg font-semibold text-white transition-all duration-300 text-sm ${
                    isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>

            {showFullForm && (
              <>
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 mb-1">Connect with us our number</p>
                    <a href="tel:+919820744251" className="text-base font-semibold text-orange-500">+91 9820 744 251</a>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900 mb-1">Connect with us our email</p>
                    <a href="mailto:contact@beyondspacework.com" className="text-base font-semibold text-orange-500">
                      contact@beyondspacework.com
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Naya beautiful popup - form submit ke baad upar dikhega, 5 sec baad band */}
      {showSuccessPopup && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 font-['Poppins']"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border border-green-100"
            style={{
              animation: 'successPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)'
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thanks for Submitting!</h3>
            <p className="text-gray-600 text-sm mb-1">
              Your requirements have been received successfully.
            </p>
            <p className="text-gray-500 text-xs">Our team will reach out to you shortly.</p>
            <div className="mt-4 h-1.5 w-28 bg-gray-200 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                style={{ 
                  animation: 'progressShrink 5s linear forwards',
                  transformOrigin: 'left'
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Closing in 5 seconds...</p>
          </div>
        </div>
      )}
    </>
  );
}

