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
    const category = searchParams.get('category');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isActive: true,
    };

    if (city && city !== 'all') {
      where.city = city;
    }

    if (area && area !== 'all') {
      where.area = area;
    }

    if (purpose) {
      where.purpose = purpose.toUpperCase();
    }

    // Category filtering
    if (category && category !== 'all') {
      const categoryTypeMap: Record<string, string[]> = {
        'coworking': ['coworking'],
        'managed': ['managed office', 'office'],
        'virtualoffice': ['virtual office'],
        'meetingroom': ['meeting room'],
        'dedicateddesk': ['dedicated desk'],
        'flexidesk': ['flexi desk'],
        'enterpriseoffices': ['enterprise office']
      };

      const types = categoryTypeMap[category];
      if (types) {
        where.type = {
          in: types.map(type => type.toUpperCase())
        };
      }
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
      orderBy: { createdAt: 'desc' },
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

    // Extract images array and remove it from property data
    const { images, ...propertyData } = data;

    // Convert lowercase enum values to uppercase and handle data types
    const finalPropertyData = {
      ...propertyData,
      purpose: propertyData.purpose?.toUpperCase(),
      type: propertyData.type?.toUpperCase(),
      userId: user.id,
      // Convert string numbers to integers
      price: parseInt(propertyData.price) || 0,
      size: parseInt(propertyData.size) || 0,
      rating: parseFloat(propertyData.rating) || 0,
      // Handle coworking specific fields
      workspaceName: propertyData.workspaceName || null,
      workspaceTimings: propertyData.workspaceTimings || null,
      workspaceClosedDays: propertyData.workspaceClosedDays || null,
      amenities: propertyData.amenities && Array.isArray(propertyData.amenities) ? propertyData.amenities : null,
      locationDetails: propertyData.locationDetails || null,
      aboutWorkspace: propertyData.aboutWorkspace || null,
      capacity: propertyData.capacity ? parseInt(propertyData.capacity) : null,
      superArea: propertyData.superArea ? parseInt(propertyData.superArea) : null,
      // Handle property options
      propertyOptions: propertyData.propertyOptions && Array.isArray(propertyData.propertyOptions) ? propertyData.propertyOptions : null,
      // Handle office timing
      officeTiming: propertyData.officeTiming && typeof propertyData.officeTiming === 'object' ? propertyData.officeTiming : null,
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