import { getReportsList } from "@/lib/queries/reports";
import { getServerSession } from "@/auth/server-session";
import { ReportFilterBar } from "@/components/dashboard/report-filter-bar";
import Link from "next/link";
import { Calendar, User, Users, Eye, PlusCircle, ArrowLeft, ArrowRight, Clipboard } from "lucide-react";
import { redirect } from "next/navigation";

interface ReportsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export const revalidate = 0; // Dynamic server-side rendering

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";

  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const reportsResult = await getReportsList({ page, limit: 8, search });
  const { reports, meta } = reportsResult;
  const error = (reportsResult as any).error;

  const isSupervisor = session.role === "SITE_SUPERVISOR";

  const buildPageUrl = (targetPage: number) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    query.set("page", targetPage.toString());
    return `/dashboard/reports?${query.toString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl select-none text-slate-900">
      
      {/* Title block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Daily Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {isSupervisor
              ? "Review and trace daily site log reports you submitted."
              : "Review and inspect all supervisor submissions."}
          </p>
        </div>
        {isSupervisor && (
          <Link
            href="/dashboard/reports/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-amber-400 hover:shadow-lg transition-all cursor-pointer"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Add Report
          </Link>
        )}
      </div>

      <ReportFilterBar initialSearch={search} />

      {error && (
        <div className="bg-red-50 text-red-800 p-5 rounded-2xl text-xs font-semibold border border-red-150 flex flex-col gap-1 select-none animate-pulse">
          <p className="font-bold flex items-center gap-1.5">
            <span>⚠️ Database Connectivity Warning</span>
          </p>
          <p className="text-red-600 font-medium">
            Could not load reports list: &quot;{error}&quot;. 
            Please ensure you have configured `DATABASE_URL` in your Netlify site settings, and that your database host is active.
          </p>
        </div>
      )}

      {reports.length === 0 && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center shadow-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-200">
            <Clipboard className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-900">No reports found</h3>
          <p className="mt-1 text-sm text-slate-400 max-w-xs mx-auto font-medium">
            We couldn&apos;t find any daily logs matching your search parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Supervisor</th>
                    <th className="px-6 py-3.5 text-center">Workers</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/60 transition-all">
                      
                      {/* Date */}
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

                      {/* Supervisor */}
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {report.supervisor.name}
                        </span>
                      </td>

                      {/* Workers count */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-0.5 text-xs font-bold border border-slate-200 text-slate-700">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          {report.workersPresent}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-bold text-green-700">
                          Submitted
                        </span>
                      </td>

                      {/* Details View */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/dashboard/reports/${report.id}`}
                          className="inline-flex items-center justify-center rounded-lg bg-slate-50 border border-slate-200/60 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Showing page <strong className="text-slate-900">{meta.currentPage}</strong> of{" "}
                <strong className="text-slate-900">{meta.totalPages}</strong>
              </span>
              <div className="flex gap-2">
                <Link
                  href={buildPageUrl(meta.currentPage - 1)}
                  className={`inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-650 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer ${
                    meta.currentPage <= 1 ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Prev
                </Link>
                <Link
                  href={buildPageUrl(meta.currentPage + 1)}
                  className={`inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-650 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer ${
                    meta.currentPage >= meta.totalPages ? "pointer-events-none opacity-40" : ""
                  }`}
                >
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
