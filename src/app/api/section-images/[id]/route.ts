import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// PUT - Update image (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return requireAuth(async (req: NextRequest, user: any) => {
    try {
      if (user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      if (!id) {
        return NextResponse.json(
          { error: 'Image ID is required' },
          { status: 400 }
        );
      }

      const data = await req.json();
      let { imageUrl, altText, displayOrder, isActive } = data;

      // Replace files.beyondspacework.com with files.yottascore.com before saving
      if (imageUrl && imageUrl.includes('files.beyondspacework.com')) {
        imageUrl = imageUrl.replace(/files\.beyondspacework\.com/g, 'files.yottascore.com');
        console.log('Replaced beyondspacework.com with yottascore.com in section image update');
      }

      const image = await prisma.sectionImage.update({
        where: { id },
        data: {
          ...(imageUrl && { imageUrl }),
          ...(altText !== undefined && { altText }),
          ...(displayOrder !== undefined && { displayOrder }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      return NextResponse.json(image);
    } catch (error: any) {
      console.error('Error updating section image:', error);
      return NextResponse.json(
        { error: 'Failed to update image' },
        { status: 500 }
      );
    }
  })(request);
}

// DELETE - Delete image (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return requireAuth(async (req: NextRequest, user: any) => {
    try {
      if (user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }

      if (!id) {
        return NextResponse.json(
          { error: 'Image ID is required' },
          { status: 400 }
        );
      }

      await prisma.sectionImage.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting section image:', error);
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }
  })(request);
}
