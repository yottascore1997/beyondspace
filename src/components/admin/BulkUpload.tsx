'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

interface UploadResult {
  success: boolean;
  totalRows: number;
  successful: number;
  failed: number;
  errors: Array<{ row: number; field?: string; message: string }>;
  createdProperties: Array<{ id: string; title: string }>;
}

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.name.endsWith('.csv') ||
        selectedFile.name.endsWith('.xlsx') ||
        selectedFile.name.endsWith('.xls')
      ) {
        setFile(selectedFile);
        setError('');
        setResult(null);
      } else {
        setError('Please upload a valid Excel file (.xlsx, .xls) or CSV file (.csv)');
        setFile(null);
      }
    }
  };

  const downloadTemplate = () => {
    // Create a link to download the template
    const link = document.createElement('a');
    link.href = '/bulk-upload-template.csv';
    link.download = 'bulk-upload-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTestTemplate = () => {
    // Create a link to download the test template with sample data
    const link = document.createElement('a');
    link.href = '/bulk-upload-test-template.csv';
    link.download = 'bulk-upload-test-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            // Handle CSV with proper quote handling
            const lines: string[] = [];
            let currentLine = '';
            let inQuotes = false;

            for (let i = 0; i < text.length; i++) {
              const char = text[i];
              const nextChar = text[i + 1];

              if (char === '"') {
                if (inQuotes && nextChar === '"') {
                  currentLine += '"';
                  i++; // Skip next quote
                } else {
                  inQuotes = !inQuotes;
                }
              } else if (char === '\n' && !inQuotes) {
                if (currentLine.trim()) {
                  lines.push(currentLine);
                }
                currentLine = '';
              } else {
                currentLine += char;
              }
            }
            if (currentLine.trim()) {
              lines.push(currentLine);
            }

            if (lines.length === 0) {
              reject(new Error('CSV file is empty'));
              return;
            }

            // Parse CSV line with proper comma handling
            const parseCSVLine = (line: string): string[] => {
              const result: string[] = [];
              let current = '';
              let inQuotes = false;

              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const nextChar = line[i + 1];

                if (char === '"') {
                  if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                  } else {
                    inQuotes = !inQuotes;
                  }
                } else if (char === ',' && !inQuotes) {
                  result.push(current.trim());
                  current = '';
                } else {
                  current += char;
                }
              }
              result.push(current.trim());
              return result;
            };

            // Normalize headers: remove spaces, convert to camelCase, handle common variations
            const normalizeHeader = (header: string): string => {
              let normalized = header.replace(/^["']+|["']+$/g, '').trim();
              // Handle common header variations
              const headerMap: Record<string, string> = {
                'google map link': 'googleMapLink',
                'Google Map Link': 'googleMapLink',
                'googleMapLink': 'googleMapLink',
                'location details': 'locationDetails',
                'Location Details': 'locationDetails',
                'locationDetails': 'locationDetails',
                'metro station distance': 'metroStationDistance',
                'Metro Station Distance': 'metroStationDistance',
                'metroStationDistance': 'metroStationDistance',
                'railway station distance': 'railwayStationDistance',
                'Railway Station Distance': 'railwayStationDistance',
                'railwayStationDistance': 'railwayStationDistance',
                'about space': 'aboutWorkspace',
                'About Space': 'aboutWorkspace',
                'aboutWorkspace': 'aboutWorkspace',
                'workspace name': 'workspaceName',
                'Workspace Name': 'workspaceName',
                'workspaceName': 'workspaceName',
                'property tier': 'propertyTier',
                'Property Tier': 'propertyTier',
                'propertyTier': 'propertyTier',
              };
              
              const lowerHeader = normalized.toLowerCase();
              if (headerMap[lowerHeader]) {
                return headerMap[lowerHeader];
              }
              
              // Default: convert to camelCase if needed
              return normalized;
            };
            
            const rawHeaders = parseCSVLine(lines[0]);
            const headers = rawHeaders.map(normalizeHeader);
            
            // Debug: Log headers
            if (process.env.NODE_ENV === 'development') {
              console.log('[CSV Parse] Raw Headers:', rawHeaders);
              console.log('[CSV Parse] Normalized Headers:', headers);
              console.log('[CSV Parse] Header count:', headers.length);
            }
            
            const rows = lines.slice(1)
              .filter(line => line.trim())
              .map((line, lineIndex) => {
                const values = parseCSVLine(line).map(v => {
                  // Remove quotes and trim, but preserve the value
                  let cleaned = v.replace(/^["']+|["']+$/g, '').trim();
                  return cleaned;
                });
                
                // Debug: Log parsed values
                if (process.env.NODE_ENV === 'development' && lineIndex === 0) {
                  console.log('[CSV Parse] First row values count:', values.length);
                  console.log('[CSV Parse] First row values:', values);
                }
                
                const obj: any = {};
                headers.forEach((header, index) => {
                  // Ensure we don't go out of bounds
                  obj[header] = values[index] !== undefined ? values[index] : '';
                  
                  // Debug: Log first row mapping (including googleMapLink)
                  if (process.env.NODE_ENV === 'development' && lineIndex === 0) {
                    if (header === 'googleMapLink' || index < 10) {
                      console.log(`[CSV Parse] ${header} = "${values[index]}"`);
                    }
                  }
                });
                
                // Debug: Log first row object
                if (process.env.NODE_ENV === 'development' && lineIndex === 0) {
                  console.log('[CSV Parse] First row object:', obj);
                  console.log('[CSV Parse] googleMapLink value:', obj.googleMapLink);
                }
                
                return obj;
              });
            resolve(rows);
          } catch (error) {
            reject(new Error('Failed to parse CSV file. Please check the format.'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file.'));
        };
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Handle Excel files
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
              defval: '',
              raw: false // Convert all values to strings
            });
            
            // Normalize Excel headers (similar to CSV normalization)
            const normalizeHeader = (header: string): string => {
              let normalized = String(header || '').trim();
              const headerMap: Record<string, string> = {
                'google map link': 'googleMapLink',
                'Google Map Link': 'googleMapLink',
                'googleMapLink': 'googleMapLink',
                'location details': 'locationDetails',
                'Location Details': 'locationDetails',
                'locationDetails': 'locationDetails',
                'metro station distance': 'metroStationDistance',
                'Metro Station Distance': 'metroStationDistance',
                'metroStationDistance': 'metroStationDistance',
                'railway station distance': 'railwayStationDistance',
                'Railway Station Distance': 'railwayStationDistance',
                'railwayStationDistance': 'railwayStationDistance',
                'about space': 'aboutWorkspace',
                'About Space': 'aboutWorkspace',
                'aboutWorkspace': 'aboutWorkspace',
                'workspace name': 'workspaceName',
                'Workspace Name': 'workspaceName',
                'workspaceName': 'workspaceName',
                'property tier': 'propertyTier',
                'Property Tier': 'propertyTier',
                'propertyTier': 'propertyTier',
              };
              
              const lowerHeader = normalized.toLowerCase();
              if (headerMap[lowerHeader]) {
                return headerMap[lowerHeader];
              }
              return normalized;
            };
            
            // Normalize all keys in Excel data
            const normalizedData = jsonData.map((row: any) => {
              const normalizedRow: any = {};
              Object.keys(row).forEach(key => {
                const normalizedKey = normalizeHeader(key);
                normalizedRow[normalizedKey] = row[key];
              });
              return normalizedRow;
            });
            
            // Debug: Log Excel parsing
            if (process.env.NODE_ENV === 'development' && normalizedData.length > 0) {
              console.log('[Excel Parse] First row keys:', Object.keys(normalizedData[0]));
              console.log('[Excel Parse] First row googleMapLink:', normalizedData[0].googleMapLink);
            }
            
            resolve(normalizedData);
          } catch (error) {
            reject(new Error('Failed to parse Excel file. Please check the format.'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file.'));
        };
      } else {
        reject(new Error('Unsupported file format. Please use .xlsx, .xls, or .csv'));
      }
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setResult(null);

    try {
      // Parse the file
      const rows = await parseFile(file);

      if (rows.length === 0) {
        setError('The file appears to be empty. Please check your file.');
        setUploading(false);
        return;
      }

      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please login again.');
        setUploading(false);
        return;
      }

      // Send to API
      const response = await fetch('/api/properties/bulk-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rows }),
      });

      const data = await response.json();

      if (response.ok || response.status === 207) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to upload properties');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bulk Upload Properties</h2>
        <p className="text-gray-600 mb-6">
          Upload multiple properties at once using an Excel file. Download the template below to get started.
        </p>

        {/* Download Template */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">Step 1: Download Template</h3>
          <p className="text-sm text-gray-600 mb-3">
            Download the template file. Choose empty template to fill yourself, or test template with sample data to test the upload.
          </p>
          <div className="flex gap-3">
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Download Empty Template
            </button>
            <button
              onClick={downloadTestTemplate}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Download Test Template (With Sample Data)
            </button>
          </div>
        </div>

        {/* Upload File */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Step 2: Upload Your File</h3>
          <p className="text-sm text-gray-600 mb-3">
            Select your filled Excel file (.xlsx, .xls) or CSV file (.csv) and click Upload.
          </p>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading}
            />
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                !file || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#a08efe] to-[#7a66ff] text-white hover:shadow-lg'
              }`}
            >
              {uploading ? 'Uploading...' : 'Upload Properties'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Upload Result */}
        {result && (
          <div className={`p-6 rounded-lg border-2 ${
            result.success
              ? 'bg-green-50 border-green-200'
              : result.successful > 0
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`font-bold text-lg mb-4 ${
              result.success ? 'text-green-800' : result.successful > 0 ? 'text-yellow-800' : 'text-red-800'
            }`}>
              Upload {result.success ? 'Successful' : 'Completed with Errors'}
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-600">Total Rows</p>
                <p className="text-2xl font-bold text-gray-900">{result.totalRows}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-green-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{result.successful}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-red-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{result.failed}</p>
              </div>
            </div>

            {result.createdProperties.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-gray-900 mb-2">Created Properties:</p>
                <div className="bg-white p-3 rounded-lg max-h-40 overflow-y-auto">
                  <ul className="space-y-1">
                    {result.createdProperties.map((prop) => (
                      <li key={prop.id} className="text-sm text-gray-700">
                        ✓ {prop.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {result.errors.length > 0 && (
              <div>
                <p className="font-semibold text-red-800 mb-2">Errors:</p>
                <div className="bg-white p-3 rounded-lg max-h-60 overflow-y-auto">
                  <ul className="space-y-2">
                    {result.errors.map((err, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-medium text-red-600">Row {err.row}:</span>{' '}
                        {err.field && <span className="text-gray-600">({err.field})</span>}{' '}
                        <span className="text-gray-700">{err.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Properties have been created without images. Please edit each property to add images manually.
              </p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Important Notes:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>All required fields must be filled: title, city, area, type (optional - auto-generated), categories, priceDisplay, price, size, beds, rating</li>
            <li><strong>Purpose</strong> is automatically generated from categories - no need to add in CSV</li>
            <li>City and Area must exist in the database (add them in Admin &gt; Areas first)</li>
            <li><strong>Type</strong> is optional - will be auto-generated from first category. If provided, must be: RESIDENTIAL, COMMERCIAL, COWORKING, or MANAGED_OFFICE</li>
            <li>Categories should be comma-separated: "coworking,managed,dedicateddesk"</li>
            <li><strong>Property Options (Seating Plans)</strong> - Two formats supported:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><strong>Simple Format:</strong> "Title|Description|Price|Seating" (one per line, use semicolon or newline to separate multiple plans)</li>
                <li><strong>Example:</strong> "Dedicated Desk|Get your dedicated desk...|11999|1-50;Flexi Desk|Just show up...|13000|1-50"</li>
                <li><strong>Meeting Room:</strong> Create separate entries for each seating option: "Meeting Room|Description|5000|04 Seater;Meeting Room|Description|6000|06 Seater"</li>
                <li><strong>JSON Format:</strong> Also supported (see template for example)</li>
              </ul>
            </li>
            <li><strong>Amenities</strong> - All amenities are automatically selected (same as "Select All" in single property form). No need to add in CSV.</li>
            <li>Images will be empty initially - add them later via Edit</li>
            <li>Workspace timings can be in separate columns (monFriTime, saturdayTime, sundayTime)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

