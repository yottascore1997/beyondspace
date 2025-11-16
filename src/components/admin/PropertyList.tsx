'use client';

import type { DragEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

interface Property {
  id: string;
  title: string;
  city: string;
  area: string;
  purpose: string;
  type: string;
  categories?: string[];
  priceDisplay: string;
  price: number;
  size: number;
  beds: string;
  rating: number;
  image: string;
  tag?: string;
  isActive: boolean;
  displayOrder?: number;
  createdAt: string;
}

interface PropertyListProps {
  onEditProperty?: (propertyId: string) => void;
  refreshKey?: number;
}

export default function PropertyList({ onEditProperty, refreshKey = 0 }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);
  const [areaOrderMap, setAreaOrderMap] = useState<Record<string, string[]>>({});
  const [draggedPropertyId, setDraggedPropertyId] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const categoryLabelMap: Record<string, string> = {
    coworking: 'Coworking',
    managed: 'Managed Office',
    dedicateddesk: 'Dedicated Desk',
    flexidesk: 'Flexi Desk',
    virtualoffice: 'Virtual Office',
    meetingroom: 'Meeting Room',
    enterpriseoffices: 'Enterprise Offices',
  };

  useEffect(() => {
    fetchProperties();
    fetchAreas();
  }, []);

  useEffect(() => {
    if (refreshKey !== 0) {
      fetchProperties();
    }
  }, [refreshKey]);

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
        setMessage('');
        setOrderDirty(false);
      } else {
        setMessage('Failed to fetch properties');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/areas', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Expecting array of { id, name }
        setAreas(Array.isArray(data) ? data.map((a: any) => ({ id: a.id, name: a.name })) : []);
      }
    } catch {
      // Ignore; filter will simply show none besides All
    }
  };

  useEffect(() => {
    if (orderDirty) {
      return;
    }

    const groups = new Map<string, Property[]>();
    properties.forEach((property) => {
      const areaKey = property.area || 'Unassigned';
      if (!groups.has(areaKey)) {
        groups.set(areaKey, []);
      }
      groups.get(areaKey)!.push(property);
    });

    const newMap: Record<string, string[]> = {};
    groups.forEach((props, areaKey) => {
      const sorted = props
        .slice()
        .sort((a, b) => {
          const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
          if (orderDiff !== 0) return orderDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      newMap[areaKey] = sorted.map((property) => property.id);
    });

    setAreaOrderMap(newMap);
  }, [properties, orderDirty]);

  // Use areas defined in Admin (API), fallback to areas present on properties
  const uniqueAreas = useMemo(() => {
    const adminAreaNames = areas.map((a) => a.name).filter(Boolean);
    if (adminAreaNames.length > 0) {
      return Array.from(new Set(adminAreaNames));
    }
    return Array.from(new Set(properties.map((p) => p.area).filter(Boolean)));
  }, [areas, properties]);

  const filteredProperties =
    selectedArea === 'All'
      ? properties
      : properties.filter((property) => property.area === selectedArea);

  const sortedFilteredProperties = useMemo(() => {
    if (selectedArea === 'All') {
      return filteredProperties
        .slice()
        .sort((a, b) => {
          const areaCompare = a.area.localeCompare(b.area);
          if (areaCompare !== 0) return areaCompare;
          const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
          if (orderDiff !== 0) return orderDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }

    const order = areaOrderMap[selectedArea];
    if (!order || order.length === 0) {
      return filteredProperties
        .slice()
        .sort((a, b) => {
          const orderDiff = (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
          if (orderDiff !== 0) return orderDiff;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }

    const indexMap = new Map(order.map((id, index) => [id, index]));
    return filteredProperties
      .slice()
      .sort((a, b) => {
        const aIndex = indexMap.has(a.id) ? indexMap.get(a.id)! : Number.MAX_SAFE_INTEGER;
        const bIndex = indexMap.has(b.id) ? indexMap.get(b.id)! : Number.MAX_SAFE_INTEGER;
        if (aIndex !== bIndex) return aIndex - bIndex;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [filteredProperties, selectedArea, areaOrderMap]);

  const reorderWithinArea = (draggedId: string, targetId: string) => {
    if (selectedArea === 'All' || draggedId === targetId) return;

    setAreaOrderMap((prev) => {
      const currentOrder =
        prev[selectedArea] ?? filteredProperties.map((property) => property.id);
      if (!currentOrder.includes(draggedId) || !currentOrder.includes(targetId)) {
        return prev;
      }

      const newOrder = currentOrder.filter((id) => id !== draggedId);
      const targetIndex = newOrder.indexOf(targetId);
      newOrder.splice(targetIndex, 0, draggedId);
      return { ...prev, [selectedArea]: newOrder };
    });
    setOrderDirty(true);
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>, propertyId: string) => {
    if (selectedArea === 'All') return;
    event.dataTransfer.effectAllowed = 'move';
    setDraggedPropertyId(propertyId);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (selectedArea === 'All' || !draggedPropertyId) return;
    event.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (selectedArea === 'All' || !draggedPropertyId) {
      setDraggedPropertyId(null);
      return;
    }
    reorderWithinArea(draggedPropertyId, targetId);
    setDraggedPropertyId(null);
  };

  const handleDragEnd = () => {
    setDraggedPropertyId(null);
  };

  const handleSaveOrder = async () => {
    if (selectedArea === 'All') return;

    const order =
      areaOrderMap[selectedArea] ?? sortedFilteredProperties.map((property) => property.id);

    if (order.length === 0) {
      return;
    }

    setIsSavingOrder(true);

    try {
      const updates = order.map((id, index) => ({
        id,
        displayOrder: index + 1,
      }));

      const token = localStorage.getItem('token');
      const response = await fetch('/api/properties/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save order');
      }

      setProperties((prev) =>
        prev.map((property) => {
          const update = updates.find((item) => item.id === property.id);
          return update ? { ...property, displayOrder: update.displayOrder } : property;
        })
      );
      setOrderDirty(false);
      setMessage('Display order updated successfully.');
    } catch (error) {
      console.error('Error saving order:', error);
      setMessage('Failed to save property order.');
    } finally {
      setIsSavingOrder(false);
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">Filter by Area:</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                selectedArea === 'All'
                  ? 'bg-[#a08efe] text-white border-[#a08efe]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-[#a08efe] hover:text-[#a08efe]'
              }`}
              onClick={() => {
                setSelectedArea('All');
                setDraggedPropertyId(null);
                setOrderDirty(false);
              }}
            >
              All Areas
            </button>
            {uniqueAreas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => {
                  setSelectedArea(area);
                  setDraggedPropertyId(null);
                  setOrderDirty(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  selectedArea === area
                    ? 'bg-[#a08efe] text-white border-[#a08efe]'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-[#a08efe] hover:text-[#a08efe]'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-2 text-sm text-gray-500">
          {selectedArea === 'All' ? (
            <span>Select an area to reorder its properties.</span>
          ) : (
            <>
              <span>
                Drag property cards to change the order for {selectedArea}.
              </span>
              {sortedFilteredProperties.length > 1 && (
                <button
                  type="button"
                  onClick={handleSaveOrder}
                  disabled={!orderDirty || isSavingOrder}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#a08efe] text-white hover:bg-[#8c76ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingOrder ? 'Saving...' : 'Save Order'}
                </button>
              )}
            </>
          )}
        </div>
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

      {sortedFilteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found for the selected area</p>
          <p className="text-gray-400 mt-2">
            Try choosing another area or add new properties to this location.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedFilteredProperties.map((property) => (
            <div
              key={property.id}
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                selectedArea !== 'All' ? 'cursor-move' : ''
              }`}
              draggable={selectedArea !== 'All'}
              onDragStart={(event) => handleDragStart(event, property.id)}
              onDragOver={handleDragOver}
              onDrop={(event) => {
                event.preventDefault();
                handleDrop(property.id);
              }}
              onDragEnd={handleDragEnd}
            >
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

                {property.categories && property.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.categories.map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                      >
                        {categoryLabelMap[category.toLowerCase()] ?? category}
                      </span>
                    ))}
                  </div>
                )}
                
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
                    onClick={() => onEditProperty?.(property.id)}
                    className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Edit Property
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


