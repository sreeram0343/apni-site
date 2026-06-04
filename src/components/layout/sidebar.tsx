"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";
import { 
  HardHat, 
  LayoutDashboard, 
  FileText, 
  Clipboard, 
  PlusCircle, 
  Users as UsersIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

interface SidebarProps {
  role: string;
  userName: string;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { 
      href: role === "ADMIN" ? "/dashboard/admin" : "/dashboard/supervisor", 
      label: "Dashboard", 
      icon: LayoutDashboard 
    },
    { 
      href: "/dashboard/reports", 
      label: "Daily Reports", 
      icon: FileText 
    },
    { 
      href: "/dashboard/reports", 
      label: "Reports", 
      icon: Clipboard 
    },
    { 
      href: "/dashboard/reports/new", 
      label: "Add Report", 
      icon: PlusCircle,
      supervisorOnly: true 
    },
    { 
      href: "/dashboard/users", 
      label: "Users", 
      icon: UsersIcon 
    },
    { 
      href: "/dashboard/settings", 
      label: "Settings", 
      icon: SettingsIcon 
    },
  ];

  const filteredItems = menuItems.filter(item => {
    if (item.supervisorOnly && role !== "SUPERVISOR") return false;
    return true;
  });

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 md:hidden text-white w-full fixed top-0 left-0 z-40 print-hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500 text-slate-950">
            <HardHat className="h-4 w-4" />
          </div>
          <span className="font-extrabold tracking-tight">
            Apni<span className="text-amber-400">Site</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed bottom-0 top-0 left-0 z-40 flex w-64 flex-col bg-slate-sidebar transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0 top-16 md:top-0" : "-translate-x-full md:translate-x-0"
        } h-full print-hidden`}
      >
        {/* Brand Logo Header (Desktop) */}
        <div className="hidden h-16 items-center gap-2 px-6 border-b border-slate-800/60 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-500 text-slate-955 shadow-sm">
            <HardHat className="h-4.5 w-4.5" />
          </div>
          <span className="font-extrabold text-white tracking-tight text-base">
            Apni<span className="text-amber-400">Site</span>
          </span>
        </div>

        {/* Sidebar Links Menu */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {filteredItems.map((link, index) => {
            const Icon = link.icon;
            
            // To ensure dashboard or report subpaths trigger highlight, match pathname
            const isActive = pathname === link.href || 
              (link.label === "Reports" && pathname.startsWith("/dashboard/reports") && pathname !== "/dashboard/reports/new");

            return (
              <Link
                key={index}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Bottom Panel */}
        <div className="border-t border-slate-800/60 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
