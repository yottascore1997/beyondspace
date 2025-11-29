'use client';

import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';

interface BulkUploadProps {
  onUploadComplete?: () => void;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkUpload({ onUploadComplete }: BulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Excel template headers in desired order
  // Order: Basic fields → Seating Plans → Remaining fields
  const templateHeaders = [
    // Basic fields (first)
    'coworkingname',
    'buildingname',
    'city', 
    'area',
    'sublocation',
    'propertyTier',
    // Seating Plans (middle)
    'dedicated-desk',
    'flexi-desk',
    'private-cabin',
    'virtual-office',
    'meeting-room',
    'managed-office-space',
    'day-pass',
    // Remaining fields (last)
    'categories',
    'image',
    'locationDetails',
    'metroStationDistance',
    'metroStationDistance2',
    'railwayStationDistance',
    'railwayStationDistance2',
    'googleMapLink',
    'aboutWorkspace',
    'monFriTime',
    'saturdayTime',
    'sundayTime',
    'amenities'
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setMessage('');
    }
  };

  const downloadTemplate = () => {
    // Create comprehensive sample data with 4 realistic records
    // Note: Object keys order doesn't matter for XLSX, but we'll maintain logical order
    const sampleData = [
      {
        // Basic fields (first)
        coworkingname: '91Springboard',
        buildingname: 'Lotus Corporate Park',
        city: 'Mumbai',
        area: 'Andheri East',
        sublocation: 'MIDC',
        propertyTier: 'Premium',
        // Seating Plans (middle)
        'dedicated-desk': '11999',
        'flexi-desk': '8999',
        'private-cabin': '',
        'virtual-office': '',
        'meeting-room': '',
        'managed-office-space': '',
        'day-pass': '',
        // Remaining fields (last)
        categories: 'coworking,managed,dedicateddesk',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        locationDetails: 'Plot No. D, 5th Road, MIDC, Andheri East, Mumbai, Maharashtra 400093',
        metroStationDistance: '0.4 Km Walking Distance From MIDC Metro Station',
        metroStationDistance2: '1.1 Km Walking Distance From Airport Road Metro Station',
        railwayStationDistance: '3.3 Km Drive From Andheri Railway Station',
        railwayStationDistance2: '9.2 Km Drive From Ghatkopar Railway Station',
        googleMapLink: 'https://maps.google.com/?q=19.1136,72.8697',
        aboutWorkspace: 'Premium coworking space in the heart of MIDC with state-of-the-art facilities, high-speed internet, modern meeting rooms, and a vibrant community of entrepreneurs and professionals.',
        monFriTime: '9:00 AM - 8:00 PM',
        saturdayTime: '9:00 AM - 6:00 PM',
        sundayTime: '10:00 AM - 4:00 PM',
        amenities: '' // Leave empty to auto-select all amenities
      },
      {
        // Basic fields (first)
        coworkingname: 'WeWork BKC',
        buildingname: 'Tower 1',
        city: 'Mumbai',
        area: 'BKC',
        sublocation: '',
        propertyTier: 'Luxury',
        // Seating Plans (middle)
        'dedicated-desk': '30000',
        'flexi-desk': '',
        'private-cabin': '',
        'virtual-office': '',
        'meeting-room': '',
        'managed-office-space': '45000',
        'day-pass': '',
        // Remaining fields (last)
        categories: 'managed,enterpriseoffices,coworking',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        locationDetails: 'Tower 1, Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051',
        metroStationDistance: '0.2 Km Walking Distance From BKC Metro Station',
        metroStationDistance2: '',
        railwayStationDistance: '1.5 Km Drive From Kurla Railway Station',
        railwayStationDistance2: '2.8 Km Drive From Bandra Railway Station',
        googleMapLink: 'https://maps.google.com/?q=19.0596,72.8656',
        aboutWorkspace: 'Luxury managed office space in Mumbai\'s premier business district with world-class amenities, premium interiors, and stunning city views. Perfect for enterprises and growing teams.',
        monFriTime: '8:00 AM - 10:00 PM',
        saturdayTime: '9:00 AM - 7:00 PM',
        sundayTime: '10:00 AM - 6:00 PM',
        amenities: ''
      },
      {
        // Basic fields (first)
        coworkingname: 'Awfis Space Solutions',
        buildingname: 'Lower Parel',
        city: 'Mumbai',
        area: 'Lower Parel',
        sublocation: 'Kamala Mills',
        propertyTier: 'Premium',
        // Seating Plans (middle)
        'dedicated-desk': '12500',
        'flexi-desk': '9500',
        'private-cabin': '',
        'virtual-office': '',
        'meeting-room': '',
        'managed-office-space': '',
        'day-pass': '',
        // Remaining fields (last)
        categories: 'coworking,dedicateddesk,flexidesk',
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
        locationDetails: 'Kamala Mills Compound, Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
        metroStationDistance: '0.8 Km Walking Distance From Lower Parel Metro Station',
        metroStationDistance2: '',
        railwayStationDistance: '0.5 Km Walking Distance From Lower Parel Railway Station',
        railwayStationDistance2: '',
        googleMapLink: 'https://maps.google.com/?q=19.0144,72.8312',
        aboutWorkspace: 'Modern coworking space in the trendy Kamala Mills area with flexible seating options, creative interiors, networking events, and easy access to cafes and restaurants.',
        monFriTime: '9:00 AM - 9:00 PM',
        saturdayTime: '10:00 AM - 6:00 PM',
        sundayTime: 'Closed',
        amenities: ''
      },
      {
        // Basic fields (first)
        coworkingname: 'Innov8 Coworking',
        buildingname: 'Powai',
        city: 'Mumbai',
        area: 'Powai',
        sublocation: 'Hiranandani',
        propertyTier: 'Popular',
        // Seating Plans (middle)
        'dedicated-desk': '',
        'flexi-desk': '7500',
        'private-cabin': '',
        'virtual-office': '3500',
        'meeting-room': '500',
        'managed-office-space': '',
        'day-pass': '',
        // Remaining fields (last)
        categories: 'coworking,meetingroom,virtualoffice',
        image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
        locationDetails: 'Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
        metroStationDistance: '2.5 Km Drive From Ghatkopar Metro Station',
        metroStationDistance2: '',
        railwayStationDistance: '4.2 Km Drive From Kanjurmarg Railway Station',
        railwayStationDistance2: '5.8 Km Drive From Vikhroli Railway Station',
        googleMapLink: 'https://maps.google.com/?q=19.1197,72.9089',
        aboutWorkspace: 'Vibrant coworking space in the tech hub of Powai with a young, energetic community. Offers flexible workspace solutions, meeting rooms, and virtual office services for startups and freelancers.',
        monFriTime: '8:30 AM - 8:30 PM',
        saturdayTime: '9:30 AM - 5:30 PM',
        sundayTime: '10:00 AM - 3:00 PM',
        amenities: ''
      }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create worksheet with ordered columns
    // First, create sheet with data
    const ws = XLSX.utils.json_to_sheet(sampleData);
    
    // Reorder columns according to templateHeaders order
    // XLSX maintains column order based on first object's keys, so we need to ensure order
    const orderedData = sampleData.map(row => {
      const orderedRow: any = {};
      templateHeaders.forEach(header => {
        orderedRow[header] = (row as any)[header] || '';
      });
      return orderedRow;
    });
    
    // Create new worksheet with ordered columns
    const orderedWs = XLSX.utils.json_to_sheet(orderedData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, orderedWs, 'Properties');
    
    // Download file
    XLSX.writeFile(wb, 'property-upload-template.xlsx');
  };

  const parseExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first worksheet
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error('Excel file must have at least a header row and one data row'));
            return;
          }
          
          // Get headers and data
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1);
          
          // Validate headers
          const missingHeaders = templateHeaders.filter(h => !headers.includes(h));
          if (missingHeaders.length > 0) {
            reject(new Error(`Missing required columns: ${missingHeaders.join(', ')}`));
            return;
          }
          
          // Convert rows to objects
          const properties = rows
            .filter(row => Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== ''))
            .map((row: any[]) => {
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = row[index] || '';
              });
              return obj;
            });
          
          resolve(properties);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');
    setResult(null);

    try {
      // Parse Excel file
      setMessage('Parsing Excel file...');
      const data = await parseExcelFile(file);
      
      if (data.length === 0) {
        setMessage('No valid data found in Excel file');
        setUploading(false);
        return;
      }

      setMessage(`Found ${data.length} properties. Uploading...`);

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication required. Please login again.');
        setUploading(false);
        return;
      }

      // Upload to API
      const response = await fetch('/api/properties/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ data })
      });

      const responseData = await response.json();

      if (response.ok) {
        setResult(responseData.results);
        setMessage(responseData.message);
        onUploadComplete?.();
      } else {
        setMessage(`Upload failed: ${responseData.error}`);
        if (responseData.details) {
          setResult({
            success: 0,
            failed: 0,
            errors: Array.isArray(responseData.details) ? responseData.details : [responseData.details]
          });
        }
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResult(null);
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Bulk Property Upload</h2>
        <p className="text-sm text-gray-600">
          Upload multiple properties at once using an Excel file. Download the template to get started.
        </p>
      </div>

      {/* Download Template */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Step 1: Download Template</h3>
        <p className="text-sm text-blue-700 mb-3">
          Download the Excel template with sample data and required column headers.
        </p>
        <button
          onClick={downloadTemplate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          📥 Download Excel Template
        </button>
      </div>

      {/* File Upload */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">Step 2: Upload Your File</h3>
        <p className="text-sm text-gray-600 mb-3">
          Fill the template with your property data and upload the Excel file.
        </p>
        
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#a08efe] file:text-white hover:file:bg-[#8a7eff]"
          />
          
          {file && (
            <button
              onClick={resetUpload}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Clear
            </button>
          )}
        </div>
        
        {file && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {/* Upload Button */}
      <div className="mb-6">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            !file || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#a08efe] text-white hover:bg-[#8a7eff]'
          }`}
        >
          {uploading ? '⏳ Uploading...' : '🚀 Upload Properties'}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${
          message.includes('Error') || message.includes('failed')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{result.success}</div>
              <div className="text-sm text-green-700">Properties Created</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{result.failed}</div>
              <div className="text-sm text-red-700">Failed</div>
            </div>
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {result.errors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-900 mb-2">📋 Important Notes:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Required fields:</strong> coworkingname, buildingname, city, area, categories, image, locationDetails</li>
          <li>• <strong>Categories format:</strong> Comma-separated (e.g., "coworking,managed,dedicateddesk")</li>
          <li>• <strong>City & Area:</strong> Must exist in the database</li>
          <li>• <strong>Images:</strong> Provide valid image URLs</li>
          <li>• <strong>Amenities:</strong> Leave empty to auto-select all amenities, or provide JSON array</li>
          <li>• <strong>Seating Plans:</strong> Each plan has its own column. Enter price in the respective column (e.g., "dedicated-desk" column = "11999"). Leave empty if not applicable.</li>
          <li>• <strong>Available Columns:</strong> dedicated-desk, flexi-desk, private-cabin, virtual-office, meeting-room, managed-office-space, day-pass</li>
          <li>• <strong>Timing format:</strong> Use readable format (e.g., "9:00 AM - 6:00 PM")</li>
        </ul>
      </div>
    </div>
  );
}
