import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mobile, email, interest, company, teamSize } = body;

    // Validate required fields
    if (!name || !mobile || !email) {
      return NextResponse.json(
        { error: 'Name, mobile, and email are required' },
        { status: 400 }
      );
    }

    // Create requirement record
    const requirement = await prisma.requirement.create({
      data: {
        name,
        mobile,
        email,
        interest: interest || null,
        company: company || null,
        teamSize: teamSize || null,
        status: 'new',
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { 
        message: 'Requirement submitted successfully',
        id: requirement.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating requirement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requirements = await prisma.requirement.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(requirements);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
