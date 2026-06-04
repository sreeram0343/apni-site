"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { reportSchema } from "@/lib/validations";

// Helper to save uploaded file
async function saveFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0 || !(file instanceof File)) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const name = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${Date.now()}_${name}${ext}`;
  const filepath = path.join(uploadDir, filename);

  await fs.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
}

export async function createReportAction(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || session.user.role !== "SUPERVISOR") {
    return { error: "Unauthorized. Only supervisors can submit reports." };
  }

  const workersPresent = formData.get("workersPresent");
  const tasksCompleted = formData.get("tasksCompleted") as string;
  const materialsUsed = formData.get("materialsUsed") as string;

  const attendancePhotoFile = formData.get("attendancePhoto") as File | null;
  const progressPhoto1File = formData.get("progressPhoto1") as File | null;
  const progressPhoto2File = formData.get("progressPhoto2") as File | null;

  const parsedData = reportSchema.safeParse({
    workersPresent,
    tasksCompleted,
    materialsUsed,
    attendancePhoto: attendancePhotoFile && attendancePhotoFile.size > 0 ? "provided" : "",
    progressPhoto1: progressPhoto1File && progressPhoto1File.size > 0 ? "provided" : undefined,
    progressPhoto2: progressPhoto2File && progressPhoto2File.size > 0 ? "provided" : undefined,
  });

  if (!parsedData.success) {
    const errorMap = parsedData.error.flatten().fieldErrors;
    const firstErrorMessage = Object.values(errorMap)[0]?.[0] || "Invalid form values";
    return { error: firstErrorMessage };
  }

  try {
    const attendancePhotoPath = await saveFile(attendancePhotoFile);
    if (!attendancePhotoPath) {
      return { error: "Attendance photo upload is required." };
    }

    const progressPhoto1Path = await saveFile(progressPhoto1File);
    const progressPhoto2Path = await saveFile(progressPhoto2File);

    await db.dailyReport.create({
      data: {
        workersPresent: Number(workersPresent),
        tasksCompleted,
        materialsUsed,
        attendancePhoto: attendancePhotoPath,
        progressPhoto1: progressPhoto1Path,
        progressPhoto2: progressPhoto2Path,
        supervisorId: session.user.id,
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/supervisor");
    revalidatePath("/dashboard/reports");

    return { success: true };
  } catch (error) {
    console.error("Failed to create report:", error);
    return { error: "Failed to submit daily report. Please try again." };
  }
}

export async function getDashboardStats() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = session.user.role === "ADMIN";
  const userId = session.user.id;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const filterQuery = isAdmin ? {} : { supervisorId: userId };
  const filterQueryToday = isAdmin 
    ? { date: { gte: startOfToday, lte: endOfToday } } 
    : { supervisorId: userId, date: { gte: startOfToday, lte: endOfToday } };

  const [totalReports, reportsToday, recentReports, activeSupervisors] = await Promise.all([
    db.dailyReport.count({ where: filterQuery }),
    db.dailyReport.findMany({
      where: filterQueryToday,
      select: { workersPresent: true },
    }),
    db.dailyReport.findMany({
      where: filterQuery,
      include: {
        supervisor: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      take: 5,
    }),
    db.user.count({ where: { role: "SUPERVISOR" } }),
  ]);

  const todaysWorkers = reportsToday.reduce((sum, r) => sum + r.workersPresent, 0);
  const reportsSubmittedToday = reportsToday.length;

  return {
    totalReports,
    todaysWorkers,
    reportsSubmittedToday,
    recentReports,
    activeSupervisors,
  };
}

export async function getReportsList(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = session.user.role === "ADMIN";
  const userId = session.user.id;
  
  const page = params.page || 1;
  const limit = params.limit || 8;
  const skip = (page - 1) * limit;

  const where: Prisma.DailyReportWhereInput = {};

  if (!isAdmin) {
    where.supervisorId = userId;
  }

  if (params.search) {
    where.OR = [
      { tasksCompleted: { contains: params.search } },
      { materialsUsed: { contains: params.search } },
      { supervisor: { name: { contains: params.search } } },
    ];
  }

  const [reports, totalCount] = await Promise.all([
    db.dailyReport.findMany({
      where,
      include: {
        supervisor: { select: { name: true } },
      },
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    db.dailyReport.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    reports,
    meta: {
      totalCount,
      totalPages,
      currentPage: page,
    },
  };
}

export async function getReportDetail(id: string) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const isAdmin = session.user.role === "ADMIN";
  const userId = session.user.id;

  const report = await db.dailyReport.findUnique({
    where: { id },
    include: {
      supervisor: { select: { name: true, email: true } },
    },
  });

  if (!report) {
    return null;
  }

  if (!isAdmin && report.supervisorId !== userId) {
    throw new Error("Access Denied");
  }

  return report;
}
