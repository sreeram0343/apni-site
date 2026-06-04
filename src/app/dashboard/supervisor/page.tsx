import { getDashboardStats } from "@/lib/actions/reports";
import { auth } from "@/lib/auth";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTable } from "@/components/dashboard/recent-table";
import Link from "next/link";
import { PlusCircle, Calendar } from "lucide-react";

export const revalidate = 0; // Dynamic server-side rendering

export default async function SupervisorDashboardPage() {
  const [session, stats] = await Promise.all([
    auth(),
    getDashboardStats(),
  ]);

  const firstName = session?.user?.name ? session.user.name.split(" ")[0] : "Supervisor";

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Hello, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Here&apos;s what&apos;s happening at your construction site today.
          </p>
        </div>
        <Link
          href="/dashboard/reports/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-955 shadow-md shadow-amber-500/10 hover:bg-amber-400 hover:shadow-amber-500/20 active:bg-amber-600 transition-all cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Submit Daily Report
        </Link>
      </div>

      {/* Today's reporting notification banner */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex gap-4 items-center">
          <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Reporting Status</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Daily reports must be submitted before shift closure.
            </p>
          </div>
        </div>
        <div>
          {stats.reportsSubmittedToday > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
              Report Submitted
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3.5 py-1.5 text-xs font-bold text-amber-700 animate-pulse">
              Pending Submission
            </span>
          )}
        </div>
      </div>

      <StatsCards
        totalReports={stats.totalReports}
        todaysWorkers={stats.todaysWorkers}
        reportsSubmittedToday={stats.reportsSubmittedToday}
        activeSupervisors={stats.activeSupervisors}
      />

      <div className="max-w-4xl">
        <RecentTable reports={stats.recentReports} />
      </div>
    </div>
  );
}
