import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const reportSchema = z.object({
  workersPresent: z.number().int().min(1, "Workers count must be at least 1"),
  tasksCompleted: z.string().min(5, "Please list at least one completed task (min 5 chars)"),
  materialsUsed: z.string().min(5, "Please list materials used (min 5 chars)"),
  attendancePhoto: z.string().optional().nullable(),
  progressPhoto1: z.string().optional().nullable(),
  progressPhoto2: z.string().optional().nullable(),
});

export const reportServerSchema = reportSchema.extend({
  workersPresent: z.coerce.number().int().min(1, "Workers count must be at least 1"),
});
