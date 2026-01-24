import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// GET single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT update testimonial (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest, user: any) => {
    try {
      const { id } = await params;
    const data = await request.json();
    const { name, role, company, text, rating, avatar, displayOrder, isActive } = data;

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Validate rating if provided (1-5)
    if (rating !== undefined) {
      const ratingNum = typeof rating === 'number' ? rating : parseInt(String(rating));
      if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return NextResponse.json(
          { error: 'Rating must be between 1 and 5' },
          { status: 400 }
        );
      }
    }

    // Update testimonial
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(role !== undefined && { role: String(role).trim() }),
        ...(company !== undefined && { company: String(company).trim() }),
        ...(text !== undefined && { text: String(text).trim() }),
        ...(rating !== undefined && { rating: typeof rating === 'number' ? rating : parseInt(String(rating)) || 5 }),
        ...(avatar !== undefined && { avatar: String(avatar).trim() }),
        ...(displayOrder !== undefined && { displayOrder: typeof displayOrder === 'number' ? displayOrder : parseInt(String(displayOrder)) || 0 }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

      return NextResponse.json({
        success: true,
        message: 'Testimonial updated successfully',
        testimonial,
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return NextResponse.json(
        { error: 'Failed to update testimonial' },
        { status: 500 }
      );
    }
  })(request);
}

// DELETE testimonial (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return requireAdmin(async (req: NextRequest, user: any) => {
    try {
      const { id } = await params;

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

      // Delete testimonial
      await prisma.testimonial.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: 'Testimonial deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return NextResponse.json(
        { error: 'Failed to delete testimonial' },
        { status: 500 }
      );
    }
  })(request);
}

