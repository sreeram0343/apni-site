import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = nextUrl.pathname === "/login";
  const isUploads = nextUrl.pathname.startsWith("/uploads");

  if (isApiAuthRoute || isUploads) return;

  if (isPublicRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  const role = req.auth?.user?.role;

  // Protect Admin Dashboard
  if (nextUrl.pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
    return Response.redirect(new URL("/", nextUrl));
  }

  // Protect Supervisor Dashboard
  if (nextUrl.pathname.startsWith("/dashboard/supervisor") && role !== "SUPERVISOR") {
    return Response.redirect(new URL("/", nextUrl));
  }
});

export const config = {
  matcher: [
    // Skip all API routes except auth ones, and skip standard static files
    "/((?!api/reports|_next/static|_next/image|favicon.ico|uploads/).*)",
  ],
};
