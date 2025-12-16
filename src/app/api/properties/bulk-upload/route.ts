import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

interface ExcelRow {
  coworkingname: string;
  buildingname: string;
  city: string;
  area: string;
  sublocation?: string;
  propertyTier?: string;
  categories: string;
  image?: string; // Optional - user will add images separately
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
  // Individual seating plan price columns
  'dedicated-desk'?: string;
  'flexi-desk'?: string;
  'private-cabin'?: string;
  'managed-office-space'?: string;
  'virtual-office'?: string;
  'day-pass'?: string;
  // Backward compatibility - old format
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

// Predefined seating plans with fixed descriptions and seating values
// These match the preloaded values in PropertyForm.tsx
const SEATING_PLANS_MAP: Record<string, { title: string; description: string; seating: string }> = {
  'dedicated-desk': {
    title: 'Dedicated Desk',
    description: 'Get your Dedicated desk, with access to all amenities and services, in shared area.',
    seating: '1-30+'
  },
  'flexi-desk': {
    title: 'Flexi Desk',
    description: 'Just show up, pick your spot, get connected and get working – no fuss, no hassle!',
    seating: '1-30+'
  },
  'private-cabin': {
    title: 'Private Cabin',
    description: 'Private Cabin\n.Enclosed & Secure: A fully private, lockable room for confidentiality and asset security. \n.Available in various sizes—ranging from 2, 4, 8, to 10+ seater options—making them a perfect fit for businesses of all sizes, \n\nwith customization available to align with a company\'s specific needs and brand ethos.\n.Amenities: Access to communal areas, high-speed internet, printing, meeting rooms, pantry, tea and coffee and reception services.',
    seating: ''
  },
  'virtual-office': {
    title: 'Virtual Office',
    description: 'Don\'t have a physical office, don\'t worry! Get your business registered pan India with our virtual office solutions.',
    seating: ''
  },
  'meeting-room': {
    title: 'Meeting Room',
    description: 'Perfect for Meetings, Team huddles, and Presentations – Pick Your Room, Book it, & Impress! Meeting Rooms Come Equip With Monitor/TV, Whiteboard, WIFI, and Unlimited Tea and Coffee.',
    seating: ''
  },
  'managed-office-space': {
    title: 'Managed Office Space',
    description: 'A) Provider offer customized office setups according to company\'s specific needs and brand ethos. \nB) The provider manages day-to-day operations, including maintenance, IT support, and cleaning.\nC) Businesses of all sizes: From startups and SMEs to large enterprises and MNCs, companies use managed spaces for their flexibility and convenience. \nTo know more about managed office space, reach out to us, and let\'s discuss how our managed office solutions can cater to your specific business needs.',
    seating: '40-100+'
  },
  'day-pass': {
    title: 'Day Pass',
    description: 'Just show up, pick your spot, get connected and get working – no fuss, no hassle!',
    seating: '1-30+'
  }
};

// Helper function to get relevant seating plans based on categories
function getRelevantSeatingPlansFromCategories(categories: string[]): string[] {
  const relevantPlans: string[] = [];
  const normalizedCategories = categories.map(cat => cat.toLowerCase().trim());
  
  // Map categories to seating plans
  if (normalizedCategories.includes('coworking') || normalizedCategories.includes('coworkingspace')) {
    relevantPlans.push('dedicated-desk', 'flexi-desk', 'private-cabin', 'virtual-office');
  }
  if (normalizedCategories.includes('dedicateddesk') || normalizedCategories.includes('dedicated-desk')) {
    relevantPlans.push('dedicated-desk');
  }
  if (normalizedCategories.includes('flexidesk') || normalizedCategories.includes('flexi-desk')) {
    relevantPlans.push('flexi-desk');
  }
  if (normalizedCategories.includes('privatecabin') || normalizedCategories.includes('private-cabin')) {
    relevantPlans.push('private-cabin');
  }
  if (normalizedCategories.includes('virtualoffice') || normalizedCategories.includes('virtual-office')) {
    relevantPlans.push('virtual-office');
  }
  if (normalizedCategories.includes('meetingroom') || normalizedCategories.includes('meeting-room')) {
    relevantPlans.push('meeting-room');
  }
  if (normalizedCategories.includes('managed') || normalizedCategories.includes('managedoffice') || normalizedCategories.includes('managed-office')) {
    relevantPlans.push('managed-office-space');
  }
  if (normalizedCategories.includes('daypass') || normalizedCategories.includes('day-pass')) {
    relevantPlans.push('day-pass');
  }
  
  // Remove duplicates
  return Array.from(new Set(relevantPlans));
}

// Helper function to parse seating plans from individual columns or old format
function parseSeatingPlansFromColumns(row: ExcelRow, categories: string[] = []): any[] {
  const plans: any[] = [];
  const seatingPlanIds = ['dedicated-desk', 'flexi-desk', 'private-cabin', 'managed-office-space', 'virtual-office', 'day-pass', 'meeting-room'];
  
  // Get relevant seating plans based on categories
  const relevantPlansFromCategories = getRelevantSeatingPlansFromCategories(categories);
  
  // Check each seating plan column for prices OR if it's relevant based on categories
  for (const planId of seatingPlanIds) {
    const price = (row as any)[planId];
    const hasPrice = price && price.toString().trim();
    const isRelevant = relevantPlansFromCategories.includes(planId);
    
    // Add plan if it has a price OR if it's relevant based on categories
    if (hasPrice || isRelevant) {
      const planInfo = SEATING_PLANS_MAP[planId];
      if (planInfo) {
        // Special handling for Meeting Room - it uses seatingPrices instead of single price
        if (planId === 'meeting-room') {
          plans.push({
            id: planId,
            title: planInfo.title,
            description: planInfo.description,
            price: '', // Meeting Room doesn't have a general price
            seating: planInfo.seating,
            seatingPrices: {}, // Will be populated if needed
            isSelected: true
          });
        } else {
          plans.push({
            id: planId,
            title: planInfo.title,
            description: planInfo.description,
            price: hasPrice ? price.toString().trim() : '', // Use price if available, else empty
            seating: planInfo.seating,
            isSelected: true
          });
        }
      }
    }
  }
  
  return plans;
}

// Helper function to parse seating plans
// Priority: 1. Individual columns, 2. Simplified format "id1:price1,id2:price2", 3. JSON format (backward compatible)
function parseSeatingPlans(row: ExcelRow, seatingPlansStr: string | undefined, categories: string[] = []): any[] {
  // First, try individual columns (new format) - this will also auto-add relevant plans based on categories
  const columnPlans = parseSeatingPlansFromColumns(row, categories);
  if (columnPlans.length > 0) {
    return columnPlans;
  }
  
  // If no individual columns, try old string format
  if (!seatingPlansStr) return [];
  
  // Try new simplified format: "dedicated-desk:11999,flexi-desk:8999"
  if (seatingPlansStr.includes(':') && !seatingPlansStr.trim().startsWith('[')) {
    const plans: any[] = [];
    const pairs = seatingPlansStr.split(',').map(s => s.trim()).filter(Boolean);
    
    for (const pair of pairs) {
      const [id, price] = pair.split(':').map(s => s.trim());
      if (id && price && SEATING_PLANS_MAP[id]) {
        const planInfo = SEATING_PLANS_MAP[id];
        plans.push({
          id: id,
          title: planInfo.title,
          description: planInfo.description,
          price: price,
          seating: planInfo.seating,
          isSelected: true
        });
      }
    }
    
    if (plans.length > 0) return plans;
  }
  
  // Fallback to JSON format (backward compatible)
  try {
    const parsed = JSON.parse(seatingPlansStr);
    if (Array.isArray(parsed)) {
      // If JSON format, ensure all plans have required fields from mapping
      return parsed.map((plan: any) => {
        if (plan.id && SEATING_PLANS_MAP[plan.id]) {
          const planInfo = SEATING_PLANS_MAP[plan.id];
          return {
            id: plan.id,
            title: planInfo.title,
            description: plan.description || planInfo.description,
            price: plan.price || '',
            seating: plan.seating || planInfo.seating,
            isSelected: plan.isSelected !== undefined ? plan.isSelected : true
          };
        }
        return plan;
      });
    }
    return [];
  } catch {
    return [];
  }
}

// Helper function to validate required fields
function validateProperty(row: ExcelRow, rowIndex: number): string[] {
  const errors: string[] = [];
  
  if (!row.coworkingname?.trim()) {
    errors.push(`Row ${rowIndex + 2}: Coworking Name is required`);
  }
  
  if (!row.buildingname?.trim()) {
    errors.push(`Row ${rowIndex + 2}: Building Name is required`);
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

// Helper function to check for duplicate titles within batch
function checkDuplicateTitlesInBatch(data: ExcelRow[]): string[] {
  const errors: string[] = [];
  const titleMap = new Map<string, number[]>();
  
  // Generate titles and track their row indices
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row.coworkingname?.trim() && row.buildingname?.trim()) {
      const title = `${row.coworkingname.trim()} - ${row.buildingname.trim()}`;
      
      if (!titleMap.has(title)) {
        titleMap.set(title, []);
      }
      titleMap.get(title)!.push(i + 2); // +2 because Excel rows are 1-indexed and we have header
    }
  }
  
  // Check for duplicates
  titleMap.forEach((rowIndices, title) => {
    if (rowIndices.length > 1) {
      errors.push(`Duplicate property title "${title}" found in rows: ${rowIndices.join(', ')}. Each property must have a unique title.`);
    }
  });
  
  return errors;
}

// Helper function to check for existing properties with same title in database
async function checkExistingProperties(data: ExcelRow[]): Promise<string[]> {
  const errors: string[] = [];
  const titles: string[] = [];
  
  // Generate all titles from the batch
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (row.coworkingname?.trim() && row.buildingname?.trim()) {
      const title = `${row.coworkingname.trim()} - ${row.buildingname.trim()}`;
      titles.push(title);
    }
  }
  
