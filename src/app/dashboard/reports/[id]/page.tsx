import { getReportDetail } from "@/lib/queries/reports";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, CheckCircle2, ClipboardList, Package, Users, Clock } from "lucide-react";
import { ImageGallery } from "@/components/dashboard/image-gallery";
import { PrintButton } from "@/components/dashboard/print-button";

interface ReportDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 0; // Dynamic server-side rendering

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  let report;

  try {
    report = await getReportDetail(id);
  } catch (error) {
    console.error("Access denied or report not found:", error);
    notFound();
  }

  if (!report) {
    notFound();
  }

  const tasksList = report.tasksCompleted
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const materialsList = report.materialsUsed
    .split("\n")
    .map((m) => m.trim())
    .filter((m) => m.length > 0);

  const reportDate = new Date(report.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const submittedAtFormatted = new Date(report.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) + ", " + new Date(report.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-8 print-container animate-fade-in max-w-5xl text-slate-900 select-none">
      
      {/* Top Navigation & Status Block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 print-hidden">
        <div>
          {/* Breadcrumbs */}
          <div className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-1.5">
            <span>Dashboard</span>
            <span>&gt;</span>
            <span>Reports</span>
            <span>&gt;</span>
            <span className="text-slate-500">Report Details</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Report Details</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="inline-flex rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-bold text-green-700 shadow-soft">
            Submitted
          </span>
          <PrintButton />
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid gap-8 lg:grid-cols-3 print-grid">
        
        {/* Left Column: Report Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-card space-y-6">
            
            {/* Row 1: Date & Supervisor */}
            <div className="grid gap-6 sm:grid-cols-2 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-350" />
                  Date
                </span>
                <span className="block text-sm font-extrabold text-slate-900">
                  {reportDate}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-slate-355" />
                  Supervisor
                </span>
                <span className="block text-sm font-extrabold text-slate-900">
                  {report.supervisor.name}
                </span>
              </div>
            </div>

            {/* Row 2: Workers Present */}
            <div className="border-b border-slate-100 pb-5 space-y-1">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-350" />
                Number of Workers
              </span>
              <span className="block text-sm font-extrabold text-slate-900">
                {report.workersPresent} Workers Onsite
              </span>
            </div>

            {/* Row 3: Tasks Completed */}
            <div className="border-b border-slate-100 pb-5 space-y-2.5">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ClipboardList className="h-3.5 w-3.5 text-slate-350" />
                Tasks Completed
              </span>
              {tasksList.length === 0 ? (
                <p className="text-slate-450 text-sm font-medium">No tasks logged.</p>
              ) : (
                <ul className="space-y-3.5">
                  {tasksList.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-650 font-medium">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Row 4: Materials Used */}
            <div className="border-b border-slate-100 pb-5 space-y-2.5">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Package className="h-3.5 w-3.5 text-slate-350" />
                Materials Used
              </span>
              {materialsList.length === 0 ? (
                <p className="text-slate-450 text-sm font-medium">No materials logged.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {materialsList.map((material, idx) => {
                    const parts = material.split(":");
                    const name = parts[0]?.trim() || material;
                    const quantity = parts[1]?.trim() || "";

                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-center"
                      >
                        <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
                          Material
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                          {name}
                        </span>
                        {quantity && (
                          <span className="inline-block mt-2 w-fit rounded-lg bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-500/10">
                            {quantity}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Row 5: Submitted At Timestamp */}
            <div className="space-y-1">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-350" />
                Submitted At
              </span>
              <span className="block text-sm font-bold text-slate-500">
                {submittedAtFormatted}
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: Photo Panels */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Attendance Photo Display */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Attendance Photo
            </h3>
            <ImageGallery
              images={report.attendancePhoto ? [{ label: "Attendance Photo", src: report.attendancePhoto }] : []}
              gridClassName="grid grid-cols-1"
            />
          </div>

          {/* Progress Photos Display */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
              Progress Photos
            </h3>
            <ImageGallery
              images={[
                report.progressPhoto1 && { label: "Progress Photo 1", src: report.progressPhoto1 },
                report.progressPhoto2 && { label: "Progress Photo 2", src: report.progressPhoto2 },
              ].filter(Boolean) as { label: string; src: string }[]}
              gridClassName="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
            />
          </div>

        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex justify-start pb-8 print-hidden">
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-650 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer shadow-soft"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to Reports
        </Link>
      </div>

    </div>
  );
}
