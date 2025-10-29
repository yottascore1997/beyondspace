'use client';

import { useState, useRef } from 'react';

interface Amenity {
  icon: string;
  name: string;
  category: 'free' | 'paid' | 'premier';
}

interface PropertyFormData {
  title: string;
  city: string;
  area: string;
  purpose: string;
  type: string;
  priceDisplay: string;
  price: number;
  size: number;
  beds: string;
  rating: number;
  image: string;
  images: string[];
  tag: string;
  description: string;
  // Coworking specific fields
  workspaceName: string;
  workspaceTimings: string;
  workspaceClosedDays: string;
  amenities: Amenity[];
  locationDetails: string;
  aboutWorkspace: string;
  capacity: number;
  superArea: number;
}

export default function PropertyForm() {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    city: 'Mumbai',
    area: 'Andheri',
    purpose: 'rent',
    type: 'RESIDENTIAL',
    priceDisplay: '',
    price: 0,
    size: 0,
    beds: '',
    rating: 0,
    image: '',
    images: [],
    tag: '',
    description: '',
    // Coworking specific fields
    workspaceName: '',
    workspaceTimings: '',
    workspaceClosedDays: '',
    amenities: [],
    locationDetails: '',
    aboutWorkspace: '',
    capacity: 0,
    superArea: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Available amenities with icons
  const availableAmenities: Amenity[] = [
    { icon: 'two-wheeler-parking', name: '2 wheeler parking', category: 'free' },
    { icon: 'four-wheeler-parking', name: '4 wheeler parking', category: 'paid' },
    { icon: 'wifi', name: 'Wifi', category: 'free' },
    { icon: 'printer', name: 'Printer', category: 'paid' },
    { icon: 'tea', name: 'Tea', category: 'free' },
    { icon: 'coffee', name: 'Coffee', category: 'free' },
    { icon: 'water', name: 'Water', category: 'free' },
    { icon: 'chairs-desks', name: 'Chairs & Desks', category: 'free' },
    { icon: 'separate-washroom', name: 'Separate Washroom', category: 'free' },
    { icon: 'pantry-area', name: 'Pantry Area', category: 'free' },
    { icon: 'meeting-rooms', name: 'Meeting Rooms', category: 'premier' },
    { icon: 'air-conditioner', name: 'Air Conditioners', category: 'free' },
    { icon: 'charging', name: 'Charging', category: 'free' },
    { icon: 'power-backup', name: 'Power Backup', category: 'free' },
    { icon: 'lift', name: 'Lift', category: 'free' },
  ];

  const handleAmenityToggle = (amenity: Amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.some(a => a.icon === amenity.icon)
        ? prev.amenities.filter(a => a.icon !== amenity.icon)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Property added successfully!');
        setFormData({
          title: '',
          city: 'Mumbai',
          area: 'Andheri',
          purpose: 'rent',
          type: 'RESIDENTIAL',
          priceDisplay: '',
          price: 0,
          size: 0,
          beds: '',
          rating: 0,
          image: '',
          images: [],
          tag: '',
          description: '',
          // Coworking specific fields
          workspaceName: '',
          workspaceTimings: '',
          workspaceClosedDays: '',
          amenities: [],
          locationDetails: '',
          aboutWorkspace: '',
          capacity: 0,
          superArea: 0,
        });
        setImagePreview('');
        setUploadedImages([]);
        setUploadMethod('url');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'size' || name === 'rating' || name === 'capacity' || name === 'superArea' 
        ? Number(value) || 0 
        : value,
    }));
    
    // Update preview when image URL changes
    if (name === 'image' && uploadMethod === 'url') {
      setImagePreview(value);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file count (max 5 images)
    if (files.length > 5) {
      setMessage('Maximum 5 images allowed');
      return;
    }

    // Validate each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setMessage(`File ${i + 1} is not an image`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage(`File ${i + 1} size must be less than 5MB`);
        return;
      }
    }

    setUploading(true);
    setMessage('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          return result.imageUrl;
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...uploadedImages, ...uploadedUrls];
      
      setUploadedImages(newImages);
      setFormData(prev => ({ 
        ...prev, 
        images: newImages,
        image: newImages[0] || prev.image // Set first image as main image
      }));
      setImagePreview(newImages[0] || '');
      setMessage(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setFormData(prev => ({ 
      ...prev, 
      images: newImages,
      image: newImages[0] || ''
    }));
    setImagePreview(newImages[0] || '');
  };

  const handleUploadMethodChange = (method: 'url' | 'file') => {
    setUploadMethod(method);
    if (method === 'url') {
      setImagePreview(formData.image);
    } else {
      setImagePreview('');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              placeholder="e.g., 2BHK Luxury, Andheri West"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            >
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area *
            </label>
            <select
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            >
              <option value="Andheri">Andheri</option>
              <option value="Thane">Thane</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            >
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            >
              <option value="DEDICATED_DESK">Dedicated Desk</option>
              <option value="PRIVATE_CABIN">Private Cabin</option>
              <option value="VIRTUAL_OFFICE">Virtual Office</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Display *
            </label>
            <input
              type="text"
              name="priceDisplay"
              value={formData.priceDisplay}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              placeholder="e.g., ₹ 1.85 Cr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (Numeric) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              placeholder="18500000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size (sq ft) *
            </label>
            <input
              type="number"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              placeholder="780"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beds/Rooms
            </label>
            <input
              type="text"
              name="beds"
              value={formData.beds}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              placeholder="2 or - for commercial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              placeholder="4.7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Image *
            </label>
            
            {/* Upload Method Selection */}
            <div className="flex gap-4 mb-3">
              <button
                type="button"
                onClick={() => handleUploadMethodChange('url')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  uploadMethod === 'url'
                    ? 'bg-[#a08efe] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Use URL
              </button>
              <button
                type="button"
                onClick={() => handleUploadMethodChange('file')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  uploadMethod === 'file'
                    ? 'bg-[#a08efe] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upload File
              </button>
            </div>

            {/* URL Input */}
            {uploadMethod === 'url' && (
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                placeholder="https://images.unsplash.com/..."
              />
            )}

            {/* File Upload */}
            {uploadMethod === 'file' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#a08efe] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Click to select images (max 5)'}
                </button>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Property preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            {/* Uploaded Images Gallery */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uploaded Images ({uploadedImages.length}/5)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-[#a08efe] text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tag
            </label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              placeholder="e.g., Ready to Move"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            placeholder="Property description..."
          />
        </div>

        {/* Coworking Specific Fields */}
        {formData.type === 'COWORKING' && (
          <div className="border-t pt-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Coworking Workspace Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Name *
                </label>
                <input
                  type="text"
                  name="workspaceName"
                  value={formData.workspaceName}
                  onChange={handleChange}
                  required={formData.type === 'COWORKING'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="e.g., Work Square - Sumer Plaza, Andheri (E)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workspace Timings *
                </label>
                <input
                  type="text"
                  name="workspaceTimings"
                  value={formData.workspaceTimings}
                  onChange={handleChange}
                  required={formData.type === 'COWORKING'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="e.g., 10:00 am - 6:00 pm (Mon to Sat)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closed Days
                </label>
                <input
                  type="text"
                  name="workspaceClosedDays"
                  value={formData.workspaceClosedDays}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="e.g., Closed (Sun)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (Seats)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="e.g., 220"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Super Area (sq ft)
                </label>
                <input
                  type="number"
                  name="superArea"
                  value={formData.superArea}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="e.g., 10000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Details *
                </label>
                <textarea
                  name="locationDetails"
                  value={formData.locationDetails}
                  onChange={handleChange}
                  required={formData.type === 'COWORKING'}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="e.g., Sumer Plaza, Sankasth Pada Welfare Society, Marol, Andheri East, Mumbai, Maharashtra"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Workspace
                </label>
                <textarea
                  name="aboutWorkspace"
                  value={formData.aboutWorkspace}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="e.g., one of the best business centres in Marol, Work Square is located at Sumer Plaza. With over 10,000+ sq ft super area and a total capacity of 220+ seats, this is a perfect workspace for your next big business!"
                />
              </div>
            </div>

            {/* Amenities Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Amenities
              </label>
              
              {/* Category Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-[#a08efe] text-white"
                >
                  All Amenities
                </button>
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => {
                  const isSelected = formData.amenities.some(a => a.icon === amenity.icon);
                  return (
                    <button
                      key={amenity.icon}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#a08efe] bg-[#a08efe]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          amenity.category === 'free' ? 'bg-green-500' :
                          amenity.category === 'paid' ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          {amenity.name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 capitalize">
                        {amenity.category}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Amenities Summary */}
              {formData.amenities.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Amenities ({formData.amenities.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#a08efe] text-white"
                      >
                        {amenity.name}
                        <button
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className="ml-1 text-white hover:text-gray-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#a08efe] to-[#7a66ff] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Property...' : 'Add Property'}
        </button>
      </form>
    </div>
  );
}

