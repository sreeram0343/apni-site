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

  const sup1 = await prisma.user.create({
    data: {
      name: "Amit Sharma (Supervisor)",
      email: "sup1@apnisite.com",
      password: supervisorPassword,
      role: "SUPERVISOR",
    },
  });

  const sup2 = await prisma.user.create({
    data: {
      name: "Vikram Singh (Supervisor)",
      email: "sup2@apnisite.com",
      password: supervisorPassword,
      role: "SUPERVISOR",
    },
  });

  console.log("Users created.");

  // Create historical reports for the last 14 days
  const today = new Date();

  // Tasks and materials templates
  const tasksTemplates = [
    ["Excavation completed for Block A", "PCC laying in progress", "Steel reinforcement delivery checked"],
    ["Foundation concrete casting", "Curing of foundation columns started", "Brickwork material sorting"],
    ["Column reinforcement assembly", "Shuttering work for first floor slab", "Electrical conduit laying"],
    ["Slab concrete pouring for Floor 1", "Slab curing ongoing", "Plumbing pipe layout setup"],
    ["Brickwork for outer walls (Floor 1)", "Internal plastering started in Block B", "Safety rails installation"],
    ["Internal wall plastering (Floor 1)", "Floor tiling began in Block A", "Window frames installation started"],
    ["Exterior plastering in progress", "Tiling in Block A completed", "Sanitary fitting installation started"]
  ];

  const materialsTemplates = [
    ["Cement: 150 bags", "Sand: 10 brass", "Aggregates: 12 brass", "Steel rebars: 5 tons"],
    ["Cement: 200 bags", "Ready-Mix Concrete: 45 cum", "Waterproofing agent: 50L"],
    ["Binding wire: 50 kg", "Steel rebars: 8 tons", "Plywood sheets: 30 nos"],
    ["Cement: 250 bags", "Coarse sand: 15 brass", "Aggregates: 20 brass"],
    ["Bricks: 12,000 nos", "Cement: 80 bags", "River sand: 8 brass"],
    ["Tiles: 450 sqm", "Tile adhesive: 60 bags", "Grout: 15 kg"],
    ["PVC pipes: 120m", "Paint primer: 100L", "Putty: 15 bags"]
  ];

  // Loop back 14 days
  for (let i = 14; i >= 0; i--) {
    const reportDate = new Date(today);
    reportDate.setDate(today.getDate() - i);
    // Don't log reports on Sundays
    if (reportDate.getDay() === 0) continue;

    // Supervisor 1 Reports
    const workersSup1 = Math.floor(Math.random() * 15) + 20;
    const taskIndex1 = i % tasksTemplates.length;
    const materialIndex1 = i % materialsTemplates.length;

    await prisma.dailyReport.create({
      data: {
        date: reportDate,
        workersPresent: workersSup1,
        tasksCompleted: tasksTemplates[taskIndex1].join("\n"),
        materialsUsed: materialsTemplates[materialIndex1].join("\n"),
        attendancePhoto: "/uploads/attendance_placeholder.jpg",
        progressPhoto1: "/uploads/progress_placeholder_1.jpg",
        progressPhoto2: "/uploads/progress_placeholder_2.jpg",
        supervisorId: sup1.id,
        createdAt: reportDate,
      },
    });

    // Supervisor 2 Reports
    if (i !== 0) { // Assume supervisor 2 has not submitted today's report
      const workersSup2 = Math.floor(Math.random() * 12) + 15;
      const taskIndex2 = (i + 2) % tasksTemplates.length;
      const materialIndex2 = (i + 1) % materialsTemplates.length;

      await prisma.dailyReport.create({
        data: {
          date: reportDate,
          workersPresent: workersSup2,
          tasksCompleted: tasksTemplates[taskIndex2].join("\n"),
          materialsUsed: materialsTemplates[materialIndex2].join("\n"),
          attendancePhoto: "/uploads/attendance_placeholder.jpg",
          progressPhoto1: "/uploads/progress_placeholder_1.jpg",
          progressPhoto2: "/uploads/progress_placeholder_2.jpg",
          supervisorId: sup2.id,
          createdAt: reportDate,
        },
      });
    }
  }

  console.log("Historical reports seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
