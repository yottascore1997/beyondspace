import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const area = searchParams.get('area');
    const purpose = searchParams.get('purpose');
    const search = searchParams.get('search');
    const categoryParam = searchParams.get('category');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
    };

    const categoryKeyMap: Record<string, string[]> = {
      // Co-working: Private Cabin, Dedicated Desk, Flexi Desk, Virtual Office
      coworking: ['privatecabin', 'dedicateddesk', 'flexidesk', 'virtualoffice'],
      // Managed Office Space: Only Managed Office Space
      managed: ['managed'],
      // Dedicated Desk: Only Dedicated Desk
      dedicateddesk: ['dedicateddesk'],
      // Private Cabin: Only Private Cabin
      privatecabin: ['privatecabin'],
      // Flexi Desk: Flexi Desk / Dedicated Desk
      flexidesk: ['flexidesk', 'dedicateddesk'],
      // Day Pass: Day Pass and Flexi Desk
      daypass: ['daypass', 'flexidesk'],
      // Virtual Office: Only Virtual Office
      virtualoffice: ['virtualoffice'],
      // Meeting Rooms: Only Meeting Rooms
      meetingroom: ['meetingroom'],
      enterpriseoffices: ['enterpriseoffices'],
    };

    const normalizeCategoryKey = (value: string | null) => {
      if (!value || value === 'all') return null;
      const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      const mapping: Record<string, string> = {
        coworkingspace: 'coworking',
        coworkingspaces: 'coworking',
        managedoffice: 'managed',
        managedoffices: 'managed',
        dedicateddesk: 'dedicateddesk',
        dedicateddesks: 'dedicateddesk',
        flexidesk: 'flexidesk',
        flexidesks: 'flexidesk',
        daypass: 'daypass',
        daypasses: 'daypass',
        virtualoffice: 'virtualoffice',
        virtualoffices: 'virtualoffice',
        meetingroom: 'meetingroom',
        meetingrooms: 'meetingroom',
        privatecabin: 'privatecabin',
        privatecabins: 'privatecabin',
        enterpriseoffice: 'enterpriseoffices',
        enterpriseoffices: 'enterpriseoffices',
      };
      return mapping[cleaned] ?? value.toLowerCase();
    };

    const category = normalizeCategoryKey(categoryParam);

    const normalizeToken = (val: unknown) =>
      String(val ?? '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '');

    if (city && city !== 'all') {
      where.city = city;
    }

    if (area && area !== 'all') {
      where.area = area;
    }

    if (purpose) {
      where.purpose = purpose.toUpperCase();
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
        { area: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch properties first (category filtering will be done in JavaScript)
    let properties = await prisma.property.findMany({
      where,
      include: {
        propertyImages: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    // Category filtering - Filter based on categories array to support multiple categories
    if (category) {
      const categoryTypeMap: Record<string, string[]> = {
        // Co-working, Dedicated Desk, Flexi Desk all check for COWORKING type
        coworking: ['COWORKING'],
        dedicateddesk: ['COWORKING'],
        flexidesk: ['COWORKING'],
        // Day Pass checks for COWORKING type (but only shows daypass category)
        daypass: ['COWORKING'],
        // Managed Office Space checks for MANAGED_OFFICE type
        managed: ['MANAGED_OFFICE'],
        // Virtual Office checks for COWORKING type (but only shows virtualoffice category)
        virtualoffice: ['COWORKING'],
        // Meeting Rooms checks for COMMERCIAL type
        meetingroom: ['COMMERCIAL'],
        enterpriseoffices: ['MANAGED_OFFICE'],
      };

      const relatedCategoryKeys = categoryKeyMap[category] || [category];
      const types = categoryTypeMap[category];

      properties = properties.filter(property => {
        // Check if property categories array contains any of the related category keys
        const propertyCategories = Array.isArray(property.categories)
          ? property.categories.map((cat: string) => normalizeToken(cat))
          : [];

        // Check if any of the related category keys exist in property's categories array (exact match only)
        const hasCategoryMatch = relatedCategoryKeys.some(key => {
          const normalizedKey = normalizeToken(key);
          // Exact match on normalized tokens (handles day-pass vs daypass, flexi-desk vs flexidesk, etc.)
          return propertyCategories.some(cat => cat === normalizedKey);
        });

        // For Managed Office Space, only show if it has 'managed' category (strict filtering)
        if (category === 'managed') {
          // Double check: must have exact 'managed' category, not partial matches like "year", "seat", "day"
          const hasExactManaged = propertyCategories.some(cat => cat === 'managed');
          return hasExactManaged && hasCategoryMatch; // Don't use type fallback for managed category
        }

        // For Dedicated Desk, only show if it has 'dedicateddesk' or 'privatecabin' category (strict filtering)
        if (category === 'dedicateddesk') {
          return hasCategoryMatch; // Don't use type fallback for dedicated category
        }

        // For Private Cabin, only show if it has 'privatecabin' category (strict filtering)
        if (category === 'privatecabin') {
          return hasCategoryMatch; // Don't use type fallback for private cabin category
        }

        // For Virtual Office, only show if it has 'virtualoffice' category (strict filtering)
        if (category === 'virtualoffice') {
          return hasCategoryMatch; // Don't use type fallback for virtual office category
        }

        // For Meeting Room, only show if it has 'meetingroom' category (strict filtering)
        if (category === 'meetingroom') {
          return hasCategoryMatch; // Don't use type fallback for meeting room category
        }

        // For Day Pass, only show if it has 'daypass' or 'flexidesk' category (strict filtering)
        if (category === 'daypass') {
          return hasCategoryMatch; // Don't use type fallback for day pass category
        }

        // Also check property type as fallback for other categories
        const hasTypeMatch = types ? types.includes(property.type) : false;

        return hasCategoryMatch || hasTypeMatch;
      });
    }

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const data = await request.json();
    console.log('Received property data:', JSON.stringify(data, null, 2));

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

    // Extract images array and remove it from property data
    const { images, ...propertyData } = data;

    // Handle workspace timings - combine monFriTime, saturdayTime, sundayTime if present
    let workspaceTimingsValue = propertyData.workspaceTimings || null;
    if (propertyData.monFriTime || propertyData.saturdayTime || propertyData.sundayTime) {
      const parts: string[] = [];
      if (propertyData.monFriTime) parts.push(`Mon-Fri: ${propertyData.monFriTime}`);
      if (propertyData.saturdayTime) parts.push(`Sat: ${propertyData.saturdayTime}`);
      if (propertyData.sundayTime) parts.push(`Sun: ${propertyData.sundayTime}`);
      workspaceTimingsValue = parts.join(' | ') || null;
    }

    // Convert lowercase enum values to uppercase and handle data types
    const { 
      monFriTime, 
      saturdayTime, 
      sundayTime, 
      metroStationDistance2, 
      railwayStationDistance2,
      ...restPropertyData 
    } = propertyData;
    
    // Explicitly construct finalPropertyData with only valid Prisma fields
    const finalPropertyData: any = {
      title: restPropertyData.title,
      city: restPropertyData.city,
      area: restPropertyData.area,
      sublocation: restPropertyData.sublocation || null,
      purpose: restPropertyData.purpose?.toUpperCase(),
      type: restPropertyData.type?.toUpperCase(),
      displayOrder: restPropertyData.displayOrder || 0,
      categories: Array.isArray(restPropertyData.categories)
        ? restPropertyData.categories.map((category: string) => category.toLowerCase())
        : [],
      userId: dbUser.id,
      // Convert string numbers to integers
      price: parseInt(restPropertyData.price) || 0,
      size: parseInt(restPropertyData.size) || 0,
      beds: restPropertyData.beds || '',
      rating: parseFloat(restPropertyData.rating) || 0,
      image: restPropertyData.image || '',
      tag: restPropertyData.tag || '',
      description: restPropertyData.description || '',
      priceDisplay: restPropertyData.priceDisplay || '',
      // Handle coworking specific fields
      workspaceName: restPropertyData.workspaceName || null,
      workspaceTimings: workspaceTimingsValue,
      workspaceClosedDays: restPropertyData.workspaceClosedDays || null,
      amenities: restPropertyData.amenities && Array.isArray(restPropertyData.amenities) ? restPropertyData.amenities : null,
      locationDetails: restPropertyData.locationDetails || null,
      metroStationDistance: restPropertyData.metroStationDistance || null,
      railwayStationDistance: restPropertyData.railwayStationDistance || null,
      // Truncate googleMapLink to fit VARCHAR(191) default in MySQL
      googleMapLink: restPropertyData.googleMapLink
        ? String(restPropertyData.googleMapLink).slice(0, 191)
        : null,
      propertyTier: restPropertyData.propertyTier || null,
      aboutWorkspace: restPropertyData.aboutWorkspace || null,
      capacity: restPropertyData.capacity ? parseInt(restPropertyData.capacity) : null,
      superArea: restPropertyData.superArea ? parseInt(restPropertyData.superArea) : null,
      // Handle property options
      propertyOptions: restPropertyData.propertyOptions && Array.isArray(restPropertyData.propertyOptions) ? restPropertyData.propertyOptions : null,
      // Handle office timing
      officeTiming: restPropertyData.officeTiming && typeof restPropertyData.officeTiming === 'object' ? restPropertyData.officeTiming : null,
    };

    // Create property with images in a transaction
    const property = await prisma.$transaction(async (tx) => {
      // Create the property
      const newProperty = await tx.property.create({
        data: finalPropertyData,
      });

      // Create property images if any
      if (images && images.length > 0) {
        await tx.propertyImage.createMany({
          data: images.map((imageUrl: string) => ({
            imageUrl,
            propertyId: newProperty.id,
          })),
        });
      }

      // Return property with images
      return await tx.property.findUnique({
        where: { id: newProperty.id },
        include: {
          propertyImages: true,
        },
      });
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
});