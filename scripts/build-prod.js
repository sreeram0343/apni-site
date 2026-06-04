const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
const originalSchema = fs.readFileSync(schemaPath, "utf8");

// Setup dummy env vars for build phase if they are missing to satisfy Prisma validation
const hasDatabaseUrl = !!process.env.DATABASE_URL;
const hasDirectUrl = !!process.env.DIRECT_URL;

if (!hasDatabaseUrl) {
  console.log("No DATABASE_URL found in environment. Using dummy URL for build compilation...");
  process.env.DATABASE_URL = "postgresql://postgres:dummy@localhost:5432/postgres";
}

if (!hasDirectUrl) {
  console.log("No DIRECT_URL found in environment. Using DATABASE_URL as fallback for build compilation...");
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

// Swap provider = "sqlite" to postgresql with directUrl
const postgresSchema = originalSchema
  .replace(
    'provider = "sqlite"',
    'provider  = "postgresql"\n  directUrl = env("DIRECT_URL")'
  );

try {
  console.log("Switching Prisma provider to postgresql for production build...");
  fs.writeFileSync(schemaPath, postgresSchema, "utf8");

  console.log("Running prisma db push to sync database schema...");
  try {
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("Prisma db push completed successfully.");
  } catch (dbError) {
    console.warn("WARNING: prisma db push failed. If DATABASE_URL is not set yet, set it in Netlify settings. Error:", dbError.message);
  }

  console.log("Running prisma generate...");
  execSync("npx prisma generate", { stdio: "inherit" });

  console.log("Running next build...");
  execSync("next build", { stdio: "inherit" });
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
} finally {
  console.log("Restoring original SQLite schema for local development...");
  fs.writeFileSync(schemaPath, originalSchema, "utf8");
}
