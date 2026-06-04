"use client";

import React, { useEffect } from "react";
import { useAuth } from "./auth-context";
import { UserRole } from "./auth-types";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackUrl?: string;
}

export function RoleGuard({ children, allowedRoles, fallbackUrl = "/" }: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!allowedRoles.includes(user.role)) {
        router.push(fallbackUrl);
      }
    }
  }, [user, loading, router, allowedRoles, fallbackUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
          <span className="text-xs text-slate-500 font-semibold">Validating access...</span>
        </div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
