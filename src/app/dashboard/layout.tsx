import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { redirect } from "next/navigation";
import { Calendar, Bell } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Generate initials for avatar
  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      <Sidebar role={session.user.role} userName={session.user.name} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-16 md:pt-0 md:pl-64 min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-header print-hidden">
          {/* Left spacer / optional branding/breadcrumbs search */}
          <div className="hidden sm:block text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Daily Site Reporting Platform
          </div>
          
          {/* Right Header items */}
          <div className="flex items-center gap-4 ml-auto sm:ml-0 select-none">
            
            {/* Dynamic Date Badge */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              {formattedDate}
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200/50 bg-white transition-all cursor-pointer">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 h-8">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-extrabold text-slate-900 leading-tight">
                  {session.user.name}
                </span>
                <span className="block text-3xs font-semibold text-slate-400 mt-0.5">
                  {session.user.role === "ADMIN" ? "Builder" : "Supervisor"}
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-900 text-amber-400 border border-slate-800 flex items-center justify-center text-xs font-bold shadow-soft select-none">
                {initials}
              </div>
            </div>

          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 p-6 md:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
