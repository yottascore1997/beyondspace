import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all cities
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        areas: {
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
});

// POST - Create a new city
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const data = await request.json();
    const { name } = data;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if city already exists
    const existingCity = await prisma.city.findUnique({
      where: { name: name.trim() },
    });

    if (existingCity) {
      return NextResponse.json(
        { error: 'City with this name already exists' },
        { status: 400 }
      );
    }

    const city = await prisma.city.create({
      data: {
        name: name.trim(),
      },
      include: {
        areas: true,
      },
    });

    return NextResponse.json(city, { status: 201 });
  } catch (error) {
    console.error('Error creating city:', error);
    return NextResponse.json(
      { error: 'Failed to create city' },
      { status: 500 }
    );
  }
});

