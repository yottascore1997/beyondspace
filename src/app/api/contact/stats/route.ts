import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const unread = await prisma.contactForm.count({
      where: { isRead: false },
    });

    return NextResponse.json({ unread });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
