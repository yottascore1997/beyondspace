import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const incomingForm = await request.formData();
    const file = incomingForm.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const token = process.env.UPLOAD_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Server misconfiguration: UPLOAD_TOKEN missing" },
        { status: 500 }
      );
    }

    const response = await fetch("https://files.beyondspacework.com/upload.php", {
      method: "POST",
      headers: {
        "X-Upload-Token": token,
      },
      body: uploadForm,
      // credentials not required; cross-origin POST to PHP endpoint
    });

    const data = await response
      .json()
      .catch(() => ({ error: "Invalid JSON from upstream" }));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    // Accept both 'file' and 'image' field names for compatibility
    const file: File | null = (data.get('file') || data.get('image')) as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    // Sanitize filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const path = join(uploadsDir, filename);

    // Write file to disk
    await writeFile(path, buffer);

    // Return the public URL - use imageUrl for compatibility
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({ imageUrl, url: imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}