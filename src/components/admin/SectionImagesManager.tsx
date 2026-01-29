'use client';

import { useState, useEffect } from 'react';

interface SectionImage {
  id: string;
  section: string;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function SectionImagesManager() {
  const [images, setImages] = useState<SectionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newAltText, setNewAltText] = useState('');
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);
  const [dragOverImageId, setDragOverImageId] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/section-images?section=why-choose-us', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data);
        setOrderDirty(false);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', files[0]);

      // Upload file first
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
      let imageUrl = uploadResult.url || uploadResult.imageUrl;
      
      // Ensure URL is from yottascore.com (replace beyondspacework.com if present)
      if (imageUrl && imageUrl.includes('files.beyondspacework.com')) {
        imageUrl = imageUrl.replace(/files\.beyondspacework\.com/g, 'files.yottascore.com');
        console.log('Replaced beyondspacework.com with yottascore.com in section image:', imageUrl);
      }
      
      if (!imageUrl) {
        throw new Error('No image URL received from server');
      }

      // Add to section images
      const addResponse = await fetch('/api/section-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: 'why-choose-us',
          imageUrl,
          altText: newAltText || 'Why Choose Us image',
          displayOrder: images.length,
        }),
      });

      if (addResponse.ok) {
        setMessage('Image added successfully!');
        setNewImageUrl('');
        setNewAltText('');
        fetchImages();
      } else {
        throw new Error('Failed to add image');
      }
    } catch (error: any) {
      setMessage('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/section-images/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage('Image deleted successfully!');
        fetchImages();
      } else {
        setMessage('Failed to delete image');
      }
    } catch (error) {
      setMessage('Error deleting image');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/section-images/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchImages();
      }
    } catch (error) {
      setMessage('Error updating image');
    }
  };

  const reorderLocally = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const current = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
    const fromIndex = current.findIndex((img) => img.id === fromId);
    const toIndex = current.findIndex((img) => img.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;

    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);

    const next = current.map((img, idx) => ({ ...img, displayOrder: idx }));
    setImages(next);
    setOrderDirty(true);
  };

  const handleSaveOrder = async () => {
    if (!orderDirty || savingOrder) return;
    setSavingOrder(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const updates = [...images]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((img, idx) => ({ id: img.id, displayOrder: idx }));

      const response = await fetch('/api/section-images/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: 'why-choose-us',
          updates,
        }),
      });

      if (response.ok) {
        setMessage('Order saved successfully!');
        setOrderDirty(false);
        fetchImages();
      } else {
        const err = await response.json().catch(() => ({}));
        setMessage(err?.error || 'Failed to save order');
      }
    } catch (e) {
      setMessage('Error saving order');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedImageId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    if (!draggedImageId || draggedImageId === id) return;
    e.preventDefault();
    setDragOverImageId(id);
  };

  const handleDrop = (id: string) => {
    if (!draggedImageId) return;
    reorderLocally(draggedImageId, id);
    setDraggedImageId(null);
    setDragOverImageId(null);
  };

  const handleDragEnd = () => {
    setDraggedImageId(null);
    setDragOverImageId(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Choose Us - Images Management
          </h2>
          <button
            onClick={handleSaveOrder}
            disabled={!orderDirty || savingOrder}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savingOrder ? 'Saving...' : 'Save Order'}
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Manage images displayed in the "Why Choose Us?" section. Images will automatically rotate in the slider.
        </p>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Add New Image */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Image</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text (Optional)
              </label>
              <input
                type="text"
                value={newAltText}
                onChange={(e) => setNewAltText(e.target.value)}
                placeholder="Image description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {uploading && (
              <div className="text-blue-600">Uploading...</div>
            )}
          </div>
        </div>

        {/* Images List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Current Images ({images.length})
          </h3>
          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No images added yet. Upload your first image above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(image.id)}
                  onDragOver={(e) => handleDragOver(e, image.id)}
                  onDrop={() => handleDrop(image.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    dragOverImageId === image.id ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={image.imageUrl}
                      alt={image.altText || 'Section image'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                      Drag
                    </div>
                    {!image.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Inactive</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-sm text-gray-600">
                      Order: {image.displayOrder + 1}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(image.id, image.isActive)}
                        className={`flex-1 px-3 py-1.5 rounded text-sm font-medium ${
                          image.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {image.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {index > 0 && (
                        <button
                          onClick={() => reorderLocally(image.id, images[index - 1].id)}
                          className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"
                        >
                          ↑ Move Up
                        </button>
                      )}
                      {index < images.length - 1 && (
                        <button
                          onClick={() => reorderLocally(image.id, images[index + 1].id)}
                          className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100"
                        >
                          ↓ Move Down
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


