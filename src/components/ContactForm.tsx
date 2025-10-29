'use client';

import { useState } from 'react';

interface ContactFormData {
  name: string;
  mobile: string;
  email: string;
  solution: string;
  message: string;
}

const solutionOptions = [
  { value: 'meeting-rooms', label: 'Meeting Rooms', icon: '🏢' },
  { value: 'coworking-space', label: 'Coworking Space', icon: '💼' },
  { value: 'office', label: 'Office Space', icon: '🏢' },
  { value: 'commercial', label: 'Commercial Space', icon: '🏪' },
  { value: 'residential', label: 'Residential', icon: '🏠' },
];

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    mobile: '',
    email: '',
    solution: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.solution) {
      newErrors.solution = 'Please select a solution';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Thank you for your inquiry! We will contact you soon.');
        setFormData({
          name: '',
          mobile: '',
          email: '',
          solution: '',
          message: '',
        });
      } else {
        setMessage(data.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Left Side - Form Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Let us find your perfect Property
                </h2>
                <p className="text-xl text-gray-600">
                  Connect to a Beyond Estates Expert now
                </p>
              </div>

              {/* Status Message */}
              {message && (
                <div className={`mb-6 p-4 rounded-xl ${
                  message.includes('Thank you') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Row - Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent transition-all duration-300 ${
                        errors.name ? 'border-red-400 bg-red-50' : 'hover:border-gray-400'
                      }`}
                      placeholder="Enter your name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent transition-all duration-300 ${
                        errors.email ? 'border-red-400 bg-red-50' : 'hover:border-gray-400'
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                {/* Second Row - Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">+91 Phone*</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent transition-all duration-300 ${
                      errors.mobile ? 'border-red-400 bg-red-50' : 'hover:border-gray-400'
                    }`}
                    placeholder="Enter your phone number"
                    maxLength={10}
                  />
                  {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                </div>

                {/* Third Row - Type of Space and City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Type Of Space</label>
                    <select
                      name="solution"
                      value={formData.solution}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent transition-all duration-300 appearance-none ${
                        errors.solution ? 'border-red-400 bg-red-50' : 'hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select space type</option>
                      {solutionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.solution && <p className="mt-1 text-sm text-red-600">{errors.solution}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Select City*</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent transition-all duration-300 appearance-none hover:border-gray-400"
                    >
                      <option value="">Select city</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="pune">Pune</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-4 px-12 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Circular Image */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop"
                    alt="Modern office space"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-[#a08efe] to-purple-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-30 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
