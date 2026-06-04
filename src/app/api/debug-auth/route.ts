import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const envStatus = {
    DATABASE_URL: process.env.DATABASE_URL ? "Defined (Starts with: " + process.env.DATABASE_URL.substring(0, 15) + "...)" : "UNDEFINED",
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
  } catch (err: any) {
    dbConnection = "FAILED";
    dbError = {
      message: err.message || "Unknown error",
      code: err.code || "No code",
      stack: err.stack ? err.stack.split("\n").slice(0, 3).join("\n") : "No stack"
    };
  }

  return NextResponse.json({
    message: "Auth & DB Diagnosis Endpoint",
    envStatus,
    dbConnection,
    dbError,
  });
}
