import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.dailyReport.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  // Seed existing accounts (Google OAuth login with these emails will link automatically)
  await prisma.user.create({
    data: {
      name: "Rajesh Kumar (Admin)",
      email: "admin@apnisite.com",
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Amit Sharma (Supervisor)",
      email: "supervisor@apnisite.com",
      role: "SUPERVISOR",
    },
  });

  await prisma.user.create({
    data: {
      name: "Vikram Singh (Supervisor)",
      email: "sup2@apnisite.com",
      role: "SUPERVISOR",
    },
  });

  console.log("Users created.");
  console.log("No historical reports seeded for a fresh startup.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
