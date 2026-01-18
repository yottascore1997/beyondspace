import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all images for a section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'why-choose-us';

    // Check if sectionImage model exists (for backward compatibility)
    if (!prisma.sectionImage) {
      console.warn('SectionImage model not available, returning empty array');
      return NextResponse.json([]);
    }

    const images = await prisma.sectionImage.findMany({
      where: {
        section,
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json(images);
  } catch (error: any) {
    console.error('Error fetching section images:', error);
    // Return empty array instead of error for graceful fallback
    return NextResponse.json([]);
  }
}

// POST - Add new image (Admin only)
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if sectionImage model exists
    if (!prisma.sectionImage) {
      return NextResponse.json(
        { error: 'SectionImage model not available. Please run: npx prisma generate && npx prisma db push' },
        { status: 500 }
      );
    }

    const data = await request.json();
    const { section = 'why-choose-us', imageUrl, altText, displayOrder = 0 } = data;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const image = await prisma.sectionImage.create({
      data: {
        section,
        imageUrl,
        altText: altText || 'Section image',
        displayOrder,
        isActive: true,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error: any) {
    console.error('Error creating section image:', error);
    return NextResponse.json(
      { error: 'Failed to create image', details: error.message },
      { status: 500 }
    );
  }
});

