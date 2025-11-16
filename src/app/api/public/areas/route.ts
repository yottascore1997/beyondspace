import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');

    const areas = await prisma.area.findMany({
      where: cityId ? { cityId } : undefined,
      select: { id: true, name: true, cityId: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(areas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch areas' }, { status: 500 });
  }
}


