import { NextRequest, NextResponse } from "next/server";
import { decryptSession, SESSION_COOKIE } from "@/lib/auth/session";
import { CMS_BASE, CMS_LOGIN } from "@/lib/cms";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale =
    pathname === "/en" || pathname.startsWith("/en/") ? "en" : "de";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", locale);

  const isCmsAdmin =
    pathname === CMS_BASE || pathname.startsWith(`${CMS_BASE}/`);
  const isLogin = pathname === CMS_LOGIN;

  if (!isCmsAdmin) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const session = await decryptSession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!isLogin && !session) {
    const url = request.nextUrl.clone();
    url.pathname = CMS_LOGIN;
    url.search = "";
    return NextResponse.redirect(url, { headers: requestHeaders });
  }

  if (isLogin && session) {
    const url = request.nextUrl.clone();
    url.pathname = CMS_BASE;
    url.search = "";
    return NextResponse.redirect(url, { headers: requestHeaders });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
