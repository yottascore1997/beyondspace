'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Only fetch on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      // Fetch properties count
      const propertiesRes = await fetch('/api/properties');
      const properties = await propertiesRes.json();
      
      // Fetch contacts count
      const contactsRes = await fetch('/api/contact');
      const contacts = await contactsRes.json();

      setStats({
        totalProperties: properties.length,
        totalContacts: contacts.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.totalProperties,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Inquiries',
      value: stats.totalContacts,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your properties.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}>
                {card.icon}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
              <p className="text-gray-600 font-medium">{card.title}</p>
              {card.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-[#a08efe] to-[#7a66ff] text-white rounded-xl hover:shadow-lg transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold">Add New Property</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-semibold">View All Properties</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-semibold">Check Inquiries</span>
          </button>
        </div>
      </div>
    </div>
  );
}
