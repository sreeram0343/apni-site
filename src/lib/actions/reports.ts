"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "@/auth/server-session";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { reportServerSchema } from "@/lib/validations";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function validateImageFile(file: File | null): string | null {
  if (!file || file.size === 0) return null;

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPG, PNG, or WEBP image uploads are allowed.";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Each uploaded image must be 5MB or smaller.";
  }

  return null;
}

// Helper to save uploaded file
async function saveFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0 || !(file instanceof File)) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", "reports");
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const name = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `${Date.now()}_${crypto.randomUUID()}_${name}${ext.toLowerCase()}`;
  const filepath = path.join(uploadDir, filename);

  await fs.writeFile(filepath, buffer);
  return `/uploads/reports/${filename}`;
}

export async function createReportAction(formData: FormData) {
  const session = await getServerSession();
  if (!session || session.role !== "SITE_SUPERVISOR") {
    return { error: "Unauthorized. Only supervisors can submit reports." };
  }

  const workersPresent = formData.get("workersPresent");
  const tasksCompleted = formData.get("tasksCompleted") as string;
  const materialsUsed = formData.get("materialsUsed") as string;

  const attendancePhotoFile = formData.get("attendancePhoto") as File | null;
  const progressPhoto1File = formData.get("progressPhoto1") as File | null;
  const progressPhoto2File = formData.get("progressPhoto2") as File | null;

  const uploadError =
    validateImageFile(attendancePhotoFile) ||
    validateImageFile(progressPhoto1File) ||
    validateImageFile(progressPhoto2File);

  if (uploadError) {
    return { error: uploadError };
  }

  const parsedData = reportServerSchema.safeParse({
    workersPresent,
    tasksCompleted,
    materialsUsed,
    attendancePhoto: attendancePhotoFile && attendancePhotoFile.size > 0 ? "provided" : undefined,
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
    const progressPhoto1Path = await saveFile(progressPhoto1File);
    const progressPhoto2Path = await saveFile(progressPhoto2File);

    const report = await db.dailyReport.create({
      data: {
        workersPresent: parsedData.data.workersPresent,
        tasksCompleted: parsedData.data.tasksCompleted,
        materialsUsed: parsedData.data.materialsUsed,
        attendancePhoto: attendancePhotoPath,
        progressPhoto1: progressPhoto1Path,
        progressPhoto2: progressPhoto2Path,
        supervisorId: session.id,
      },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/supervisor");
    revalidatePath("/dashboard/reports");

    return { success: true, reportId: report.id };
  } catch (error) {
    console.error("Failed to create report:", error);
    return { error: "Failed to submit daily report. Please try again." };
  }
}
