import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

interface ExcelRow {
  title: string;
  city: string;
  area: string;
  sublocation?: string;
  propertyTier?: string;
  categories: string;
  image: string;
  locationDetails: string;
  metroStationDistance?: string;
  metroStationDistance2?: string;
  railwayStationDistance?: string;
  railwayStationDistance2?: string;
  googleMapLink?: string;
  aboutWorkspace?: string;
  monFriTime?: string;
  saturdayTime?: string;
  sundayTime?: string;
  amenities?: string;
  seatingPlans?: string;
}

interface ProcessedProperty {
  title: string;
  city: string;
  area: string;
  sublocation?: string;
  purpose: string;
  type: string;
  displayOrder: number;
  categories: string[];
  priceDisplay: string;
  price: number;
  size: number;
  beds: string;
  rating: number;
  image: string;
  tag?: string;
  description?: string;
  workspaceName?: string;
  workspaceTimings?: string;
  workspaceClosedDays?: string;
  amenities?: any[];
  locationDetails?: string;
  metroStationDistance?: string;
  railwayStationDistance?: string;
  googleMapLink?: string;
  propertyTier?: string;
  aboutWorkspace?: string;
  capacity?: number;
  superArea?: number;
  propertyOptions?: any[];
  userId: string;
}

// Helper function to auto-generate purpose from categories
function generatePurpose(categories: string[]): string {
  // All workspace types are COMMERCIAL
  return 'COMMERCIAL';
}

// Helper function to auto-generate type from categories
function generateType(categories: string[]): string {
  const firstCategory = categories[0]?.toLowerCase();
  
  if (firstCategory === 'coworking' || firstCategory === 'dedicateddesk' || firstCategory === 'flexidesk') {
    return 'COWORKING';
  } else if (firstCategory === 'managed' || firstCategory === 'enterpriseoffices') {
    return 'MANAGED_OFFICE';
  } else {
    return 'COWORKING'; // Default
  }
}

// Helper function to combine workspace timings
function generateWorkspaceTimings(monFri?: string, saturday?: string, sunday?: string): string {
  if (!monFri && !saturday && !sunday) return '';
  
  const parts = [];
  if (monFri) parts.push(`Mon-Fri: ${monFri}`);
  if (saturday) parts.push(`Sat: ${saturday}`);
  if (sunday) parts.push(`Sun: ${sunday}`);
  
  return parts.join(' | ');
}

// Helper function to combine metro/railway distances
function combineDistances(distance1?: string, distance2?: string): string {
  if (!distance1 && !distance2) return '';
  if (!distance1) return distance2 || '';
  if (!distance2) return distance1;
  return `${distance1} / ${distance2}`;
}

// Default amenities (all selected)
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

// Helper function to parse amenities
function parseAmenities(amenitiesStr?: string): any[] {
  if (!amenitiesStr) {
    // If no amenities provided, return all default amenities (all selected)
    return defaultAmenities;
  }
  
  try {
    // Try to parse as JSON first
    return JSON.parse(amenitiesStr);
  } catch {
    // If not valid JSON, return all default amenities
    return defaultAmenities;
  }
}

// Helper function to parse seating plans
function parseSeatingPlans(seatingPlansStr?: string): any[] {
  if (!seatingPlansStr) return [];
  
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(seatingPlansStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If not JSON, return empty array
    return [];
  }
}

// Helper function to validate required fields
function validateProperty(row: ExcelRow, rowIndex: number): string[] {
  const errors: string[] = [];
  
  if (!row.title?.trim()) {
    errors.push(`Row ${rowIndex + 2}: Title is required`);
  }
  
  if (!row.city?.trim()) {
    errors.push(`Row ${rowIndex + 2}: City is required`);
  }
  
  if (!row.area?.trim()) {
    errors.push(`Row ${rowIndex + 2}: Area is required`);
  }
  
  if (!row.categories?.trim()) {
    errors.push(`Row ${rowIndex + 2}: Categories is required`);
  }
  
  if (!row.image?.trim()) {
    errors.push(`Row ${rowIndex + 2}: Image URL is required`);
  }
  
  if (!row.locationDetails?.trim()) {
    errors.push(`Row ${rowIndex + 2}: Address Details is required`);
  }
  
  return errors;
}

