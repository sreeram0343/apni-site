import { FileText, Users, ClipboardCheck, UserCheck } from "lucide-react";

interface StatsCardsProps {
  totalReports: number;
  todaysWorkers: number;
  reportsSubmittedToday: number;
  activeSupervisors?: number;
}

export function StatsCards({
  totalReports,
  todaysWorkers,
  reportsSubmittedToday,
  activeSupervisors = 0,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Reports",
      value: totalReports,
      desc: "All time reports",
      icon: ClipboardCheck,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      label: "Today's Workers",
      value: todaysWorkers,
      desc: "Workers on site today",
      icon: Users,
      color: "text-green-600 bg-green-50 border-green-100",
    },
    {
      label: "Reports Submitted Today",
      value: reportsSubmittedToday,
      desc: "Reports submitted",
      icon: FileText,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Active Supervisors",
      value: activeSupervisors,
      desc: "Total supervisors",
      icon: UserCheck,
      color: "text-orange-600 bg-orange-50 border-orange-100",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 select-none">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-card hover:shadow-lg transition-all duration-200"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {stat.value}
              </h3>
              <p className="text-2xs font-semibold text-slate-400">
                {stat.desc}
              </p>
            </div>
            <div className={`rounded-full p-3.5 ${stat.color} border shadow-soft flex-shrink-0`}>
              <Icon className="h-5.5 w-5.5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
