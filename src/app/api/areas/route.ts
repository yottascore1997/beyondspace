import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all areas with their cities
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');

    if (cityId) {
      // Get areas for a specific city
      const areas = await prisma.area.findMany({
        where: { cityId },
        include: {
          city: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      return NextResponse.json(areas);
    }

    // Get all areas with cities
    const areas = await prisma.area.findMany({
      include: {
        city: true,
      },
      orderBy: [
        { city: { name: 'asc' } },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(areas);
  } catch (error) {
    console.error('Error fetching areas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch areas' },
      { status: 500 }
    );
  }
});

// POST - Create a new area
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const data = await request.json();
    const { name, cityId } = data;

    if (!name || !cityId) {
      return NextResponse.json(
        { error: 'Name and cityId are required' },
        { status: 400 }
      );
    }

    // Check if city exists
    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      );
    }

    // Check if area with same name already exists in this city
    const existingArea = await prisma.area.findFirst({
      where: {
        name: name.trim(),
        cityId,
      },
    });

    if (existingArea) {
      return NextResponse.json(
        { error: 'Area with this name already exists in this city' },
        { status: 400 }
      );
    }

    const area = await prisma.area.create({
      data: {
        name: name.trim(),
        cityId,
      },
      include: {
        city: true,
      },
    });

    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    console.error('Error creating area:', error);
    return NextResponse.json(
      { error: 'Failed to create area' },
      { status: 500 }
    );
  }
});