// Helper function to check if city and area exist
async function validateCityArea(city: string, area: string, rowIndex: number): Promise<string[]> {
  const errors: string[] = [];
  
  try {
    // Check if city exists
    const cityRecord = await prisma.city.findFirst({
      where: { name: city }
    });
    
    if (!cityRecord) {
      errors.push(`Row ${rowIndex + 2}: City "${city}" does not exist in database`);
      return errors; // No point checking area if city doesn't exist
    }
    
    // Check if area exists for this city
    const areaRecord = await prisma.area.findFirst({
      where: { 
        name: area,
        cityId: cityRecord.id
      }
    });
    
    if (!areaRecord) {
      errors.push(`Row ${rowIndex + 2}: Area "${area}" does not exist for city "${city}"`);
    }
  } catch (error) {
    errors.push(`Row ${rowIndex + 2}: Error validating city/area - ${error}`);
  }
  
  return errors;
}

// Process Excel row to database format
function processRow(row: ExcelRow, userId: string): ProcessedProperty {
  // Parse categories
  const categories = row.categories
    .split(',')
    .map(cat => cat.trim().toLowerCase())
    .filter(Boolean);
  
  // Auto-generate fields
  const purpose = generatePurpose(categories);
  const type = generateType(categories);
  const workspaceTimings = generateWorkspaceTimings(row.monFriTime, row.saturdayTime, row.sundayTime);
  
  // Combine distances
  const metroDistance = combineDistances(row.metroStationDistance, row.metroStationDistance2);
  const railwayDistance = combineDistances(row.railwayStationDistance, row.railwayStationDistance2);
  
  // Parse complex fields
  const amenities = parseAmenities(row.amenities);
  const seatingPlans = parseSeatingPlans(row.seatingPlans);
  
  return {
    title: row.title.trim(),
    city: row.city.trim(),
    area: row.area.trim(),
    sublocation: row.sublocation?.trim() || null,
    purpose: purpose as any,
    type: type as any,
    displayOrder: 0,
    categories,
    priceDisplay: '', // Default empty
    price: 0, // Default 0
    size: 0, // Default 0
    beds: '', // Default empty
    rating: 0, // Default 0
    image: row.image.trim(),
    tag: '', // Default empty
    description: '', // Default empty
    workspaceName: null, // Not in form
    workspaceTimings: workspaceTimings || null,
    workspaceClosedDays: null, // Not in form
    amenities: amenities, // Will always have default amenities if none provided
    locationDetails: row.locationDetails?.trim() || null,
    metroStationDistance: metroDistance || null,
    railwayStationDistance: railwayDistance || null,
    googleMapLink: row.googleMapLink?.trim() || null,
    propertyTier: row.propertyTier?.trim() || null,
    aboutWorkspace: row.aboutWorkspace?.trim() || null,
    capacity: null, // Not in form
    superArea: null, // Not in form
    propertyOptions: seatingPlans.length > 0 ? seatingPlans : null,
    userId
  };
}

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    // Parse request body
    const { data } = await request.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
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

    console.log(`[Bulk Upload] Processing ${data.length} rows for user ${dbUser.email}`);

    // Validate all rows first
    const validationErrors: string[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as ExcelRow;
      
      // Basic field validation
      const fieldErrors = validateProperty(row, i);
      validationErrors.push(...fieldErrors);
      
      // City/Area validation (only if basic fields are valid)
      if (fieldErrors.length === 0 && row.city && row.area) {
        const cityAreaErrors = await validateCityArea(row.city.trim(), row.area.trim(), i);
        validationErrors.push(...cityAreaErrors);
      }
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Process and create properties
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i] as ExcelRow;
        const processedProperty = processRow(row, dbUser.id);
        
        console.log(`[Row ${i + 1}] Processing: ${processedProperty.title}`);
        
        // Create property in database
        await prisma.property.create({
          data: processedProperty as any
        });
        
        results.success++;
        console.log(`[Row ${i + 1}] ✅ Success: ${processedProperty.title}`);
        
      } catch (error: any) {
        results.failed++;
        const errorMsg = `Row ${i + 2}: ${error.message || 'Unknown error'}`;
        results.errors.push(errorMsg);
        console.error(`[Row ${i + 1}] ❌ Error:`, error);
      }
    }

    console.log(`[Bulk Upload] Complete - Success: ${results.success}, Failed: ${results.failed}`);

    return NextResponse.json({
      message: `Bulk upload completed. ${results.success} properties created successfully.`,
      results
    });

  } catch (error: any) {
    console.error('[Bulk Upload] Server Error:', error);
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 });
  }
});
