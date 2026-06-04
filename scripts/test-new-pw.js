const { PrismaClient } = require('@prisma/client');

async function testConnection(url, name) {
  console.log(`Testing ${name}...`);
  const prisma = new PrismaClient({
    datasources: {
      db: { url }
    }
  });

  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log(`✅ ${name} connection SUCCESS!`, result);
    await prisma.$disconnect();
    return true;
  } catch (err) {
    console.log(`❌ ${name} connection FAILED:`, err.message);
    await prisma.$disconnect();
    return false;
  }
}

async function main() {
  const pw = 'Sreeram%402005';
  
  // Try direct connection port 5432
  const directUrl = `postgresql://postgres:${pw}@db.uxallvslvekghkwstidk.supabase.co:5432/postgres?sslmode=require`;
  await testConnection(directUrl, "Direct (5432)");

  // Try pooler connections port 6543
  const poolerApNortheast2 = `postgresql://postgres.uxallvslvekghkwstidk:${pw}@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require`;
  await testConnection(poolerApNortheast2, "Pooler (ap-northeast-2 6543)");
  
  // Also try 5432 on pooler
  const poolerApNortheast2_5432 = `postgresql://postgres.uxallvslvekghkwstidk:${pw}@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require`;
  await testConnection(poolerApNortheast2_5432, "Pooler (ap-northeast-2 5432)");
}

main().catch(console.error);
