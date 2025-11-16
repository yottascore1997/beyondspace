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

    const response = await fetch("https://files.beyondspacework.com/upload.php", {
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
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
