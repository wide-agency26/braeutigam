import { NextRequest, NextResponse } from "next/server";
import { decryptSession, SESSION_COOKIE } from "@/lib/auth/session";
import { CMS_BASE, CMS_LOGIN } from "@/lib/cms";
import { siteIndexable } from "@/lib/site-config";
import { HERO_HISTORY_COOKIE, HERO_SLIDE_HEADER, nextHeroSlide } from "@/lib/hero-slides";

function withPrelaunchHeaders(response: NextResponse) {
  if (!siteIndexable()) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

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
    // Only actual hero-page visits advance the session rotation, never assets,
    // API calls, form submissions or speculative prefetches.
    const hasHero = ["/", "/en", "/kontakt", "/en/kontakt"].includes(pathname);
    const isPrefetch = request.headers.get("purpose") === "prefetch" ||
      request.headers.get("sec-purpose")?.includes("prefetch");
    const rotation = hasHero && request.method === "GET" && !isPrefetch
      ? nextHeroSlide(request.cookies.get(HERO_HISTORY_COOKIE)?.value)
      : null;
    requestHeaders.delete(HERO_SLIDE_HEADER);
    if (rotation) requestHeaders.set(HERO_SLIDE_HEADER, rotation.slide.id);
    const response = withPrelaunchHeaders(
      NextResponse.next({ request: { headers: requestHeaders } }),
    );
    if (rotation) {
      response.cookies.set(HERO_HISTORY_COOKIE, rotation.history, {
        httpOnly: true, sameSite: "lax", path: "/", secure: request.nextUrl.protocol === "https:",
      });
    }
    return response;
  }

  const session = await decryptSession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!isLogin && !session) {
    const url = request.nextUrl.clone();
    url.pathname = CMS_LOGIN;
    url.search = "";
    return withPrelaunchHeaders(
      NextResponse.redirect(url, { headers: requestHeaders }),
    );
  }

  if (isLogin && session) {
    const url = request.nextUrl.clone();
    url.pathname = CMS_BASE;
    url.search = "";
    return withPrelaunchHeaders(
      NextResponse.redirect(url, { headers: requestHeaders }),
    );
  }

  return withPrelaunchHeaders(
    NextResponse.next({ request: { headers: requestHeaders } }),
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
