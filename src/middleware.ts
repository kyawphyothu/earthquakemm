import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the path starts with /admin
  if (path.startsWith("/admin")) {
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // If the user is not authenticated, redirect to the login page
    if (!session) {
      const url = new URL("/auth/login", request.url);
      // Add the original URL as a redirect_to parameter
      url.searchParams.set("redirect_to", path);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// See: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/admin/:path*"]
};
