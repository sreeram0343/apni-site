import { getDashboardStats } from "@/lib/queries/reports";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTable } from "@/components/dashboard/recent-table";
import { getServerSession } from "@/auth/server-session";
import { redirect } from "next/navigation";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session || session.role !== "BUILDER_ADMIN") {
    redirect("/login");
  }

  const stats = await getDashboardStats();
  const { 
    totalReports, 
    todaysWorkers, 
    reportsSubmittedToday, 
    recentReports,
    activeSupervisors,
    error
  } = stats;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Hello, Admin 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Here&apos;s what&apos;s happening at your construction site today.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 p-5 rounded-2xl text-xs font-semibold border border-red-150 flex flex-col gap-1 select-none">
          <p className="font-bold flex items-center gap-1.5">
            <span>⚠️ Database Connectivity Warning</span>
          </p>
          <p className="text-red-600 font-medium">
            Could not load site data: &quot;{error}&quot;. 
            Please ensure you have configured `DATABASE_URL` in your Vercel site settings, and that your database host is active.
          </p>
        </div>
      )}

      <StatsCards
        totalReports={totalReports}
        todaysWorkers={todaysWorkers}
        reportsSubmittedToday={reportsSubmittedToday}
        activeSupervisors={activeSupervisors}
      />

      <div>
        <RecentTable reports={recentReports} />
      </div>
    </div>
  );
}
