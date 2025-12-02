import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, mobile, email, solution, message } = data;

    // Validate required fields
    if (!name || !mobile || !email || !solution) {
      return NextResponse.json(
        { error: 'Name, mobile, email, and solution are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate mobile format (Indian mobile numbers)
    // Extract only digits from mobile number
    const mobileDigits = mobile.replace(/\D/g, '');
    
    // Extract last 10 digits (in case country code is included)
    const phoneNumber = mobileDigits.length >= 10 
      ? mobileDigits.slice(-10) 
      : mobileDigits;
    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(phoneNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    // Create contact form entry
    const contactForm = await prisma.contactForm.create({
      data: {
        name: name.trim(),
        mobile: phoneNumber,
        email: email.toLowerCase().trim(),
        solution,
        message: message?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! We will contact you soon.',
      data: contactForm,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      prisma.contactForm.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactForm.count(),
    ]);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}



