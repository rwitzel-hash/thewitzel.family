import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { siteSlugs } from "@/data/sites";

const SITE_SLUGS = new Set(siteSlugs);

function getSubdomain(hostname: string): string | null {
  if (hostname.endsWith(".localhost")) {
    const [subdomain] = hostname.split(".");
    return subdomain || null;
  }

  if (hostname.endsWith(".thewitzel.family")) {
    const subdomain = hostname.replace(/\.thewitzel\.family$/, "");
    if (!subdomain || subdomain === "www") {
      return null;
    }
    return subdomain;
  }

  return null;
}

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";
  const subdomain = getSubdomain(hostname);

  if (!subdomain || !SITE_SLUGS.has(subdomain)) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/sites/")) {
    return NextResponse.next();
  }

  const rewritePath =
    pathname === "/" ? `/sites/${subdomain}` : `/sites/${subdomain}${pathname}`;

  return NextResponse.rewrite(new URL(rewritePath, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
