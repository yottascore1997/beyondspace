'use client';

import { useState, useEffect } from 'react';

interface ContactForm {
  id: string;
  name: string;
  mobile: string;
  email: string;
  solution: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
}

interface ContactListProps {
  token: string;
}

export default function ContactList({ token }: ContactListProps) {
  const [contacts, setContacts] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Helper function to format mobile number as "XXXX XXX XXX"
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // If 10 digits, format as XXXX XXX XXX
    if (digits.length === 10) {
      return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
    // Return as is if not 10 digits
    return phone;
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contact?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
        setTotalPages(data.pagination.pages);
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        setContacts(prev => 
          prev.map(contact => 
            contact.id === id ? { ...contact, isRead: true } : contact
          )
        );
        if (selectedContact?.id === id) {
          setSelectedContact(prev => prev ? { ...prev, isRead: true } : null);
        }
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getSolutionIcon = (solution: string) => {
    const icons: { [key: string]: string } = {
      'meeting-rooms': '🏢',
      'coworking-space': '💼',
      'office': '🏢',
      'commercial': '🏪',
      'residential': '🏠',
    };
    return icons[solution] || '📋';
  };

  const getSolutionLabel = (solution: string) => {
    const labels: { [key: string]: string } = {
      'meeting-rooms': 'Meeting Rooms',
      'coworking-space': 'Coworking Space',
      'office': 'Office Space',
      'commercial': 'Commercial Space',
      'residential': 'Residential',
    };
    return labels[solution] || solution;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Inquiries</h2>
        <div className="text-sm text-gray-500">
          {contacts.length} total inquiries
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Recent Inquiries</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {contacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No inquiries yet
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-blue-50 border-blue-200' : ''
                    } ${!contact.isRead ? 'bg-yellow-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {contact.name}
                          </h4>
                          {!contact.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {contact.email}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg">
                            {getSolutionIcon(contact.solution)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {getSolutionLabel(contact.solution)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(contact.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm text-gray-600">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-2">
          {selectedContact ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedContact.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getSolutionIcon(selectedContact.solution)}
                      </span>
                      <span className="text-lg font-medium text-gray-700">
                        {getSolutionLabel(selectedContact.solution)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedContact.createdAt)}
                    </p>
                    {!selectedContact.isRead && (
                      <button
                        onClick={() => markAsRead(selectedContact.id)}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <p className="text-gray-900">+91 {formatPhoneNumber(selectedContact.mobile)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Solution Interest
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getSolutionIcon(selectedContact.solution)}
                      </span>
                      <span className="text-gray-900">
                        {getSolutionLabel(selectedContact.solution)}
                      </span>
                    </div>
                  </div>

                  {selectedContact.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {selectedContact.message}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="px-4 py-2 bg-[#a08efe] text-white rounded-lg hover:bg-[#7a66ff] transition-colors"
                    >
                      Reply via Email
                    </a>
                    <a
                      href={`tel:+91${selectedContact.mobile}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select an inquiry to view details
              </h3>
              <p className="text-gray-500">
                Click on any inquiry from the list to see full details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



