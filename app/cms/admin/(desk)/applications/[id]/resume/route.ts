import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { readResume } from "@/lib/uploads";

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

  if (!application?.resumePath) {
    return new NextResponse("Resume not found.", { status: 404 });
  }

  const file = await readResume(application.resumePath);
  if (!file) {
    return new NextResponse("Resume not found.", { status: 404 });
  }

  const filename = (application.resumeName ?? "resume").replace(/"/g, "");
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
