import { NextResponse } from "next/server";
import { validateFileType, validateFileSize, sanitizeFilename } from "@/lib/security";
import { rateLimiters } from "@/lib/rateLimit";

// Allowed file types for uploads
const ALLOWED_FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
  try {
    // Rate limiting for file uploads
    const rateLimitResult = rateLimiters.upload(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: "Too many upload requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          }
        }
      );
    }

    const incomingForm = await request.formData();
    const file = incomingForm.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (!validateFileSize(file.size, MAX_FILE_SIZE)) {
      return NextResponse.json(
        { error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    const filename = file.name;
    if (!validateFileType(filename, ALLOWED_FILE_TYPES)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Sanitize filename
    const sanitizedFilename = sanitizeFilename(filename);

    const uploadForm = new FormData();
    uploadForm.append("file", file);
    // Also send token as a form field for PHP endpoints expecting POST param
    // (we still send it as a header too)
    const token = process.env.UPLOAD_TOKEN;
    if (token) {
      uploadForm.append("token", token);
    }

    if (!token) {
      return NextResponse.json(
        { error: "Server misconfiguration: UPLOAD_TOKEN missing" },
        { status: 500 }
      );
    }

    const response = await fetch("https://files.yottascore.com/upload.php", {
      method: "POST",
      headers: {
        "X-Upload-Token": token,
      },
      body: uploadForm,
      // credentials not required; cross-origin POST to PHP endpoint
    });

    // Try to parse JSON, otherwise fall back to text for diagnostics
    let data: any;
    try {
      data = await response.json();
    } catch {
      const text = await response.text().catch(() => "");
      data = {
        error: "Upstream returned non-JSON",
        upstreamStatus: response.status,
        upstreamText: text?.slice(0, 500),
      };
    }

    // Normalize response: ensure both `url` and `imageUrl` keys for FE compatibility
    if (data && typeof data === "object") {
      const urlValue =
        (data.url as string) ||
        (data.imageUrl as string) ||
        (data.secure_url as string) ||
        "";
      if (urlValue) {
        data.url = urlValue;
        data.imageUrl = urlValue;
      }
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    // Don't expose sensitive error details
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'An error occurred during file upload. Please try again.';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
