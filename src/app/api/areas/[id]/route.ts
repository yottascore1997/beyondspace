import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// PUT - Update an area
export const PUT = requireAuth(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const data = await request.json();
    const { name, cityId } = data;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if area exists
    const existingArea = await prisma.area.findUnique({
      where: { id },
    });

    if (!existingArea) {
      return NextResponse.json(
        { error: 'Area not found' },
        { status: 404 }
      );
    }

    // If cityId is provided, check if city exists
    if (cityId) {
      const city = await prisma.city.findUnique({
        where: { id: cityId },
      });

      if (!city) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 404 }
        );
      }
    }

    // Check if another area with same name exists in the same city
    const targetCityId = cityId || existingArea.cityId;
    const duplicateArea = await prisma.area.findFirst({
      where: {
        name: name.trim(),
        cityId: targetCityId,
        id: { not: id },
      },
    });

    if (duplicateArea) {
      return NextResponse.json(
        { error: 'Area with this name already exists in this city' },
        { status: 400 }
      );
    }

    const updatedArea = await prisma.area.update({
      where: { id },
      data: {
        name: name.trim(),
        ...(cityId && { cityId }),
      },
      include: {
        city: true,
      },
    });

    return NextResponse.json(updatedArea);
  } catch (error) {
    console.error('Error updating area:', error);
    return NextResponse.json(
      { error: 'Failed to update area' },
      { status: 500 }
    );
  }
});

// DELETE - Delete an area
export const DELETE = requireAuth(async (
  request: NextRequest,
  user,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    // Check if area exists
    const area = await prisma.area.findUnique({
      where: { id },
    });

    if (!area) {
      return NextResponse.json(
        { error: 'Area not found' },
        { status: 404 }
      );
    }

    // Check if any properties are using this area
    const propertiesUsingArea = await prisma.property.findFirst({
      where: {
        area: area.name,
      },
    });

    if (propertiesUsingArea) {
      return NextResponse.json(
        { error: 'Cannot delete area. Some properties are using this area.' },
        { status: 400 }
      );
    }

    await prisma.area.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Area deleted successfully' });
  } catch (error) {
    console.error('Error deleting area:', error);
    return NextResponse.json(
      { error: 'Failed to delete area' },
      { status: 500 }
    );
  }
});

