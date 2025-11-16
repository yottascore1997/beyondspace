'use client';

import { useState, useEffect } from 'react';

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
  createdAt: string;
}

export default function AreasList() {
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [filterCityId, setFilterCityId] = useState<string>('');
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    cityId: '',
  });
  const [bulkCityId, setBulkCityId] = useState<string>('');
  const [bulkText, setBulkText] = useState<string>('');
  const [bulkBusy, setBulkBusy] = useState<boolean>(false);
  const [formBusy, setFormBusy] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [formOk, setFormOk] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch cities
      const citiesResponse = await fetch('/api/cities', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (citiesResponse.ok) {
        const citiesData = await citiesResponse.json();
        setCities(citiesData);
        const mumbai = Array.isArray(citiesData)
          ? citiesData.find((c: { name?: string }) => String(c?.name || '').toLowerCase() === 'mumbai')
          : null;
        if (mumbai && !filterCityId) {
          setFilterCityId(mumbai.id);
        } else if (!filterCityId && Array.isArray(citiesData) && citiesData.length > 0) {
          setFilterCityId(citiesData[0].id);
        }
      }

      // Fetch areas
      const areasResponse = await fetch('/api/areas', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (areasResponse.ok) {
        const areasData = await areasResponse.json();
        setAreas(areasData);
      } else {
        setError('Failed to fetch areas');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ name: '', cityId: '' });
    setShowAddModal(true);
    setError('');
    setMessage('');
  };

  const handleBulk = () => {
    setBulkCityId('');
    setBulkText('');
    setShowBulkModal(true);
    setError('');
    setMessage('');
  };
  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      cityId: area.cityId,
    });
    setShowEditModal(true);
    setError('');
    setMessage('');
    setFormError('');
    setFormOk('');
  };

  const handleDelete = async (area: Area) => {
    if (!confirm(`Are you sure you want to delete "${area.name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/areas/${area.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage('Area deleted successfully');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete area');
      }
    } catch (error) {
      console.error('Error deleting area:', error);
      setError('Failed to delete area');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setFormError('');
    setFormOk('');
    setFormBusy(true);

    try {
      const token = localStorage.getItem('token');
      const url = editingArea ? `/api/areas/${editingArea.id}` : '/api/areas';
      const method = editingArea ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormOk(editingArea ? 'Area updated successfully' : 'Area added successfully');
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingArea(null);
        setFormData({ name: '', cityId: '' });
        fetchData();
        setTimeout(() => {
          setFormOk('');
          setMessage('');
        }, 2000);
      } else {
        let msg = 'Failed to save area';
        try {
          const data = await response.json();
          if (data?.error) msg = data.error;
        } catch {
          try {
            const text = await response.text();
            if (text) msg = `${msg}: ${text.slice(0, 200)}`;
          } catch {}
        }
        if (response.status === 401) {
          msg = 'Unauthorized. Please log in again.';
        }
        setFormError(msg);
        setError(msg);
      }
    } catch (error) {
      console.error('Error saving area:', error);
      setFormError('Failed to save area');
      setError('Failed to save area');
    }
    setFormBusy(false);
  };

  const handleAddCity = async () => {
    const cityName = prompt('Enter city name:');
    if (!cityName || !cityName.trim()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: cityName.trim() }),
      });

      if (response.ok) {
        setMessage('City added successfully');
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add city');
      }
    } catch (error) {
      console.error('Error adding city:', error);
      setError('Failed to add city');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a08efe]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Areas</h2>
          <p className="text-sm text-gray-600 mt-1">Add, edit, or delete areas for each city</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddCity}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Add City
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-gradient-to-r from-[#a08efe] to-[#7a66ff] text-white rounded-lg hover:from-[#8a7efe] hover:to-[#8a76ff] transition-colors font-medium"
          >
            Add Area
          </button>
          <button
            onClick={handleBulk}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Bulk Add
          </button>
        </div>
      </div>

      {/* Filter by City */}
      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-gray-700">Filter by City:</label>
        <select
          value={filterCityId}
          onChange={(e) => setFilterCityId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
      </div>

      {/* Areas List */}
      {filterCityId ? (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {cities.find(c => c.id === filterCityId)?.name} — Areas ({areas.filter(a => a.cityId === filterCityId).length})
            </h3>
          </div>
          {areas.filter(a => a.cityId === filterCityId).length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No areas found for this city.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {areas
                .filter(a => a.cityId === filterCityId)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((area) => (
                  <div key={area.id} className="flex items-center justify-between gap-2 px-3 py-2 border rounded-lg">
                    <span className="text-sm text-gray-800 truncate">{area.name}</span>
                    <button
                      onClick={() => handleEdit(area)}
                      className="text-xs text-[#6b5bff] hover:text-[#4e3fff]"
                      title="Edit"
                    >
                      Edit
                    </button>
                  </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {areas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No areas found. Click "Add Area" to create one.
                    </td>
                  </tr>
                ) : (
                  areas.map((area) => (
                    <tr key={area.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {area.city.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {area.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(area)}
                          className="text-[#a08efe] hover:text-[#7a66ff]"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Area</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  value={formData.cityId}
                  onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="Enter area name"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: '', cityId: '' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#a08efe] to-[#7a66ff] text-white rounded-lg hover:from-[#8a7efe] hover:to-[#8a76ff] transition-colors"
                >
                  Add Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Area</h3>
            <form onSubmit={handleSubmit}>
              {formError && (
                <div className="mb-3 p-2 text-sm rounded bg-red-50 text-red-700 border border-red-200">
                  {formError}
                </div>
              )}
              {formOk && (
                <div className="mb-3 p-2 text-sm rounded bg-green-50 text-green-700 border border-green-200">
                  {formOk}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <select
                  value={formData.cityId}
                  onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
                  placeholder="Enter area name"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingArea(null);
                    setFormData({ name: '', cityId: '' });
                    setFormError('');
                    setFormOk('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formBusy}
                  className="px-4 py-2 bg-gradient-to-r from-[#a08efe] to-[#7a66ff] text-white rounded-lg disabled:opacity-50 hover:from-[#8a7efe] hover:to-[#8a76ff] transition-colors"
                >
                  {formBusy ? 'Updating...' : 'Update Area'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Add Areas</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <select
                value={bulkCityId}
                onChange={(e) => setBulkCityId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Area names (comma or newline separated)</label>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={6}
                placeholder="Andheri East, Andheri West, BKC&#10;Powai&#10;Lower Parel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a08efe] focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkCityId('');
                  setBulkText('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bulkBusy || !bulkCityId || !bulkText.trim()}
                onClick={async () => {
                  setBulkBusy(true);
                  setError('');
                  setMessage('');
                  try {
                    const token = localStorage.getItem('token');
                    const raw = bulkText
                      .split(/[\n,]/g)
                      .map(s => s.trim())
                      .filter(Boolean);
                    const unique = Array.from(new Set(raw));
                    let success = 0;
                    let failed = 0;
                    for (const name of unique) {
                      const res = await fetch('/api/areas', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: JSON.stringify({ name, cityId: bulkCityId }),
                      });
                      if (res.ok) success++; else failed++;
                    }
                    setMessage(`Added ${success} areas${failed ? `, ${failed} skipped/failed` : ''}.`);
                    setShowBulkModal(false);
                    setBulkCityId('');
                    setBulkText('');
                    fetchData();
                    setTimeout(() => setMessage(''), 4000);
                  } catch {
                    setError('Bulk add failed. Please try again.');
                  } finally {
                    setBulkBusy(false);
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#a08efe] to-[#7a66ff] text-white rounded-lg disabled:opacity-50 hover:from-[#8a7efe] hover:to-[#8a76ff] transition-colors"
              >
                {bulkBusy ? 'Adding...' : 'Add Areas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

