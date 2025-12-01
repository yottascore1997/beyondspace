'use client';

import type { DragEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

interface Property {
  id: string;
  title: string;
  city: string;
  area: string;
  sublocation?: string | null;
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
  const [dragOverPropertyId, setDragOverPropertyId] = useState<string | null>(null);
  const [orderDirty, setOrderDirty] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

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

  // Filter properties by area and search query
  const filteredProperties = useMemo(() => {
    let filtered = properties;
    
    // Filter by area
    if (selectedArea !== 'All') {
      filtered = filtered.filter((property) => property.area === selectedArea);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((property) =>
        property.title.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.area.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query) ||
        (property.sublocation && property.sublocation.toLowerCase().includes(query)) ||
        (property.categories && property.categories.some(cat => cat.toLowerCase().includes(query)))
      );
    }
    
    return filtered;
  }, [properties, selectedArea, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

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

  // Get paginated properties
  const paginatedProperties = sortedFilteredProperties.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedArea, searchQuery]);

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

  const handleDragOver = (event: DragEvent<HTMLDivElement>, propertyId: string) => {
    if (selectedArea === 'All' || !draggedPropertyId || draggedPropertyId === propertyId) return;
    event.preventDefault();
    setDragOverPropertyId(propertyId);
  };

  const handleDrop = (targetId: string) => {
    if (selectedArea === 'All' || !draggedPropertyId) {
      setDraggedPropertyId(null);
      setDragOverPropertyId(null);
      return;
    }
    reorderWithinArea(draggedPropertyId, targetId);
    setDraggedPropertyId(null);
    setDragOverPropertyId(null);
  };

  const handleDragEnd = () => {
    setDraggedPropertyId(null);
    setDragOverPropertyId(null);
  };

  const handleDragLeave = () => {
    setDragOverPropertyId(null);
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
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search properties by title, city, area, type..."
            className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

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

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {sortedFilteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No properties found</p>
          <p className="text-gray-400 mt-2">
            {searchQuery 
              ? 'Try adjusting your search query or filters.'
              : 'Try choosing another area or add new properties to this location.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedProperties.map((property) => (
            <div
              key={property.id}
              className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all relative ${
                selectedArea !== 'All' ? 'cursor-move' : ''
              } ${
                draggedPropertyId === property.id 
                  ? 'opacity-50 ring-2 ring-[#a08efe] border-[#a08efe]' 
                  : dragOverPropertyId === property.id && draggedPropertyId
                  ? 'ring-2 ring-blue-400 border-blue-400 shadow-lg'
                  : 'border-gray-200'
              }`}
              draggable={selectedArea !== 'All'}
              onDragStart={(event) => handleDragStart(event, property.id)}
              onDragOver={(event) => handleDragOver(event, property.id)}
              onDragLeave={handleDragLeave}
              onDrop={(event) => {
                event.preventDefault();
                handleDrop(property.id);
              }}
              onDragEnd={handleDragEnd}
            >
              {/* Drag Handle Icon - Only show when area is selected (not "All") */}
              {selectedArea !== 'All' && (
                <div 
                  className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md cursor-grab active:cursor-grabbing hover:bg-white transition-colors"
                  title="Drag to reorder"
                >
                  <svg 
                    className="w-5 h-5 text-gray-600" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-label="Drag to reorder"
                  >
                    {/* Grip icon - 6 dots in 2 columns */}
                    <circle cx="9" cy="5" r="1.5" />
                    <circle cx="15" cy="5" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="19" r="1.5" />
                    <circle cx="15" cy="19" r="1.5" />
                  </svg>
                </div>
              )}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-[#a08efe] text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


