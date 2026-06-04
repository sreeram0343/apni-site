import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { getServerSession } from "@/auth/server-session";

export async function getDashboardStats() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const isAdmin = session.role === "BUILDER_ADMIN";
  const userId = session.id;

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
    db.user.count({ where: { role: "SITE_SUPERVISOR" } }),
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
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const isAdmin = session.role === "BUILDER_ADMIN";
  const userId = session.id;
  
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
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const isAdmin = session.role === "BUILDER_ADMIN";
  const userId = session.id;

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
