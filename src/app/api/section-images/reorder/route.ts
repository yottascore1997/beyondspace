import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

interface ReorderUpdate {
  id: string;
  displayOrder: number;
}

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (!prisma.sectionImage) {
      return NextResponse.json({ error: 'SectionImage model not available' }, { status: 500 });
    }

    const body = await request.json();
    const section: string = body?.section || 'why-choose-us';
    const updates: ReorderUpdate[] = Array.isArray(body?.updates) ? body.updates : [];

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    // Ensure all ids belong to this section
    const ids = updates.map((u) => u.id);
    const existing = await prisma.sectionImage.findMany({
      where: { id: { in: ids }, section },
      select: { id: true },
    });
    if (existing.length !== ids.length) {
      return NextResponse.json({ error: 'One or more images do not belong to this section' }, { status: 400 });
    }

    // Apply updates in a transaction
    await prisma.$transaction(
      updates.map((u) =>
        prisma.sectionImage.update({
          where: { id: u.id },
          data: { displayOrder: u.displayOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error reordering section images:', error);
    return NextResponse.json({ error: 'Failed to reorder images' }, { status: 500 });
  }
});


