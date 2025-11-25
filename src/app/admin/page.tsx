'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsClient } from '@/hooks/useIsClient';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Dashboard from '@/components/admin/Dashboard';
import PropertyForm from '@/components/admin/PropertyForm';
import PropertyList from '@/components/admin/PropertyList';
import ContactList from '@/components/admin/ContactList';
import RequirementsList from '@/components/admin/RequirementsList';
import CustomerSubmissions from '@/components/admin/CustomerSubmissions';
import AreasList from '@/components/admin/AreasList';

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
  const router = useRouter();
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      checkAuth();
    }
  }, [isClient]);

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'add-property') {
      setEditingPropertyId(null);
    }
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
      {/* Sidebar */}
      {user && (
        <AdminSidebar 
          user={user} 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          onLogout={handleLogout} 
        />
      )}
      
      {/* Main Content */}
      {user && (
        <div className="flex-1 overflow-hidden">
          <div className="h-full bg-gray-50">
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
            {activeTab === 'contacts' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Inquiries</h1>
                  <ContactList token={isClient ? localStorage.getItem('token') || '' : ''} />
                </div>
              </div>
            )}
            {activeTab === 'requirements' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h1>
                  <RequirementsList />
                </div>
              </div>
            )}
            {activeTab === 'customer-submissions' && (
              <div className="p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Submissions</h1>
                  <CustomerSubmissions />
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
          </div>
        </div>
      )}
    </div>
  );
}

