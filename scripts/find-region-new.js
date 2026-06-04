const { PrismaClient } = require("@prisma/client");

const projectRef = "uxallvslvekghkwstidk";

const regions = [
  "ap-northeast-2", // Seoul (highly likely based on IPv6 range)
  "ap-south-1",     // Mumbai
  "ap-southeast-1", // Singapore
  "ap-southeast-2", // Sydney
  "ap-northeast-1", // Tokyo
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "ca-central-1",
  "sa-east-1"
];

const passwords = [
  "Sreeram@2005"
];

const ports = ["6543", "5432"];

async function testConnection(region, pw, port) {
  // Try both raw and URL-encoded
  const encodedPw = encodeURIComponent(pw).replace(/!/g, "%21");
  const urls = [
    `postgresql://postgres.${projectRef}:${encodedPw}@aws-0-${region}.pooler.supabase.com:${port}/postgres?sslmode=require`,
    `postgresql://postgres.${projectRef}:${pw}@aws-0-${region}.pooler.supabase.com:${port}/postgres?sslmode=require`
  ];

  for (const url of urls) {
    const prisma = new PrismaClient({
      datasources: { db: { url } }
    });

    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log(`\n🎉 SUCCESS!`);
      console.log(`Working connection string: ${url}\n`);
      await prisma.$disconnect();
      return { success: true, url };
    } catch (err) {
      console.log(`Region ${region} (Port ${port}) Error: ${err.message.replace(/\n/g, ' ').trim()}`);
    } finally {
      await prisma.$disconnect();
    }
  }
  return { success: false };
}

async function main() {
  console.log("Starting exhaustive database connection sweeps...");
  for (const region of regions) {
    console.log(`Checking region ${region}...`);
    for (const pw of passwords) {
      for (const port of ports) {
        const result = await testConnection(region, pw, port);
        if (result.success) {
          console.log("Connection found! Exiting.");
          process.exit(0);
        }
      }
    }
  }
  console.log("All sweep attempts failed. Unable to connect to Supabase pooler.");
}

main().catch(console.error);
