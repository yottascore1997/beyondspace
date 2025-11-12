import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const submissions = await prisma.property.findMany({
      where: {
        userId: 'customer-submission'
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching customer submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received customer property data:', JSON.stringify(data, null, 2));

    // Convert lowercase enum values to uppercase and handle data types
    const finalPropertyData = {
      ...data,
      purpose: data.purpose?.toUpperCase(),
      type: data.type?.toUpperCase(),
      userId: 'customer-submission', // Default user ID for customer submissions
      // Convert string numbers to integers
      price: parseInt(data.price) || 0,
      size: parseInt(data.size) || 0,
      rating: parseFloat(data.rating) || 0,
      // Handle coworking specific fields
      workspaceName: data.workspaceName || null,
      workspaceTimings: data.workspaceTimings || null,
      workspaceClosedDays: data.workspaceClosedDays || null,
      amenities: data.amenities && Array.isArray(data.amenities) ? data.amenities : null,
      locationDetails: data.locationDetails || null,
      metroStationDistance: data.metroStationDistance || null,
      railwayStationDistance: data.railwayStationDistance || null,
      aboutWorkspace: data.aboutWorkspace || null,
      capacity: data.capacity ? parseInt(data.capacity) : null,
      superArea: data.superArea ? parseInt(data.superArea) : null,
      isActive: false, // Customer submissions start as inactive until admin approval
    };

    // Create property
    const property = await prisma.property.create({
      data: finalPropertyData,
    });

    return NextResponse.json({
      message: 'Property submitted successfully',
      property: property,
      status: 'pending_approval'
    });
  } catch (error) {
    console.error('Error creating customer property:', error);
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
}
