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
      coworking: ['coworking', 'dedicateddesk', 'flexidesk', 'virtualoffice'],
      managed: ['managed', 'enterpriseoffices'],
      dedicateddesk: ['dedicateddesk'],
      flexidesk: ['flexidesk'],
      virtualoffice: ['virtualoffice'],
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
        virtualoffice: 'virtualoffice',
        virtualoffices: 'virtualoffice',
        meetingroom: 'meetingroom',
        meetingrooms: 'meetingroom',
        enterpriseoffice: 'enterpriseoffices',
        enterpriseoffices: 'enterpriseoffices',
      };
      return mapping[cleaned] ?? value.toLowerCase();
    };

    const category = normalizeCategoryKey(categoryParam);

    if (city && city !== 'all') {
      where.city = city;
    }

    if (area && area !== 'all') {
      where.area = area;
    }

    if (purpose) {
      where.purpose = purpose.toUpperCase();
    }

    // Category filtering - Map frontend category names to database property types
    if (category) {
      const categoryTypeMap: Record<string, string[]> = {
        coworking: ['COWORKING'],
        managed: ['MANAGED_OFFICE'],
        dedicateddesk: ['COWORKING'],
        flexidesk: ['COWORKING'],
        virtualoffice: ['COWORKING'],
        meetingroom: ['COMMERCIAL'],
        enterpriseoffices: ['MANAGED_OFFICE'],
      };

      const relatedCategoryKeys = categoryKeyMap[category] || [category];
      const types = categoryTypeMap[category];

      const categoryFilters: Record<string, unknown>[] = relatedCategoryKeys.map((key) => ({
        categories: { array_contains: [key] },
      }));

      if (types) {
        categoryFilters.push({ type: { in: types } });
      }

      where.AND = [...(where.AND || []), { OR: categoryFilters }];
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
        { area: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const properties = await prisma.property.findMany({
      where,
      include: {
        propertyImages: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

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