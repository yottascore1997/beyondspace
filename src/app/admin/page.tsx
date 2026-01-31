'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsClient } from '@/hooks/useIsClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Dashboard from '@/components/admin/Dashboard';
import PropertyForm from '@/components/admin/PropertyForm';
import PropertyList from '@/components/admin/PropertyList';
import ContactList from '@/components/admin/ContactList';
import AreasList from '@/components/admin/AreasList';
import BulkUpload from '@/components/admin/BulkUpload';
import TestimonialsList from '@/components/admin/TestimonialsList';
import TestimonialForm from '@/components/admin/TestimonialForm';
import SectionImagesManager from '@/components/admin/SectionImagesManager';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propertyListRefreshKey, setPropertyListRefreshKey] = useState(0);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialListRefreshKey, setTestimonialListRefreshKey] = useState(0);
  const [unreadInquiriesCount, setUnreadInquiriesCount] = useState(0);
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      checkAuth();
    }
  }, [isClient]);

  const fetchUnreadInquiriesCount = async () => {
    try {
      const res = await fetch('/api/contact/stats');
      if (res.ok) {
        const data = await res.json();
        setUnreadInquiriesCount(data.unread ?? 0);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (user && isClient) {
      fetchUnreadInquiriesCount();
    }
  }, [user, isClient]);

  useEffect(() => {
    if (activeTab === 'contacts' && isClient) {
      fetchUnreadInquiriesCount();
    }
  }, [activeTab, isClient]);

  const checkAuth = async () => {
    // Check if we're on the client side
    if (!isClient) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (isClient) {
      localStorage.removeItem('token');
    }
    router.push('/admin/login');
  };

  const handleEditProperty = (propertyId: string) => {
    setEditingPropertyId(propertyId);
    setActiveTab('add-property');
  };

  const handleFormFinish = (action: 'created' | 'updated') => {
    if (action === 'updated') {
      setPropertyListRefreshKey(prev => prev + 1);
      setEditingPropertyId(null);
      setActiveTab('properties');
    } else if (action === 'created') {
      setPropertyListRefreshKey(prev => prev + 1);
    }
  };

  const handleCancelEdit = () => {
    setEditingPropertyId(null);
    setActiveTab('properties');
  };

  const handleBulkUploadComplete = () => {
    setPropertyListRefreshKey(prev => prev + 1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'add-property') {
      setEditingPropertyId(null);
    }
    if (tab !== 'add-testimonial') {
      setEditingTestimonialId(null);
    }
  };

  const handleEditTestimonial = (testimonialId: string) => {
    setEditingTestimonialId(testimonialId);
    setActiveTab('add-testimonial');
  };

  const handleTestimonialFormFinish = (action: 'created' | 'updated') => {
    if (action === 'updated') {
      setTestimonialListRefreshKey(prev => prev + 1);
      setEditingTestimonialId(null);
      setActiveTab('testimonials');
    } else if (action === 'created') {
      setTestimonialListRefreshKey(prev => prev + 1);
    }
  };

  const handleCancelTestimonialEdit = () => {
    setEditingTestimonialId(null);
    setActiveTab('testimonials');
  };

  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a08efe] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed */}
      {user && (
        <AdminSidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          onLogout={handleLogout}
          unreadInquiriesCount={unreadInquiriesCount}
        />
      )}
      
      {/* Main Content - Scrollable */}
      {user && (
        <div className="flex-1 overflow-y-auto" style={{ marginLeft: '288px' }}>
          <div className="bg-gray-50 min-h-screen">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'properties' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Properties Management</h1>
                  <PropertyList
                    onEditProperty={handleEditProperty}
                    refreshKey={propertyListRefreshKey}
                  />
                </div>
              </div>
            )}
            {activeTab === 'add-property' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h1>
                  <PropertyForm
                    editingPropertyId={editingPropertyId}
                    onFinish={handleFormFinish}
                    onCancelEdit={handleCancelEdit}
                  />
                </div>
              </div>
            )}
            {activeTab === 'bulk-upload' && (
              <div className="p-8">
                <BulkUpload onUploadComplete={handleBulkUploadComplete} />
              </div>
            )}
            {activeTab === 'contacts' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Inquiries</h1>
                  <ContactList 
                    token={isClient ? localStorage.getItem('token') || '' : ''} 
                    onContactUpdate={fetchUnreadInquiriesCount}
                  />
                </div>
              </div>
            )}
            {activeTab === 'areas' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <AreasList />
                </div>
              </div>
            )}
            {activeTab === 'testimonials' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
                    <button
                      onClick={() => {
                        setEditingTestimonialId(null);
                        setActiveTab('add-testimonial');
                      }}
                      className="px-4 py-2 bg-[#a08efe] text-white rounded-lg hover:bg-[#7a66ff] transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Testimonial
                    </button>
                  </div>
                  <TestimonialsList
                    onEditTestimonial={handleEditTestimonial}
                    refreshKey={testimonialListRefreshKey}
                  />
                </div>
              </div>
            )}
            {activeTab === 'add-testimonial' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}
                  </h1>
                  <TestimonialForm
                    editingTestimonialId={editingTestimonialId}
                    onFinish={handleTestimonialFormFinish}
                    onCancelEdit={handleCancelTestimonialEdit}
                  />
                </div>
              </div>
            )}
            {activeTab === 'section-images' && (
              <div className="p-8">
                <SectionImagesManager />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

