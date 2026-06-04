import { DailyReportForm } from "@/components/forms/report-form";

export default function NewReportPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Daily Site Report
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Record construction activities, worker counts, material logs, and submit required progress photos.
        </p>
      </div>

      <DailyReportForm />
    </div>
  );
}
