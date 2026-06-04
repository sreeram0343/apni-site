import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.dailyReport.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  // Create users
  const adminPassword = await bcrypt.hash("password123", 10);
  const supervisorPassword = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      name: "Rajesh Kumar (Admin)",
      email: "admin@apnisite.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Amit Sharma (Supervisor)",
      email: "supervisor@apnisite.com",
      password: supervisorPassword,
      role: "SUPERVISOR",
    },
  });

  await prisma.user.create({
    data: {
      name: "Vikram Singh (Supervisor)",
      email: "sup2@apnisite.com",
      password: supervisorPassword,
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
