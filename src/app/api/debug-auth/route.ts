import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const getUrlDebugInfo = (url: string | undefined) => {
    if (!url) return "UNDEFINED";
    try {
      // Parse the connection string, taking care of postgresql:// format
      const parsed = new URL(url);
      return {
        protocol: parsed.protocol,
        host: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hasPassword: !!parsed.password,
        hasUsername: !!parsed.username,
      };
    } catch (e) {
      // If parsing fails, return a safe masked version
      return "Invalid URL format: " + url.substring(0, 20) + "...";
    }
  };

  const envStatus = {
    DATABASE_URL: getUrlDebugInfo(process.env.DATABASE_URL),
    DIRECT_URL: getUrlDebugInfo(process.env.DIRECT_URL),
    AUTH_SECRET: process.env.AUTH_SECRET ? "Defined" : "UNDEFINED",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Defined" : "UNDEFINED",
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ? "Defined" : "UNDEFINED",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "Defined" : "UNDEFINED",
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ? "Defined" : "UNDEFINED",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "Defined" : "UNDEFINED",
    NODE_ENV: process.env.NODE_ENV || "none",
  };

  let dbConnection = "Untested";
  let dbError = null;

  try {
    // Try a simple count query to verify database connectivity
    const userCount = await db.user.count();
    dbConnection = `SUCCESS! Connected. User count in database: ${userCount}`;
  } catch (err) {
    const error = err as Error & { code?: string };
    dbConnection = "FAILED";
    dbError = {
      message: error.message || "Unknown error",
      code: error.code || "No code",
      stack: error.stack ? error.stack.split("\n").slice(0, 3).join("\n") : "No stack"
    };
  }

  return NextResponse.json({
    message: "Auth & DB Diagnosis Endpoint",
    envStatus,
    dbConnection,
    dbError,
  });
}
