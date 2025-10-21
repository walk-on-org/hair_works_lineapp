import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const blob = await response.arrayBuffer();

    // 元のヘッダーからContent-Typeなどを引き継ぐ
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const filename =
      response.headers
        .get("content-disposition")
        ?.match(/filename="?(.+)"?$/)?.[1] || "downloaded-file";

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
