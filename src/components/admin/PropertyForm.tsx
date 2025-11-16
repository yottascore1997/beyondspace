'use client';

import { useState, useRef, useEffect } from 'react';

interface City {
  id: string;
  name: string;
  areas: Area[];
}

interface Area {
  id: string;
  name: string;
  cityId: string;
  city: {
    id: string;
    name: string;
  };
}

interface Amenity {
  icon: string;
  name: string;
  category: 'free' | 'paid' | 'premier';
}

interface SeatingPlan {
  id: string;
  title: string;
  description: string;
  price: string;
  seating: string;
  isSelected: boolean;
  seatingPrices?: Record<string, string>;
}

interface PropertyFormData {
  title: string;
  city: string;
  area: string;
  sublocation: string;
  purpose: string;
  type: string;
  displayOrder: number;
  categories: string[];
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
  monFriTime: string;
  saturdayTime: string;
  sundayTime: string;
  amenities: Amenity[];
  locationDetails: string;
  metroStationDistance: string;
  metroStationDistance2: string;
  railwayStationDistance: string;
  railwayStationDistance2: string;
  googleMapLink: string;
  propertyTier: string;
  aboutWorkspace: string;
  capacity: number;
  superArea: number;
  // Seating Plans
  seatingPlans: SeatingPlan[];
}

interface PropertyFormProps {
  editingPropertyId?: string | null;
  onFinish?: (action: 'created' | 'updated') => void;
  onCancelEdit?: () => void;
}

const createDefaultSeatingPlans = (): SeatingPlan[] => ([
  {
    id: 'dedicated-desk',
    title: 'Dedicated Desk',
    description: '',
    price: '',
    seating: '',
    isSelected: false,
  },
  {
    id: 'flexi-desk',
    title: 'Flexi Desk',
    description: '',
    price: '',
    seating: '',
    isSelected: false,
  },
  {
    id: 'private-cabin',
    title: 'Private Cabin',
    description: '',
    price: '',
    seating: '',
    isSelected: false,
  },
  {
    id: 'virtual-office',
    title: 'Virtual Office',
    description: '',
    price: '',
    seating: '',
    isSelected: false,
  },
  {
    id: 'meeting-room',
    title: 'Meeting Room',
    description: '',
    price: '',
    seating: '',
    isSelected: false,
    seatingPrices: {},
  },
  {
    id: 'managed-office-space',
    title: 'Managed Office Space',
    description: '',
    price: '',
    seating: '',
    isSelected: false,
  },
  {
    id: 'day-pass',
    title: 'Day Pass',
    description: '',
    price: '',
    seating: '',
    isSelected: false,
  },
]);

const createInitialFormData = (): PropertyFormData => ({
  title: '',
  city: 'Mumbai',
  area: 'Andheri',
  sublocation: '',
  purpose: 'commercial',
  type: '',
  displayOrder: 0,
  categories: [],
  priceDisplay: '',
  price: 0,
  size: 0,
  beds: '',
  rating: 0,
  image: '',
  images: [],
  tag: '',
  description: '',
  workspaceName: '',
  workspaceTimings: '',
  workspaceClosedDays: '',
  monFriTime: '',
  saturdayTime: '',
  sundayTime: '',
  amenities: [],
  locationDetails: '',
  metroStationDistance: '',
  metroStationDistance2: '',
  railwayStationDistance: '',
  railwayStationDistance2: '',
  googleMapLink: '',
  propertyTier: '',
  aboutWorkspace: '',
  capacity: 0,
  superArea: 0,
  seatingPlans: createDefaultSeatingPlans(),
});

export default function PropertyForm({
  editingPropertyId = null,
  onFinish,
  onCancelEdit,
}: PropertyFormProps) {
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);

  const [formData, setFormData] = useState<PropertyFormData>(() => createInitialFormData());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [isFetchingProperty, setIsFetchingProperty] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

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

  const categoryOptions = [
    { key: 'coworking', label: 'Coworking Space', type: 'COWORKING', purpose: 'commercial' },
    { key: 'managed', label: 'Managed Office Space', type: 'MANAGED_OFFICE', purpose: 'commercial' },
    { key: 'dedicateddesk', label: 'Dedicated Desk', type: 'COWORKING', purpose: 'commercial' },
    { key: 'flexidesk', label: 'Flexi Desk', type: 'COWORKING', purpose: 'commercial' },
    { key: 'virtualoffice', label: 'Virtual Office', type: 'COWORKING', purpose: 'commercial' },
    { key: 'meetingroom', label: 'Meeting Room', type: 'COMMERCIAL', purpose: 'commercial' },
  ];

  const getCategoryLabels = (keys: string[]) =>
    keys.map((key) => categoryOptions.find((option) => option.key === key)?.label ?? key);

