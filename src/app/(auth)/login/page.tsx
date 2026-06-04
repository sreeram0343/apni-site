import { LoginForm } from "@/components/forms/login-form";
import { getServerSession } from "@/auth/server-session";
import { HardHat, Check } from "lucide-react";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session?.role === "BUILDER_ADMIN") {
    redirect("/dashboard/admin");
  }

  if (session?.role === "SITE_SUPERVISOR") {
    redirect("/dashboard/supervisor");
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left Panel: Desktop Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white bg-slate-950 overflow-hidden select-none">
        {/* Scaffold Photo with Dark Blend */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('/construction_hero.png')" }}
        />
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        
        {/* Branding header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-955 shadow-md">
            <HardHat className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            Apni<span className="text-amber-400">Site</span>
          </span>
        </div>

        {/* Main taglines and highlights */}
        <div className="relative z-10 max-w-lg mb-12 space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight xl:text-5xl">
              Smart Daily Site <br />Reporting Platform
            </h1>
            <p className="text-slate-350 text-base font-medium max-w-md leading-relaxed">
              Track daily workforce attendance, site progress, and completed tasks from a single dashboard.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-800/40">
            {[
              "Daily Reports",
              "Progress Photos",
              "Workforce Tracking",
              "Dashboard Analytics"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200 font-bold">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 flex-shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer line */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} ApniSite. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Content Card & Responsive Mobile Hero */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50 select-none">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Hero Header - stacks above login form on smaller viewports */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-4 mb-2 animate-fade-in">
            <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-2xl border border-slate-800 shadow-soft">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-slate-955 shadow-sm">
                <HardHat className="h-4.5 w-4.5" />
              </div>
              <span className="font-extrabold text-base tracking-tight">
                Apni<span className="text-amber-400">Site</span>
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Smart Daily Site Reporting Platform
              </h1>
              <p className="text-slate-500 text-sm font-medium px-4 leading-relaxed">
                Track daily workforce attendance, site progress, and completed tasks from a single dashboard.
              </p>
            </div>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
