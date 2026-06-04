import Link from "next/link";
import { Eye, Calendar, User, Users, Clipboard } from "lucide-react";

interface Report {
  id: string;
  date: Date;
  workersPresent: number;
  tasksCompleted: string;
  supervisor: { name: string | null };
}

interface RecentTableProps {
  reports: Report[];
}

export function RecentTable({ reports }: RecentTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden select-none">
      <div className="border-b border-slate-200 px-6 py-4.5 flex items-center justify-between bg-white">
        <h3 className="text-base font-extrabold text-slate-900">Recent Reports</h3>
        <Link
          href="/dashboard/reports"
          className="text-xs font-bold text-amber-500 hover:text-amber-600 hover:underline transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          View All
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="flex h-36 items-center justify-center text-slate-400 text-sm font-medium bg-slate-50/20">
          No reports logged yet today.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Supervisor</th>
                <th className="px-6 py-3.5 text-center">Workers</th>
                <th className="px-6 py-3.5 hidden lg:table-cell">Tasks Completed</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/60 transition-all">
                  
                  {/* Date Column */}
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-slate-900 font-bold">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {new Date(report.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Supervisor Column */}
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <User className="h-4 w-4 text-slate-400" />
                      {report.supervisor.name || "Supervisor"}
                    </span>
                  </td>

                  {/* Workers Count Column */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-0.5 text-xs font-bold border border-slate-200 text-slate-700">
                      <Users className="h-3 w-3 text-slate-400" />
                      {report.workersPresent}
                    </span>
                  </td>

                  {/* Tasks Completed Column (Desktop only) */}
                  <td className="px-6 py-4 hidden lg:table-cell max-w-xs">
                    <span className="flex items-center gap-1.5 text-slate-500 font-medium truncate">
                      <Clipboard className="h-4 w-4 text-slate-350 flex-shrink-0" />
                      {report.tasksCompleted}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-bold text-green-700 shadow-soft">
                      Submitted
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/reports/${report.id}`}
                      className="inline-flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200/60 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
                      title="View Report Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