const primaryCategoryLabel = selectedCategoryNames[0]
  || (formData.type === 'COWORKING'
    ? 'Coworking Workspace'
    : formData.type === 'MANAGED_OFFICE'
      ? 'Managed Office'
      : 'Workspace');

const isEditMode = Boolean(editingPropertyId);

const resetFormState = (options: { keepMessage?: boolean } = {}) => {
  const { keepMessage = false } = options;
  setFormData(createInitialFormData());
  setSelectedCategoryNames([]);
  setUploadedImages([]);
  setImagePreview('');
  setUploadMethod('url');
  setDraggedImageIndex(null);
  setIsFetchingProperty(false);
  setCurrentEditingId(null);
  if (!keepMessage) {
    setMessage('');
  }
};

const loadPropertyForEdit = async (propertyId: string) => {
  setIsFetchingProperty(true);
  setMessage('');
  try {
    const response = await fetch(`/api/properties/${propertyId}`);
    if (!response.ok) {
      throw new Error('Failed to load property details');
    }

    const property = await response.json();

    const primaryImage = property.image || '';
    const galleryImages = Array.isArray(property.propertyImages)
      ? property.propertyImages
          .map((img: { imageUrl: string }) => img?.imageUrl)
          .filter((url: string) => url && url !== primaryImage)
      : [];
    const combinedImages = Array.from(new Set([primaryImage, ...galleryImages].filter(Boolean)));

    const normalizedCategories = Array.isArray(property.categories)
      ? property.categories.map((cat: string) => cat.toLowerCase())
      : [];

    const basePlans = createDefaultSeatingPlans();
    const propertyOptions = Array.isArray(property.propertyOptions) ? property.propertyOptions : [];

    const matchedPlans = basePlans.map((plan) => {
      const match = propertyOptions.find(
        (option: { title?: string; description?: string; price?: string; seating?: string }) =>
          option?.title?.toLowerCase() === plan.title.toLowerCase()
      );
      if (match) {
        return {
          ...plan,
          description: match.description || '',
          price: match.price || '',
          seating: match.seating || '',
          isSelected: true,
        };
      }
      return { ...plan, isSelected: false, description: '', price: '', seating: '' };
    });

    const additionalPlans = propertyOptions
      .filter((option: { title?: string }) => {
        const title = option?.title?.toLowerCase();
        return title && !basePlans.some((plan) => plan.title.toLowerCase() === title);
      })
      .map((option: { title?: string; description?: string; price?: string; seating?: string }) => ({
        id: option.title?.toLowerCase().replace(/\s+/g, '-') || `custom-${Math.random().toString(36).slice(2, 10)}`,
        title: option.title || 'Custom Plan',
        description: option.description || '',
        price: option.price || '',
        seating: option.seating || '',
        isSelected: true,
      }));

    const updatedSeatingPlans = [...matchedPlans, ...additionalPlans];

    const updatedFormData: PropertyFormData = {
      title: property.title || '',
      city: property.city || 'Mumbai',
      area: property.area || '',
      sublocation: property.sublocation || '',
      purpose: (property.purpose || 'commercial').toLowerCase(),
      type: property.type || '',
      displayOrder: property.displayOrder ?? 0,
      categories: normalizedCategories,
      priceDisplay: property.priceDisplay || '',
      price: property.price || 0,
      size: property.size || 0,
      beds: property.beds || '',
      rating: property.rating || 0,
      image: combinedImages[0] || '',
      images: combinedImages,
      tag: property.tag || '',
      description: property.description || '',
      workspaceName: property.workspaceName || '',
      workspaceTimings: property.workspaceTimings || '',
      workspaceClosedDays: property.workspaceClosedDays || '',
      monFriTime: '',
      saturdayTime: '',
      sundayTime: '',
      amenities: Array.isArray(property.amenities) ? property.amenities : [],
      locationDetails: property.locationDetails || '',
      metroStationDistance: property.metroStationDistance || '',
      metroStationDistance2: '',
      railwayStationDistance: property.railwayStationDistance || '',
      railwayStationDistance2: '',
      googleMapLink: property.googleMapLink || '',
      propertyTier: property.propertyTier || '',
      aboutWorkspace: property.aboutWorkspace || '',
      capacity: property.capacity ?? 0,
      superArea: property.superArea ?? 0,
      seatingPlans: updatedSeatingPlans,
    };

    setFormData(updatedFormData);
    setUploadedImages(combinedImages);
    setImagePreview(combinedImages[0] || '');
    setSelectedCategoryNames(getCategoryLabels(updatedFormData.categories));
    setUploadMethod('url');
    setMessage('Editing property details. Make your changes and click Update Property.');
    setCurrentEditingId(propertyId);
  } catch (error) {
    console.error('Failed to load property for editing:', error);
    setMessage('Unable to load property details for editing.');
    resetFormState({ keepMessage: true });
    onCancelEdit?.();
  } finally {
    setIsFetchingProperty(false);
  }
};

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/cities', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const citiesData = await response.json();
          setCities(citiesData);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  // Fetch areas when city changes
  const fetchAreasForCity = async (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (!city) {
      setAreas([]);
      return;
    }

    try {
      setLoadingAreas(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/areas?cityId=${city.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const areasData = await response.json();
        setAreas(areasData);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoadingAreas(false);
    }
  };

  useEffect(() => {
    if (editingPropertyId) {
      if (editingPropertyId !== currentEditingId) {
        loadPropertyForEdit(editingPropertyId);
      }
    } else if (currentEditingId) {
      resetFormState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingPropertyId]);

  // Fetch areas when city changes
  useEffect(() => {
    if (formData.city && cities.length > 0) {
      fetchAreasForCity(formData.city);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.city, cities.length]);

  const handleAmenityToggle = (amenity: Amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.some(a => a.icon === amenity.icon)
        ? prev.amenities.filter(a => a.icon !== amenity.icon)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSelectAllAmenities = () => {
    const allSelected = formData.amenities.length === availableAmenities.length;
    if (allSelected) {
      // If all are selected, deselect all
      setFormData(prev => ({
        ...prev,
        amenities: []
      }));
    } else {
      // Select all amenities
      setFormData(prev => ({
        ...prev,
        amenities: [...availableAmenities]
      }));
    }
  };

  const handleSeatingPlanToggle = (planId: string) => {
    setFormData(prev => ({
      ...prev,
      seatingPlans: prev.seatingPlans.map(plan =>
        plan.id === planId ? { ...plan, isSelected: !plan.isSelected } : plan
      )
    }));
  };

  const handleSeatingPlanUpdate = (planId: string, field: keyof SeatingPlan, value: string) => {
    setFormData(prev => ({
      ...prev,
      seatingPlans: prev.seatingPlans.map(plan =>
        plan.id === planId ? { ...plan, [field]: value } : plan
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.categories.length === 0) {
      setMessage('Please select at least one category');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      const selectedPlans = formData.seatingPlans
        .filter(plan => plan.isSelected)
        .flatMap(plan => {
          if (plan.id === 'meeting-room') {
            const selectedSeats = (plan.seating || '').split(',').map(s => s.trim()).filter(Boolean);
            if (selectedSeats.length === 0) {
              return [{
                title: plan.title,
                description: plan.description,
                price: plan.price,
                seating: '',
              }];
            }
            return selectedSeats.map(seat => ({
              title: plan.title,
              description: plan.description,
              price: (plan.seatingPrices && plan.seatingPrices[seat]) || '',
              seating: seat,
            }));
          }
          return [{
            title: plan.title,
            description: plan.description,
            price: plan.price,
            seating: plan.seating,
          }];
        });

      // Combine dual distances into single strings to fit current schema
      const metroParts = [
        (formData.metroStationDistance || '').trim(),
        (formData.metroStationDistance2 || '').trim(),
      ];
      const combinedMetro = metroParts
        .map(s => (s || '').trim())
        .filter(Boolean)
        .join(' / ');
      const railParts = [
        (formData.railwayStationDistance || '').trim(),
        (formData.railwayStationDistance2 || '').trim(),
      ];
      const combinedRail = railParts
        .map(s => (s || '').trim())
        .filter(Boolean)
        .join(' / ');

      // Build combined timings to fit existing schema fields
      const timingsParts = [
        formData.monFriTime ? `Mon-Fri: ${formData.monFriTime}` : '',
        formData.saturdayTime ? `Sat: ${formData.saturdayTime}` : '',
        formData.sundayTime ? `Sun: ${formData.sundayTime}` : '',
      ].filter(Boolean);
      const workspaceTimingsCombined = timingsParts.join(' | ');

      const submitData = {
        ...formData,
        workspaceTimings: workspaceTimingsCombined,
        workspaceClosedDays: '',
        metroStationDistance: combinedMetro,
        railwayStationDistance: combinedRail,
        images: uploadedImages,
        propertyOptions: selectedPlans.length > 0 ? selectedPlans : null,
        seatingPlans: undefined,
      };

      const targetPropertyId = currentEditingId ?? editingPropertyId;
      const endpoint = isEditMode && targetPropertyId ? `/api/properties/${targetPropertyId}` : '/api/properties';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        if (isEditMode) {
          resetFormState({ keepMessage: true });
          setMessage('Property updated successfully!');
          onFinish?.('updated');
        } else {
          resetFormState({ keepMessage: true });
          setMessage('Property added successfully!');
          onFinish?.('created');
        }
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error ?? 'Something went wrong.'}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If city changes, reset area and fetch new areas
    if (name === 'city') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        area: '', // Reset area when city changes
      }));
      if (value) {
        fetchAreasForCity(value);
      } else {
        setAreas([]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'size' || name === 'rating' || name === 'capacity' || name === 'superArea' 
          ? Number(value) || 0 
          : value,
      }));
    }
    
    // Update preview when image URL changes
    if (name === 'image' && uploadMethod === 'url') {
      setImagePreview(value);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file count (max 10 images in total)
    const totalImagesCount = uploadedImages.length + files.length;
    if (totalImagesCount > 10) {
      setMessage('Maximum 10 images allowed');
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
      
      syncImagesState(newImages);
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const syncImagesState = (nextImages: string[], fallbackMainImage?: string) => {
    setUploadedImages(nextImages);
    setFormData(prev => ({
      ...prev,
      images: nextImages,
      image: nextImages[0] || fallbackMainImage || ''
    }));
    setImagePreview(nextImages[0] || fallbackMainImage || '');
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    syncImagesState(newImages);
  };

  const handleUploadMethodChange = (method: 'url' | 'file') => {
    setUploadMethod(method);
    if (method === 'url') {
      setImagePreview(formData.image);
    } else {
      setImagePreview('');
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setMessage('');
    setFormData(prev => {
      const isSelected = prev.categories.includes(categoryKey);
      const nextCategories = isSelected
        ? prev.categories.filter(key => key !== categoryKey)
        : [...prev.categories, categoryKey];

      const primaryOption = nextCategories.length > 0
        ? categoryOptions.find(option => option.key === nextCategories[0])
        : null;

      setSelectedCategoryNames(getCategoryLabels(nextCategories));

      return {
        ...prev,
        categories: nextCategories,
        type: primaryOption ? primaryOption.type : '',
        purpose: primaryOption ? primaryOption.purpose : 'commercial',
      };
    });
  };

  const handleImageDragStart = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedImageIndex(index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();

    if (draggedImageIndex === null || draggedImageIndex === index) {
      setDraggedImageIndex(null);
      return;
    }

    const reorderedImages = [...uploadedImages];
    const [movedImage] = reorderedImages.splice(draggedImageIndex, 1);
    reorderedImages.splice(index, 0, movedImage);

    syncImagesState(reorderedImages, formData.image);
    setDraggedImageIndex(null);
  };

  const handleImageDragEnd = () => {
    setDraggedImageIndex(null);
  };
 
  return (
    <div>
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {isFetchingProperty && (
        <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-700">
          Loading property details...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
              placeholder=""
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
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
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
              disabled={!formData.city || loadingAreas}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingAreas ? 'Loading areas...' : formData.city ? 'Select Area' : 'Select City first'}
              </option>
              {areas.map((area) => (
                <option key={area.id} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Location
            </label>
            <input
              type="text"
              name="sublocation"
              value={formData.sublocation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Property
            </label>
            <select
              name="propertyTier"
              value={formData.propertyTier}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
            >
              <option value="">Select Type</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
              <option value="Ultra Luxury">Ultra Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories *
            </label>
            <div className="flex flex-wrap gap-3">
              {categoryOptions.map((option) => {
                const isSelected = formData.categories.includes(option.key);
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => toggleCategory(option.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#a08efe] text-white border-[#a08efe] shadow-lg shadow-[#a08efe]/30'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#a08efe] hover:text-[#a08efe]'
                    }`}
                  >
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Select one or more categories. The first selected category is treated as the primary workspace type.
            </p>
            {selectedCategoryNames.length > 0 && (
              <p className="mt-2 text-sm font-medium text-gray-700">
                Selected:&nbsp;
                <span className="text-[#a08efe]">{selectedCategoryNames.join(', ')}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Image {!isEditMode && '*'}
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
              <div>
                <input
                  type={isEditMode ? "text" : "url"}
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required={!isEditMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder=""
                />
                {/* Show preview immediately when URL is entered */}
                {formData.image && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Selected Image Preview:</p>
                    <img
                      src={formData.image}
                      alt="Selected property preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-[#a08efe]"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                        e.currentTarget.alt = 'Invalid image URL';
                      }}
                    />
                  </div>
                )}
              </div>
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
                  {uploading ? 'Uploading...' : 'Click to select images (max 10)'}
                </button>
              </div>
            )}

            {/* Uploaded Images Gallery */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Images ({uploadedImages.length}/5)
                </label>
                
                {/* Main Image Preview - Large */}
                {uploadedImages[0] && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold text-[#a08efe]">Main Image:</span> (This will be the primary property image)
                    </p>
                    <div className="relative">
                      <img
                        src={uploadedImages[0]}
                        alt="Main property image"
                        className="w-full h-64 object-cover rounded-lg border-2 border-[#a08efe] shadow-lg"
                      />
                      <div className="absolute top-2 left-2 bg-[#a08efe] text-white text-xs px-3 py-1 rounded-full font-semibold">
                        Main Image
                      </div>
                    </div>
                  </div>
                )}

                {/* All Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {uploadedImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(event) => handleImageDragStart(event, index)}
                      onDragOver={handleImageDragOver}
                      onDrop={(event) => handleImageDrop(event, index)}
                      onDragEnd={handleImageDragEnd}
                      className={`relative group cursor-grab active:cursor-grabbing transition ${
                        draggedImageIndex === index ? 'opacity-75 ring-2 ring-[#a08efe]' : ''
                      }`}
                      title="Drag to reorder"
                    >
                      <img
                        src={imageUrl}
                        alt={`Property image ${index + 1}`}
                        className={`w-full h-24 object-cover rounded-lg border-2 ${
                          index === 0 ? 'border-[#a08efe]' : 'border-gray-200'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-[#a08efe] text-white text-xs px-2 py-1 rounded font-semibold">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Details and About - Available for all property types */}
        <div className="border-t pt-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Property Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Details
              </label>
              <textarea
                name="locationDetails"
                value={formData.locationDetails}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                placeholder=""
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
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              />
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Secondary Metro Station (optional)
                </label>
                <input
                  type="text"
                  name="metroStationDistance2"
                  value={formData.metroStationDistance2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nearest Railway Station Distance
              </label>
              <input
                type="text"
                name="railwayStationDistance"
                value={formData.railwayStationDistance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              />
              <div className="mt-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Secondary Railway Station (optional)
                </label>
                <input
                  type="text"
                  name="railwayStationDistance2"
                  value={formData.railwayStationDistance2}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Map Link
              </label>
              <input
                type="url"
                name="googleMapLink"
                value={formData.googleMapLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                placeholder=""
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Space
              </label>
              <textarea
                name="aboutWorkspace"
                value={formData.aboutWorkspace}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* Workspace Details - Dynamic based on selected category */}
        {(formData.type === 'COWORKING' || formData.type === 'MANAGED_OFFICE') && (
          <div className="border-t pt-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {primaryCategoryLabel} Details
            </h3>
            {selectedCategoryNames.length > 1 && (
              <p className="text-sm text-gray-600 mb-4">
                Also listed under: {selectedCategoryNames.slice(1).join(', ')}
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Workspace Name removed as requested */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'COWORKING' ? 'Workspace Timings *' : 'Office Timings *'}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    name="monFriTime"
                    value={formData.monFriTime}
                    onChange={handleChange}
                    required={formData.type === 'COWORKING' || formData.type === 'MANAGED_OFFICE'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                    placeholder="Mon to Friday"
                  />
                  <input
                    type="text"
                    name="saturdayTime"
                    value={formData.saturdayTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                    placeholder="Saturday"
                  />
                  <input
                    type="text"
                    name="sundayTime"
                    value={formData.sundayTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                    placeholder="Sunday"
                  />
                </div>
              </div>

              <div>
                {/* Capacity (Seats) and Super Area removed as requested */}
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
                  onClick={handleSelectAllAmenities}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    formData.amenities.length === availableAmenities.length
                      ? 'bg-gray-500 text-white hover:bg-gray-600'
                      : 'bg-[#a08efe] text-white hover:bg-[#8a7eff]'
                  }`}
                >
                  {formData.amenities.length === availableAmenities.length
                    ? 'Deselect All'
                    : 'Select All Amenities'}
                </button>
                {formData.amenities.length > 0 && (
                  <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                    {formData.amenities.length} / {availableAmenities.length} Selected
                  </span>
                )}
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

        {/* Seating Plans Section */}
        <div className="border-t pt-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seating Plans</h3>
          <p className="text-sm text-gray-600 mb-6">Select which seating plans to display on the property page. You can select one or more options based on your property type.</p>
          
          <div className="space-y-4">
            {formData.seatingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`border-2 rounded-xl p-4 transition-all ${
                  plan.isSelected
                    ? 'border-[#a08efe] bg-[#a08efe]/5'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <input
                    type="checkbox"
                    checked={plan.isSelected}
                    onChange={() => handleSeatingPlanToggle(plan.id)}
                    className="mt-1 w-5 h-5 text-[#a08efe] border-gray-300 rounded focus:ring-[#a08efe]"
                  />
                  <div className="flex-1">
                    <div className="mb-2">
                      <h4 className="font-semibold text-gray-900">{plan.title}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={plan.id === 'meeting-room' ? 'col-span-2' : ''}>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        {plan.id === 'meeting-room' ? (
                          <textarea
                            value={plan.description}
                            onChange={(e) => handleSeatingPlanUpdate(plan.id, 'description', e.target.value)}
                            rows={8}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                          />
                        ) : plan.id === 'managed-office-space' || plan.id === 'day-pass' ? (
                          <textarea
                            value={plan.description}
                            onChange={(e) => handleSeatingPlanUpdate(plan.id, 'description', e.target.value)}
                            rows={6}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                          />
                        ) : (
                          <textarea
                            value={plan.description}
                            onChange={(e) => handleSeatingPlanUpdate(plan.id, 'description', e.target.value)}
                            rows={4}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                          />
                        )}
                      </div>
                      
                      {/* Price column removed as requested */}
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Seating
                        </label>
                        {plan.id === 'meeting-room' ? (
                          <div className="flex flex-col gap-2">
                            {['04 Seater','06 Seater','08 Seater','10 Seater','12+ Seats'].map((opt) => {
                              const current = (plan.seating || '').split(',').map(s => s.trim()).filter(Boolean);
                              const checked = current.includes(opt);
                              const toggle = () => {
                                let next = new Set(current);
                                if (checked) {
                                  next.delete(opt);
                                } else {
                                  next.add(opt);
                                }
                                const seatingValue = Array.from(next).join(', ');
                                handleSeatingPlanUpdate(plan.id, 'seating', seatingValue);
                              };
                              return (
                                <div key={opt} className="flex items-center gap-3">
                                  <label className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs">
                                    <input type="checkbox" checked={checked} onChange={toggle} />
                                    <span>{opt}</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={(plan.seatingPrices && plan.seatingPrices[opt]) || ''}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setFormData(prev => ({
                                        ...prev,
                                        seatingPlans: prev.seatingPlans.map(p => {
                                          if (p.id !== plan.id) return p;
                                          const next = { ...(p.seatingPrices || {}) };
                                          next[opt] = value;
                                          return { ...p, seatingPrices: next };
                                        })
                                      }));
                                    }}
                                    placeholder="Price"
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={plan.seating}
                            onChange={(e) => handleSeatingPlanUpdate(plan.id, 'seating', e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                            placeholder=""
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading || isFetchingProperty}
            className="w-full sm:flex-1 bg-gradient-to-r from-[#a08efe] to-[#7a66ff] text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditMode
              ? loading
                ? 'Updating Property...'
                : 'Update Property'
              : loading
                ? 'Adding Property...'
                : 'Add Property'}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={() => {
                resetFormState();
                onCancelEdit?.();
              }}
              className="w-full sm:w-auto bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

