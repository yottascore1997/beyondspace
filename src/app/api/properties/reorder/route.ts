import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

interface ReorderUpdate {
  id: string;
  displayOrder: number;
}

export const PUT = requireAuth(async (request) => {
  try {
    const body = await request.json();
    const updates: ReorderUpdate[] = Array.isArray(body?.updates) ? body.updates : [];

    if (!updates.length) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    await prisma.$transaction(
      updates.map((update) =>
        prisma.property.update({
          where: { id: update.id },
          data: { displayOrder: update.displayOrder },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering properties:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
