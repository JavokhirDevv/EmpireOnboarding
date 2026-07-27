import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { readResourceFile } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  const { id } = await params;
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) {
    return new NextResponse(null, { status: 404 });
  }

  const buffer = await readResourceFile(resource.storedName);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": resource.mimeType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(resource.fileName)}"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
