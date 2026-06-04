import { DailyReportForm } from "@/components/forms/report-form";
import { getServerSession } from "@/auth/server-session";
import { redirect } from "next/navigation";

export default async function NewReportPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "SITE_SUPERVISOR") {
    redirect("/dashboard/admin");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Daily Site Report
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Record construction activities, worker counts, material logs, and submit required progress photos.
        </p>
      </div>

      <DailyReportForm />
    </div>
  );
}
