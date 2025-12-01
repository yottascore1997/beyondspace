import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

// GET all testimonials (public route - for homepage)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly');

    const where: { isActive?: boolean } = {};
    
    // If activeOnly is true, only return active testimonials (for homepage)
    if (activeOnly === 'true') {
      where.isActive = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json({
      testimonials,
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST create new testimonial (admin only)
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const data = await request.json();
    const { name, role, company, text, rating, avatar, displayOrder, isActive } = data;

    // Validate required fields
    if (!name || !role || !company || !text || !rating || !avatar) {
      return NextResponse.json(
        { error: 'Name, role, company, text, rating, and avatar are required' },
        { status: 400 }
      );
    }

    // Validate rating (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        text: text.trim(),
        rating: parseInt(rating),
        avatar: avatar.trim(),
        displayOrder: displayOrder ? parseInt(displayOrder) : 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial,
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
});

