'use client';

import { useState, useEffect } from 'react';

interface Requirement {
  id: string;
  name: string;
  mobile: string;
  email: string;
  interest: string | null;
  company: string | null;
  teamSize: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function RequirementsList() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const response = await fetch('/api/requirements');
      const data = await response.json();
      setRequirements(data);
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/requirements/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRequirements(prev =>
          prev.map(req => req.id === id ? { ...req, status: newStatus } : req)
        );
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredRequirements = requirements.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-20 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All', count: requirements.length },
          { key: 'new', label: 'New', count: requirements.filter(r => r.status === 'new').length },
          { key: 'contacted', label: 'Contacted', count: requirements.filter(r => r.status === 'contacted').length },
          { key: 'in-progress', label: 'In Progress', count: requirements.filter(r => r.status === 'in-progress').length },
          { key: 'completed', label: 'Completed', count: requirements.filter(r => r.status === 'completed').length },
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

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements found</h3>
            <p className="text-gray-500">No requirements match your current filter.</p>
          </div>
        ) : (
          filteredRequirements.map((requirement) => (
            <div key={requirement.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{requirement.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                      {requirement.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="text-gray-900">{requirement.mobile}</p>
                      <p className="text-gray-600">{requirement.email}</p>
                    </div>
                    
                    {requirement.company && (
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="text-gray-900">{requirement.company}</p>
                      </div>
                    )}
                    
                    {requirement.interest && (
                      <div>
                        <p className="text-sm text-gray-500">Interest</p>
                        <p className="text-gray-900 capitalize">{requirement.interest.replace('-', ' ')}</p>
                      </div>
                    )}
                    
                    {requirement.teamSize && (
                      <div>
                        <p className="text-sm text-gray-500">Team Size</p>
                        <p className="text-gray-900">{requirement.teamSize} people</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(requirement.createdAt).toLocaleDateString()}
                    </p>
                    
                    <div className="flex space-x-2">
                      <select
                        value={requirement.status}
                        onChange={(e) => updateStatus(requirement.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      <a
                        href={`tel:${requirement.mobile}`}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        Call
                      </a>
                      
                      <a
                        href={`mailto:${requirement.email}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        Email
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
