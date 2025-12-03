'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ListYourSpacePage() {
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    area: '',
    purpose: 'RENT',
    type: 'COWORKING',
    priceDisplay: '',
    price: '',
    size: '',
    beds: '',
    rating: '4.5',
    image: '',
    description: '',
    workspaceName: '',
    workspaceTimings: '',
    workspaceClosedDays: '',
    locationDetails: '',
    metroStationDistance: '',
    railwayStationDistance: '',
    aboutWorkspace: '',
    capacity: '',
    superArea: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image;
      
      // Upload image if provided
      if (uploadedImage) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', uploadedImage);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }
      }

      const response = await fetch('/api/properties/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          price: parseInt(formData.price),
          size: parseInt(formData.size),
          rating: parseFloat(formData.rating),
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          superArea: formData.superArea ? parseInt(formData.superArea) : null,
          amenities: []
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          title: '',
          city: '',
          area: '',
          purpose: 'RENT',
          type: 'COWORKING',
          priceDisplay: '',
          price: '',
          size: '',
          beds: '',
          rating: '4.5',
          image: '',
          description: '',
          workspaceName: '',
          workspaceTimings: '',
          workspaceClosedDays: '',
          locationDetails: '',
          metroStationDistance: '',
          railwayStationDistance: '',
          aboutWorkspace: '',
          capacity: '',
          superArea: ''
        });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="h-16 sm:h-20 md:h-24"></div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Property Listed Successfully!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your property has been submitted and will be reviewed by our team. It will appear in our listings once approved.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-orange-400 text-white rounded-lg font-semibold hover:bg-blue-900 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="h-16 sm:h-20 md:h-24"></div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">List Your Space</h1>
            <p className="text-lg text-gray-600">Quick form – only essential details needed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Quick Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="e.g., Modern Coworking Space in BKC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City*</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    >
                      <option value="">Select City</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Pune">Pune</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area*</label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="e.g., BKC, Andheri, Lower Parel"
                    />
                  </div>

                  {/* Purpose hidden - default RENT; Type and Beds removed to match property page fields */}
                </div>
              </div>

              {/* Location Details */}
              <div className="border-t pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Location Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location Details*
                    </label>
                    <textarea
                      name="locationDetails"
                      value={formData.locationDetails}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="e.g., Sumer Plaza, Sankasth Pada Welfare Society, Marol, Andheri East, Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nearest Metro Station Distance
                    </label>
                    <input
                      type="text"
                      name="metroStationDistance"
                      value={formData.metroStationDistance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="e.g., 2 km away from Marol Naka Metro Station"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nearest Railway Station Distance
                    </label>
                    <input
                      type="text"
                      name="railwayStationDistance"
                      value={formData.railwayStationDistance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="e.g., 3.5 km away from Andheri Railway Station"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Info removed for quick submission */}

              {/* Optional: One image and quick notes */}
                  <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Images (optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Image*</label>
                    <div className="space-y-4">
                      {/* Image Upload */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                        />
                        <p className="text-sm text-gray-500 mt-1">Upload an image of your property (JPG, PNG, JPEG)</p>
                      </div>
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <img
                            src={imagePreview}
                            alt="Property preview"
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      )}
                      
                      {/* Alternative: Image URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Or provide Image URL:</label>
                        <input
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-sm text-gray-500 mt-1">If you don&apos;t have an image file, you can provide a URL instead</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Notes (optional)</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      placeholder="Describe your property, amenities, and what makes it special..."
                    />
                  </div>
                  {/* Optional extra fields removed for minimal effort */}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-orange-400 text-white rounded-lg font-semibold text-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'List Your Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
