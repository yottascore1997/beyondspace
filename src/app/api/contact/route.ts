import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEmail, validateMobile, sanitizeInput } from '@/lib/security';
import { rateLimiters } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for contact form
    const rateLimitResult = rateLimiters.general(request as any);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

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
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate mobile format (Indian mobile numbers)
    const mobileValidation = validateMobile(mobile);
    if (!mobileValidation.isValid) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name.trim());
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedSolution = sanitizeInput(solution);
    const sanitizedMessage = message ? sanitizeInput(message.trim()) : null;

    // Create contact form entry
    const contactForm = await prisma.contactForm.create({
      data: {
        name: sanitizedName,
        mobile: mobileValidation.cleaned,
        email: sanitizedEmail,
        solution: sanitizedSolution,
        message: sanitizedMessage,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! We will contact you soon.',
      data: contactForm,
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    
    // Don't expose sensitive error details
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to submit form. Please try again.';
    
    return NextResponse.json(
      { error: errorMessage },
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

    // Test connection first - reconnect if needed
    await prisma.$connect();

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
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    
    // If connection error, try to reconnect
    if (error.code === 'P1017' || error.code === 'P1001') {
      try {
        await prisma.$disconnect();
        await prisma.$connect();
      } catch (reconnectError) {
        console.error('Failed to reconnect to database:', reconnectError);
      }
    }
    
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Failed to fetch contacts. Please try again.';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}



