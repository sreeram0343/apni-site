import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.dailyReport.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  const admin = await prisma.user.create({
    data: {
      id: "builder-admin-id",
      name: "Builder Admin",
      email: "admin@apnisite.com",
      role: "BUILDER_ADMIN",
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      id: "site-supervisor-id",
      name: "Site Supervisor",
      email: "supervisor@apnisite.com",
      role: "SITE_SUPERVISOR",
    },
  });

  const supervisor2 = await prisma.user.create({
    data: {
      id: "site-supervisor-2-id",
      name: "Site Supervisor 2",
      email: "sup2@apnisite.com",
      role: "SITE_SUPERVISOR",
    },
  });

  const today = new Date();
  today.setHours(9, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  await prisma.dailyReport.createMany({
    data: [
      {
        date: today,
        workersPresent: 18,
        tasksCompleted:
          "Foundation excavation completed.\nPCC work done for column.\nSteel binding for column started.",
        materialsUsed:
          "Cement bags: 50\nSteel: 500 kg\nSand: 2 trolley\nAggregate: 3 trolley",
        attendancePhoto: "/construction_hero.png",
        progressPhoto1: "/construction_hero.png",
        progressPhoto2: "/construction_hero.png",
        supervisorId: supervisor.id,
      },
      {
        date: yesterday,
        workersPresent: 20,
        tasksCompleted:
          "Concrete mixing and casting completed.\nShuttering checked on east block.",
        materialsUsed: "Ready mix concrete: 8 cubic meters\nBinding wire: 15 kg",
        attendancePhoto: null,
        progressPhoto1: "/construction_hero.png",
        progressPhoto2: null,
        supervisorId: supervisor.id,
      },
      {
        date: twoDaysAgo,
        workersPresent: 16,
        tasksCompleted:
          "Brick work for ground floor completed.\nSite housekeeping completed.",
        materialsUsed: "Bricks: 2,000 units\nMortar mix: 12 batches",
        attendancePhoto: "/construction_hero.png",
        progressPhoto1: "/construction_hero.png",
        progressPhoto2: "/construction_hero.png",
        supervisorId: supervisor.id,
      },
    ],
  });

  console.log("Users created.");
  console.log("Sample reports created.");
  console.log(`Admin ready: ${admin.email}`);
  console.log(`Supervisor ready: ${supervisor.email}`);
  console.log(`Supervisor 2 ready: ${supervisor2.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
