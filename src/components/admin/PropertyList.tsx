'use client';

import { useState, useEffect } from 'react';

interface Property {
  id: string;
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
  tag?: string;
  isActive: boolean;
  createdAt: string;
}

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/properties', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else {
        setMessage('Failed to fetch properties');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProperties(prev => prev.filter(p => p.id !== id));
        setMessage('Property deleted successfully');
      } else {
        setMessage('Failed to delete property');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        setProperties(prev => 
          prev.map(p => p.id === id ? { ...p, isActive: !isActive } : p)
        );
        setMessage(`Property ${!isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        setMessage('Failed to update property');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a08efe] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading properties...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
        <p className="text-gray-600">{properties.length} properties found</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Failed') || message.includes('error') 
            ? 'bg-red-50 text-red-700' 
            : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found</p>
          <p className="text-gray-400 mt-2">Add your first property to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {property.tag && (
                    <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                      {property.tag}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    property.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                  {property.title}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>{property.city}</span>
                  <span>•</span>
                  <span>{property.area}</span>
                  <span>•</span>
                  <span>{property.type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    ⭐ {property.rating}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold text-gray-900 text-lg">
                    {property.priceDisplay}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.size} sq ft
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(property.id, property.isActive)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                      property.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {property.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