  if (titles.length === 0) {
    return errors;
  }
  
  try {
    // Check if any of these titles already exist in database
    const existingProperties = await prisma.property.findMany({
      where: {
        title: {
          in: titles
        }
      },
      select: {
        title: true
      }
    });
    
    if (existingProperties.length > 0) {
      const existingTitles = existingProperties.map(p => p.title);
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (row.coworkingname?.trim() && row.buildingname?.trim()) {
          const title = `${row.coworkingname.trim()} - ${row.buildingname.trim()}`;
          if (existingTitles.includes(title)) {
            errors.push(`Row ${i + 2}: Property with title "${title}" already exists in database. Each property must have a unique title.`);
          }
        }
      }
    }
  } catch (error) {
    errors.push(`Error checking existing properties: ${error}`);
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
  const seatingPlans = parseSeatingPlans(row, row.seatingPlans, categories);
  
  // Combine coworkingname and buildingname to create title
  const title = `${row.coworkingname.trim()} - ${row.buildingname.trim()}`;
  
  return {
    title: title,
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
    image: row.image?.trim() || '', // Optional - user will add images separately
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

    // Check for duplicate titles within the batch
    const duplicateBatchErrors = checkDuplicateTitlesInBatch(data);
    validationErrors.push(...duplicateBatchErrors);

    // Check for existing properties with same titles in database
    const existingPropertyErrors = await checkExistingProperties(data);
    validationErrors.push(...existingPropertyErrors);

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
        
        // Final safety check: Verify property doesn't already exist (prevent race conditions)
        const existingProperty = await prisma.property.findFirst({
          where: {
            title: processedProperty.title
          }
        });
        
        if (existingProperty) {
          results.failed++;
          const errorMsg = `Row ${i + 2}: Property with title "${processedProperty.title}" already exists in database. Skipping duplicate.`;
          results.errors.push(errorMsg);
          console.log(`[Row ${i + 1}] ⚠️ Skipped (duplicate): ${processedProperty.title}`);
          continue;
        }
        
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
