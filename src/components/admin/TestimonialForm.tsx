'use client';

import { useState, useEffect, useRef } from 'react';

interface TestimonialFormData {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  displayOrder: number;
  isActive: boolean;
}

interface TestimonialFormProps {
  editingTestimonialId?: string | null;
  onFinish?: (action: 'created' | 'updated') => void;
  onCancelEdit?: () => void;
}

const createInitialFormData = (): TestimonialFormData => ({
  name: '',
  role: '',
  company: '',
  text: '',
  rating: 5,
  avatar: '',
  displayOrder: 0,
  isActive: true,
});

export default function TestimonialForm({
  editingTestimonialId,
  onFinish,
  onCancelEdit,
}: TestimonialFormProps) {
  const [formData, setFormData] = useState<TestimonialFormData>(createInitialFormData());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTestimonialId) {
      fetchTestimonial();
    }
  }, [editingTestimonialId]);

  const fetchTestimonial = async () => {
    try {
      setFetching(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/testimonials/${editingTestimonialId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.testimonial.name || '',
          role: data.testimonial.role || '',
          company: data.testimonial.company || '',
          text: data.testimonial.text || '',
          rating: data.testimonial.rating || 5,
          avatar: data.testimonial.avatar || '',
          displayOrder: data.testimonial.displayOrder || 0,
          isActive: data.testimonial.isActive !== undefined ? data.testimonial.isActive : true,
        });
      } else {
        setError('Failed to fetch testimonial');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const url = editingTestimonialId
        ? `/api/testimonials/${editingTestimonialId}`
        : '/api/testimonials';
      const method = editingTestimonialId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setSuccess(
          editingTestimonialId
            ? 'Testimonial updated successfully!'
            : 'Testimonial created successfully!'
        );
        setTimeout(() => {
          if (onFinish) {
            onFinish(editingTestimonialId ? 'updated' : 'created');
          }
          if (!editingTestimonialId) {
            setFormData(createInitialFormData());
          }
        }, 1500);
      } else {
        const data = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        console.error('Update error:', data);
        setError(data.error || data.message || 'Failed to save testimonial');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', files[0]);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      const imageUrl = uploadResult.url || uploadResult.imageUrl;
      
      // Debug: Log the upload result
      console.log('Upload result:', uploadResult);
      console.log('Image URL:', imageUrl);
      
      if (!imageUrl) {
        throw new Error('No image URL received from server');
      }
      
      // Ensure URL is from yottascore
      if (!imageUrl.includes('yottascore.com')) {
        console.warn('Warning: Image URL does not contain yottascore.com:', imageUrl);
      }
      
      setFormData(prev => ({
        ...prev,
        avatar: imageUrl,
      }));
      setSuccess('Image uploaded successfully! URL: ' + imageUrl);
    } catch (error: any) {
      setError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a08efe]"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            placeholder="CEO"
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            placeholder="Company Name"
          />
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
          >
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>

        {/* Avatar Image */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avatar Image <span className="text-red-500">*</span>
          </label>
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            required={!formData.avatar}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#a08efe] file:text-white hover:file:bg-[#7a66ff] disabled:opacity-50"
          />
          {uploading && (
            <p className="mt-2 text-sm text-blue-600">Uploading image...</p>
          )}

          {formData.avatar && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <p className="text-xs text-gray-500 mb-2 break-all">URL: {formData.avatar}</p>
              <img
                src={formData.avatar}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                onError={(e) => {
                  console.error('Image load error:', formData.avatar);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', formData.avatar);
                }}
              />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="md:col-span-2">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Testimonial Text <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            placeholder="Enter testimonial text..."
          />
        </div>

        {/* Display Order */}
        <div>
          <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            id="displayOrder"
            name="displayOrder"
            value={formData.displayOrder}
            onChange={handleChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
        </div>

        {/* Is Active */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-[#a08efe] border-gray-300 rounded focus:ring-[#a08efe]"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-700">
            Active (Visible on homepage)
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        {editingTestimonialId && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#a08efe] text-white rounded-lg hover:bg-[#7a66ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Saving...'
            : editingTestimonialId
            ? 'Update Testimonial'
            : 'Create Testimonial'}
        </button>
      </div>
    </form>
  );
}

