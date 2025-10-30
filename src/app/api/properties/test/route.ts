import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Received data:', data);

    // First, get or create a test user
    let user = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!user) {
      // Create a test admin user
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      user = await prisma.user.create({
        data: {
          email: 'admin@beyondestates.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
        },
      });
      console.log('Created admin user:', user.id);
    }

    // Create the property
    const property = await prisma.property.create({
      data: {
        title: data.title,
        city: data.city,
        area: data.area,
        purpose: data.purpose?.toUpperCase(), // Convert to uppercase
        type: data.type?.toUpperCase(), // Convert to uppercase
        priceDisplay: data.priceDisplay,
        price: parseInt(data.price) || 0,
        size: parseInt(data.size) || 0,
        beds: data.beds,
        rating: parseFloat(data.rating) || 0,
        image: data.image,
        tag: data.tag,
        description: data.description,
        userId: user.id,
      },
    });

    console.log('Property created:', property.id);

    return NextResponse.json({
      success: true,
      property: property,
      message: 'Property created successfully!'
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
