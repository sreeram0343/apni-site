const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
const originalSchema = fs.readFileSync(schemaPath, "utf8");

// Swap provider = "sqlite" to postgresql with directUrl
const postgresSchema = originalSchema
  .replace(
    'provider = "sqlite"',
    'provider  = "postgresql"\n  directUrl = env("DIRECT_URL")'
  );

try {
  console.log("Switching Prisma provider to postgresql for production build...");
  fs.writeFileSync(schemaPath, postgresSchema, "utf8");

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
