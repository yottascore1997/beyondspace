import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

interface BulkUploadRow {
  title: string;
  city: string;
  area: string;
  sublocation?: string;
  type?: string; // Optional - can be derived from categories
  categories: string;
  priceDisplay: string;
  price: string | number;
  size: string | number;
  beds: string;
  rating: string | number;
  tag?: string;
  description?: string;
  propertyTier?: string;
  displayOrder?: string | number;
  locationDetails?: string;
  metroStationDistance?: string;
  metroStationDistance2?: string;
  railwayStationDistance?: string;
  railwayStationDistance2?: string;
  googleMapLink?: string;
  workspaceName?: string;
  monFriTime?: string;
  saturdayTime?: string;
  sundayTime?: string;
  workspaceClosedDays?: string;
  aboutWorkspace?: string;
  capacity?: string | number;
  superArea?: string | number;
  propertyOptions?: string;
  amenities?: string;
}

interface ValidationError {
  row: number;
  field?: string;
  message: string;
}

interface UploadResult {
  success: boolean;
  totalRows: number;
  successful: number;
  failed: number;
  errors: ValidationError[];
  createdProperties: Array<{ id: string; title: string }>;
}

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const data = await request.json();
    const { rows } = data;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { error: 'No data provided. Please upload a valid Excel file.' },
        { status: 400 }
      );
    }

    // Verify user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    const result: UploadResult = {
      success: true,
      totalRows: rows.length,
      successful: 0,
      failed: 0,
      errors: [],
      createdProperties: [],
    };

    // Validate cities and areas exist
    const cities = await prisma.city.findMany({
      include: { areas: true },
    });
    const cityMap = new Map(cities.map(c => [c.name.toLowerCase(), c]));
    const areaMap = new Map<string, { id: string; cityId: string }>();
    cities.forEach(city => {
      city.areas.forEach(area => {
        areaMap.set(`${city.name.toLowerCase()}|${area.name.toLowerCase()}`, {
          id: area.id,
          cityId: city.id,
        });
      });
    });

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as BulkUploadRow;
      const rowNumber = i + 2; // Excel row number (1 is header)

      // Debug: Log raw row data
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Row ${rowNumber}] Raw CSV Data:`, JSON.stringify(row, null, 2));
      }

      try {
        // Validate required fields with better error messages
        // Purpose is auto-generated from categories, so not required
        // priceDisplay, price, size, beds, rating are optional
        const missingFields: string[] = [];
        if (!row.title || String(row.title).trim() === '') missingFields.push('title');
        if (!row.city || String(row.city).trim() === '') missingFields.push('city');
        if (!row.area || String(row.area).trim() === '') missingFields.push('area');
        if (!row.categories || String(row.categories).trim() === '') missingFields.push('categories');

        if (missingFields.length > 0) {
          result.errors.push({
            row: rowNumber,
            message: `Missing required fields: ${missingFields.join(', ')}`,
          });
          result.failed++;
          continue;
        }

        // Validate city exists
        const cityKey = row.city.toLowerCase();
        const cityData = cityMap.get(cityKey);
        if (!cityData) {
          result.errors.push({
            row: rowNumber,
            field: 'city',
            message: `City "${row.city}" does not exist. Please add it in Admin > Areas first.`,
          });
          result.failed++;
          continue;
        }

        // Validate area exists for city
        const areaKey = `${cityKey}|${row.area.toLowerCase()}`;
        const areaData = areaMap.get(areaKey);
        if (!areaData) {
          result.errors.push({
            row: rowNumber,
            field: 'area',
            message: `Area "${row.area}" does not exist for city "${row.city}". Please add it in Admin > Areas first.`,
          });
          result.failed++;
          continue;
        }

        // Parse categories FIRST - handle quoted CSV values and multiple categories
        let categories: string[] = [];
        if (row.categories) {
          const categoriesStr = String(row.categories).trim();
          // Remove quotes if present (from CSV) - handle both single and double quotes
          const cleaned = categoriesStr.replace(/^["']+|["']+$/g, '');
          // Split by comma and clean each category
          categories = cleaned
            .split(',')
            .map(cat => cat.trim().toLowerCase().replace(/^["']+|["']+$/g, ''))
            .filter(Boolean);
          
          // Debug log for categories parsing
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Row ${rowNumber}] Categories - Original: "${categoriesStr}", Parsed:`, categories);
          }
        }

        if (categories.length === 0) {
          result.errors.push({
            row: rowNumber,
            field: 'categories',
            message: 'At least one category is required',
          });
          result.failed++;
          continue;
        }

        // Purpose is auto-generated from categories (not required in CSV)
        // Map categories to purpose and type (same as PropertyForm)
        const categoryPurposeMap: Record<string, { purpose: string; type: string }> = {
          'coworking': { purpose: 'COMMERCIAL', type: 'COWORKING' },
          'managed': { purpose: 'COMMERCIAL', type: 'MANAGED_OFFICE' },
          'dedicateddesk': { purpose: 'COMMERCIAL', type: 'COWORKING' },
          'flexidesk': { purpose: 'COMMERCIAL', type: 'COWORKING' },
          'virtualoffice': { purpose: 'COMMERCIAL', type: 'COWORKING' },
          'meetingroom': { purpose: 'COMMERCIAL', type: 'COMMERCIAL' },
          'daypass': { purpose: 'COMMERCIAL', type: 'COWORKING' },
          'popular': { purpose: 'COMMERCIAL', type: 'COWORKING' },
        };

        // Get purpose and type from first category (primary category)
        const primaryCategory = categories[0];
        const categoryInfo = categoryPurposeMap[primaryCategory];
        const purpose = categoryInfo?.purpose || 'COMMERCIAL';
        let type = categoryInfo?.type || 'COWORKING';

        // If type is provided in CSV, use it; otherwise derive from categories
        if (row.type && String(row.type).trim() !== '') {
          const validTypes = ['RESIDENTIAL', 'COMMERCIAL', 'COWORKING', 'MANAGED_OFFICE'];
          const csvType = String(row.type).toUpperCase().trim();
          if (validTypes.includes(csvType)) {
            type = csvType;
          }
        }

        // Combine workspace timings - handle empty strings and null values
        let workspaceTimingsValue: string | null = null;
        const monFri = String(row.monFriTime || '').trim();
        const saturday = String(row.saturdayTime || '').trim();
        const sunday = String(row.sundayTime || '').trim();
        
        // Debug log for workspace timings
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Row ${rowNumber}] Workspace Timings - Mon-Fri: "${monFri}", Sat: "${saturday}", Sun: "${sunday}"`);
        }
        
        if (monFri || saturday || sunday) {
          const parts: string[] = [];
          if (monFri) parts.push(`Mon-Fri: ${monFri}`);
          if (saturday) parts.push(`Sat: ${saturday}`);
          if (sunday) parts.push(`Sun: ${sunday}`);
          workspaceTimingsValue = parts.length > 0 ? parts.join(' | ') : null;
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Row ${rowNumber}] Combined Workspace Timings:`, workspaceTimingsValue);
          }
        }

        // Combine metro distances
        const metroParts = [
          (row.metroStationDistance || '').trim(),
          (row.metroStationDistance2 || '').trim(),
        ];
        const combinedMetro = metroParts
          .filter(Boolean)
          .join(' / ') || null;

        // Combine railway distances
        const railParts = [
          (row.railwayStationDistance || '').trim(),
          (row.railwayStationDistance2 || '').trim(),
        ];
        const combinedRail = railParts
          .filter(Boolean)
          .join(' / ') || null;

        // Parse property options - support both JSON and simplified format
        let propertyOptions: any = null;
        if (row.propertyOptions) {
          const optionsStr = String(row.propertyOptions).trim();
          if (optionsStr) {
            try {
              // Try JSON format first
              propertyOptions = JSON.parse(optionsStr);
              if (!Array.isArray(propertyOptions)) {
                propertyOptions = null;
              }
            } catch (e) {
              // If JSON fails, try simplified format: "Title|Description|Price|Seating"
              // Multiple plans separated by newline or semicolon
              try {
                const plans: any[] = [];
                // Split by newline or semicolon
                const planLines = optionsStr.split(/\n|;/).map(line => line.trim()).filter(Boolean);
                
                for (const line of planLines) {
                  const parts = line.split('|').map(p => p.trim());
                  if (parts.length >= 4) {
                    const [title, description, price, seating] = parts;
                    plans.push({
                      title: title || '',
                      description: description || '',
                      price: price || '',
                      seating: seating || '',
                    });
                  } else if (parts.length === 3) {
                    // Format: "Title|Price|Seating" (no description)
                    const [title, price, seating] = parts;
                    plans.push({
                      title: title || '',
                      description: '',
                      price: price || '',
                      seating: seating || '',
                    });
                  }
                }
                
                if (plans.length > 0) {
                  propertyOptions = plans;
                } else {
                  propertyOptions = null;
                }
              } catch (parseError) {
                // If simplified format also fails, skip
                propertyOptions = null;
              }
            }
          }
        }

        // Default amenities list (same as PropertyForm)
        const defaultAmenities = [
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

        // Parse amenities - support both JSON and simplified format
        // If no amenities provided, use all default amenities (same as "Select All" in form)
        let amenities: any = null;
        if (row.amenities) {
          const amenitiesStr = String(row.amenities).trim();
          if (amenitiesStr) {
            try {
              // Try JSON format first
              amenities = JSON.parse(amenitiesStr);
              if (!Array.isArray(amenities)) {
                amenities = null;
              }
            } catch (e) {
              // If JSON fails, try simplified format: "icon|name|category"
              // Multiple amenities separated by semicolon
              try {
                const amenityList: any[] = [];
                // Split by semicolon
                const amenityLines = amenitiesStr.split(';').map(line => line.trim()).filter(Boolean);
                
                for (const line of amenityLines) {
                  const parts = line.split('|').map(p => p.trim());
                  if (parts.length >= 3) {
                    const [icon, name, category] = parts;
                    amenityList.push({
                      icon: icon || '',
                      name: name || '',
                      category: category || 'free',
                    });
                  }
                }
                
                if (amenityList.length > 0) {
                  amenities = amenityList;
                } else {
                  amenities = null;
                }
              } catch (parseError) {
                // If simplified format also fails, skip
                amenities = null;
              }
            }
          }
        }
        
        // If no amenities provided or parsing failed, use all default amenities
        if (!amenities || amenities.length === 0) {
          amenities = defaultAmenities;
        }

        // Prepare property data - match the format from regular property creation exactly
        // Ensure all numeric fields are properly converted
        // All fields are optional, use defaults if not provided
        const priceValue = row.price ? (isNaN(Number(row.price)) ? 0 : parseInt(String(row.price), 10)) : 0;
        const sizeValue = row.size ? (isNaN(Number(row.size)) ? 0 : parseInt(String(row.size), 10)) : 0;
        const ratingValue = row.rating ? (isNaN(Number(row.rating)) ? 0 : parseFloat(String(row.rating))) : 0;
        const displayOrderValue = row.displayOrder ? (isNaN(Number(row.displayOrder)) ? 0 : parseInt(String(row.displayOrder), 10)) : 0;
        const capacityValue = row.capacity && !isNaN(Number(row.capacity)) ? parseInt(String(row.capacity), 10) : null;
        const superAreaValue = row.superArea && !isNaN(Number(row.superArea)) ? parseInt(String(row.superArea), 10) : null;

        const propertyData: any = {
          title: String(row.title || '').trim(),
          city: String(row.city || '').trim(),
          area: String(row.area || '').trim(),
          sublocation: row.sublocation ? String(row.sublocation).trim() : null,
          purpose: purpose as any,
          type: type as any,
          displayOrder: displayOrderValue,
          categories: categories,
          priceDisplay: row.priceDisplay ? String(row.priceDisplay).trim() : '',
          price: priceValue,
          size: sizeValue,
          beds: row.beds ? String(row.beds).trim() : '',
          rating: ratingValue,
          image: '', // Empty - will be added later via edit
          tag: row.tag ? String(row.tag).trim() : null,
          description: row.description ? String(row.description).trim() : null,
          userId: dbUser.id,
          workspaceName: row.workspaceName ? String(row.workspaceName).trim() : null,
          workspaceTimings: workspaceTimingsValue,
          workspaceClosedDays: row.workspaceClosedDays ? String(row.workspaceClosedDays).trim() : null,
          amenities: amenities,
          locationDetails: row.locationDetails ? String(row.locationDetails).trim() : null,
          metroStationDistance: combinedMetro,
          railwayStationDistance: combinedRail,
          googleMapLink: (() => {
            // Try multiple possible key names for googleMapLink (case-insensitive, with/without spaces)
            let mapLink = '';
            
            // Check direct key
            if (row.googleMapLink) {
              mapLink = String(row.googleMapLink).trim();
            } else {
              // Try case-insensitive lookup (handle spaces, different cases)
              const possibleKeys = Object.keys(row).filter(key => {
                const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
                return normalizedKey === 'googlemaplink' || normalizedKey === 'googlemap' || normalizedKey === 'maplink';
              });
              if (possibleKeys.length > 0) {
                mapLink = String(row[possibleKeys[0]]).trim();
              }
            }
            
            // Debug log for google map link
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Row ${rowNumber}] Google Map Link - Raw value:`, row.googleMapLink);
              console.log(`[Row ${rowNumber}] Google Map Link - Processed:`, mapLink);
              console.log(`[Row ${rowNumber}] All row keys:`, Object.keys(row));
            }
            
            // Truncate to 191 characters (database limit) but only if not empty
            if (mapLink && mapLink.length > 0) {
              return mapLink.length > 191 ? mapLink.slice(0, 191) : mapLink;
            }
            return null;
          })(),
          propertyTier: row.propertyTier ? String(row.propertyTier).trim() : null,
          aboutWorkspace: row.aboutWorkspace ? String(row.aboutWorkspace).trim() : null,
          capacity: capacityValue,
          superArea: superAreaValue,
          propertyOptions: propertyOptions,
          officeTiming: null,
        };

        // Debug: Log final property data before saving
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Row ${rowNumber}] Final Property Data:`, JSON.stringify(propertyData, null, 2));
        }

        // Create property - use same structure as regular property creation
        const property = await prisma.property.create({
          data: propertyData,
        });

        result.createdProperties.push({
          id: property.id,
          title: property.title,
        });
        result.successful++;

      } catch (error: any) {
        // Better error handling with more details
        let errorMessage = error.message || 'Unknown error occurred';
        
        // Check for Prisma validation errors
        if (error.code === 'P2002') {
          errorMessage = `Duplicate entry: ${error.meta?.target || 'unique constraint violation'}`;
        } else if (error.code === 'P2003') {
          errorMessage = `Foreign key constraint failed: ${error.meta?.field_name || 'related record not found'}`;
        } else if (error.message?.includes('Argument') || error.message?.includes('missing')) {
          errorMessage = `Invalid data structure: ${error.message}. Please check that all columns match the template.`;
        }
        
        result.errors.push({
          row: rowNumber,
          message: errorMessage,
        });
        result.failed++;
        console.error(`Bulk upload error for row ${rowNumber}:`, error);
      }
    }

    result.success = result.failed === 0;

    return NextResponse.json(result, {
      status: result.success ? 200 : 207, // 207 Multi-Status for partial success
    });

  } catch (error: any) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process bulk upload',
        details: error.message,
      },
      { status: 500 }
    );
  }
});

