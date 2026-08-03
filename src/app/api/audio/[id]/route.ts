import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  readUploadedFile,
  readUploadedFileRange,
  statUploadedFile,
} from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  const { id } = await params;
  const lesson = await prisma.audioLesson.findUnique({ where: { id } });
  if (!lesson) {
    return new NextResponse(null, { status: 404 });
  }

  const stat = await statUploadedFile(lesson.storedName);
  const range = request.headers.get("range");

  if (!range) {
    const buffer = await readUploadedFile(lesson.storedName);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": lesson.mimeType,
        "Content-Length": String(stat.size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=0, no-cache",
      },
    });
  }

  const match = /bytes=(\d*)-(\d*)/.exec(range);
  const start = match?.[1] ? parseInt(match[1], 10) : 0;
  const end = Math.min(
    match?.[2] ? parseInt(match[2], 10) : stat.size - 1,
    stat.size - 1
  );

  if (start > end || start >= stat.size) {
    return new NextResponse(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${stat.size}` },
    });
  }

  const buffer = await readUploadedFileRange(lesson.storedName, start, end);

  return new NextResponse(new Uint8Array(buffer), {
    status: 206,
    headers: {
      "Content-Type": lesson.mimeType,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": String(end - start + 1),
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
