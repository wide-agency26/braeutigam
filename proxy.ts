import { NextRequest, NextResponse } from "next/server";
import { decryptSession, SESSION_COOKIE } from "@/lib/auth/session";
import { CMS_BASE, CMS_LOGIN } from "@/lib/cms";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isCmsAdmin =
    pathname === CMS_BASE || pathname.startsWith(`${CMS_BASE}/`);
  const isLogin = pathname === CMS_LOGIN;

  if (!isCmsAdmin) {
    return NextResponse.next();
  }

  const session = await decryptSession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!isLogin && !session) {
    const url = request.nextUrl.clone();
    url.pathname = CMS_LOGIN;
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isLogin && session) {
    const url = request.nextUrl.clone();
    url.pathname = CMS_BASE;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/admin", "/cms/admin/:path*"],
};
