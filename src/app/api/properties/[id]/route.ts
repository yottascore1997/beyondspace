import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        propertyImages: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Debug: Log property data before sending
    if (process.env.NODE_ENV === 'development') {
      console.log('[Property API] Property Data:', {
        id: property.id,
        locationDetails: property.locationDetails,
        metroStationDistance: property.metroStationDistance,
        railwayStationDistance: property.railwayStationDistance,
        googleMapLink: property.googleMapLink,
        aboutWorkspace: property.aboutWorkspace,
      });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: { propertyImages: true },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { images, ...propertyData } = data;

    // Handle workspace timings - combine monFriTime, saturdayTime, sundayTime if present
    let workspaceTimingsValue = propertyData.workspaceTimings ?? existingProperty.workspaceTimings;
    if (propertyData.monFriTime || propertyData.saturdayTime || propertyData.sundayTime) {
      const parts: string[] = [];
      if (propertyData.monFriTime) parts.push(`Mon-Fri: ${propertyData.monFriTime}`);
      if (propertyData.saturdayTime) parts.push(`Sat: ${propertyData.saturdayTime}`);
      if (propertyData.sundayTime) parts.push(`Sun: ${propertyData.sundayTime}`);
      workspaceTimingsValue = parts.join(' | ') || existingProperty.workspaceTimings;
    }

    const normalizedCategories = Array.isArray(propertyData.categories)
      ? propertyData.categories.map((category: string) => category.toLowerCase())
      : (existingProperty.categories as string[] | null) ?? [];

    const toInt = (value: unknown, fallback: number | null) => {
      if (value === null || value === undefined || value === '') return fallback;
      const parsed = parseInt(String(value), 10);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const toFloat = (value: unknown, fallback: number) => {
      if (value === null || value === undefined || value === '') return fallback;
      const parsed = parseFloat(String(value));
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const finalPropertyData = {
      title: propertyData.title ?? existingProperty.title,
      city: propertyData.city ?? existingProperty.city,
      area: propertyData.area ?? existingProperty.area,
      sublocation: propertyData.sublocation ?? existingProperty.sublocation,
      purpose: (propertyData.purpose ?? existingProperty.purpose)?.toUpperCase(),
      type: (propertyData.type ?? existingProperty.type)?.toUpperCase(),
      categories: normalizedCategories,
      priceDisplay: propertyData.priceDisplay ?? existingProperty.priceDisplay,
      price: toInt(propertyData.price, existingProperty.price),
      size: toInt(propertyData.size, existingProperty.size),
      beds: propertyData.beds ?? existingProperty.beds,
      rating: toFloat(propertyData.rating, existingProperty.rating),
      image: Array.isArray(images) && images.length > 0
        ? images[0]
        : propertyData.image ?? existingProperty.image,
      tag: propertyData.tag ?? existingProperty.tag,
      description: propertyData.description ?? existingProperty.description,
      workspaceName: propertyData.workspaceName ?? existingProperty.workspaceName,
      workspaceTimings: workspaceTimingsValue,
      workspaceClosedDays: propertyData.workspaceClosedDays ?? existingProperty.workspaceClosedDays,
      amenities: propertyData.amenities ?? existingProperty.amenities,
      locationDetails: propertyData.locationDetails ?? existingProperty.locationDetails,
      metroStationDistance: propertyData.metroStationDistance ?? existingProperty.metroStationDistance,
      railwayStationDistance: propertyData.railwayStationDistance ?? existingProperty.railwayStationDistance,
      googleMapLink: propertyData.googleMapLink ?? existingProperty.googleMapLink,
      propertyTier: propertyData.propertyTier ?? existingProperty.propertyTier,
      aboutWorkspace: propertyData.aboutWorkspace ?? existingProperty.aboutWorkspace,
      capacity: toInt(propertyData.capacity, existingProperty.capacity),
      superArea: toInt(propertyData.superArea, existingProperty.superArea),
      propertyOptions: propertyData.propertyOptions ?? existingProperty.propertyOptions,
      officeTiming: propertyData.officeTiming ?? existingProperty.officeTiming,
    };

    const updatedProperty = await prisma.$transaction(async (tx) => {
      await tx.property.update({
        where: { id },
        data: finalPropertyData,
      });

      await tx.propertyImage.deleteMany({
        where: { propertyId: id },
      });

      if (Array.isArray(images) && images.length > 0) {
        const uniqueImages = Array.from(new Set(images.filter((image: string) => Boolean(image))));
        if (uniqueImages.length > 0) {
          await tx.propertyImage.createMany({
            data: uniqueImages.map((imageUrl: string) => ({
              imageUrl,
              propertyId: id,
            })),
          });
        }
      }

      return tx.property.findUnique({
        where: { id },
        include: { propertyImages: true },
      });
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}