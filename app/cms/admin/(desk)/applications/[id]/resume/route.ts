import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { objectKeyFromStoredPath } from "@/lib/storage";
import { resumeDownloadResponse } from "@/lib/resume-download";

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
  const download = await resumeDownloadResponse(objectKey, filename);
  if (!download) {
    return new NextResponse("Resume not found.", { status: 404 });
  }

  return download;
}
