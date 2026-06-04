import { LoginForm } from "@/components/forms/login-form";
import { HardHat } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Left Panel: Scaffolding Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 text-white bg-slate-950 overflow-hidden">
        {/* Scaffold Photo with Dark Blend */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('/construction_hero.png')" }}
        />
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        
        {/* Branding header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-md">
            <HardHat className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight">
            Apni<span className="text-amber-400">Site</span>
          </span>
        </div>

        {/* Main taglines */}
        <div className="relative z-10 max-w-lg mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight xl:text-5xl">
            Smart Daily Site <br />Reporting Platform
          </h1>
          <p className="text-slate-300 text-base font-medium max-w-md">
            Track progress, Stay informed. <br />Build better, every day.
          </p>
        </div>

        {/* Footer line */}
        <div className="relative z-10 text-xs text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} ApniSite. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Content Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
