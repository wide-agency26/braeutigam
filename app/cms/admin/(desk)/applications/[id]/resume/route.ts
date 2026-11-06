import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { createResumeDownloadUrl, objectKeyFromStoredPath } from "@/lib/storage";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  await verifySession();
  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    select: { resumePath: true, resumeName: true },
  });
  const objectKey = application?.resumePath
    ? objectKeyFromStoredPath(application.resumePath)
    : null;
  if (!objectKey) {
    return new NextResponse("Resume not found.", { status: 404 });
  }

  const filename = (application?.resumeName ?? "resume").replace(/["\r\n]/g, "");
  const url = await createResumeDownloadUrl(objectKey, filename);
  if (!url) {
    return new NextResponse("Resume not found.", { status: 404 });
  }

  return NextResponse.redirect(url, {
    headers: {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
