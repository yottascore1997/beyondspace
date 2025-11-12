'use client';

import { useState, useEffect } from 'react';

interface CustomerSubmission {
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
  description: string;
  workspaceName: string | null;
  workspaceTimings: string | null;
  workspaceClosedDays: string | null;
  locationDetails: string | null;
  metroStationDistance: string | null;
  railwayStationDistance: string | null;
  aboutWorkspace: string | null;
  capacity: number | null;
  superArea: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerSubmissions() {
  const [submissions, setSubmissions] = useState<CustomerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/properties/customer');
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        setSubmissions(prev =>
          prev.map(submission => 
            submission.id === id ? { ...submission, isActive } : submission
          )
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !submission.isActive;
    if (filter === 'approved') return submission.isActive;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All', count: submissions.length },
          { key: 'pending', label: 'Pending', count: submissions.filter(s => !s.isActive).length },
          { key: 'approved', label: 'Approved', count: submissions.filter(s => s.isActive).length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === tab.key
                ? 'bg-orange-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
            <p className="text-gray-500">No customer submissions match your current filter.</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{submission.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      submission.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.isActive ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">{submission.area}, {submission.city}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="text-gray-900 capitalize">{submission.type.replace('_', ' ')}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-gray-900">{submission.priceDisplay}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Size</p>
                      <p className="text-gray-900">{submission.size} sq ft</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Beds/Seats</p>
                      <p className="text-gray-900">{submission.beds}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="text-gray-900">{submission.rating}/5</p>
                    </div>
                  </div>
                  
                  {submission.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="text-gray-700 text-sm">{submission.description}</p>
                    </div>
                  )}
                  
                  {(submission.metroStationDistance || submission.railwayStationDistance) && (
                    <div className="mb-4 grid gap-3 md:grid-cols-2">
                      {submission.metroStationDistance && (
                        <div>
                          <p className="text-sm text-gray-500">Metro Station Distance</p>
                          <p className="text-gray-900">{submission.metroStationDistance}</p>
                        </div>
                      )}
                      {submission.railwayStationDistance && (
                        <div>
                          <p className="text-sm text-gray-500">Railway Station Distance</p>
                          <p className="text-gray-900">{submission.railwayStationDistance}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                    </p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updatePropertyStatus(submission.id, !submission.isActive)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          submission.isActive
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {submission.isActive ? 'Deactivate' : 'Approve'}
                      </button>
                      
                      <a
                        href={`/property/${submission.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
