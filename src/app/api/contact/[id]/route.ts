import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(async (req, user) => {
    try {
      const data = await req.json();
      const { isRead } = data;

      const contact = await prisma.contactForm.update({
        where: { id: params.id },
        data: { isRead },
      });

      return NextResponse.json(contact);
    } catch (error) {
      console.error('Error updating contact:', error);
      return NextResponse.json(
        { error: 'Failed to update contact' },
        { status: 500 }
      );
    }
  })(request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(async (req, user) => {
    try {
      await prisma.contactForm.delete({
        where: { id: params.id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting contact:', error);
      return NextResponse.json(
        { error: 'Failed to delete contact' },
        { status: 500 }
      );
    }
  })(request);
}



