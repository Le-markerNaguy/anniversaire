import { type NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { sessionOptions, IronSessionData } from "@/lib/session"

// Middleware pour protéger les routes admin
export async function middleware(req: NextRequest) {
  // Apply middleware to /admin and its subpaths, excluding login
  if (req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.includes("/admin/login")) {
    const response = NextResponse.next()
    const session = await getIronSession<IronSessionData>(req, response, sessionOptions)

    if (!session.adminId) {
      // No session or adminId not set, redirect to login
      const loginUrl = new URL("/admin/login", req.url)
      // You might want to add a redirect query param to go back after login
      // loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl)
    }

    // Session exists and contains adminId, allow the request to proceed
    return NextResponse.next()
  }

  // Allow all other requests to proceed
  return NextResponse.next()
}

// Configure the paths the middleware applies to
export const config = {
  matcher: ["/admin/:path*"],
}
