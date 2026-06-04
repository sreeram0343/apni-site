import { getDashboardStats } from "@/lib/actions/reports";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTable } from "@/components/dashboard/recent-table";

export const revalidate = 0; // Dynamic server-side rendering

export default async function AdminDashboardPage() {
  const { 
    totalReports, 
    todaysWorkers, 
    reportsSubmittedToday, 
    recentReports,
    activeSupervisors
  } = await getDashboardStats();

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
