"use client";

import React, { useEffect } from "react";
import { useAuth } from "./auth-context";
import { useRouter } from "next/navigation";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
          <span className="text-xs text-slate-500 font-semibold">Loading portal...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
