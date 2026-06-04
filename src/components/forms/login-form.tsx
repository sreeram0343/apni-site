"use client";

import { useState, useTransition } from "react";
import { loginWithGoogleAction } from "@/lib/actions/auth";
import { Shield, Users, AlertCircle } from "lucide-react";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setError(null);
    startTransition(async () => {
      try {
        await loginWithGoogleAction();
      } catch (err) {
        console.error("Google sign in failed:", err);
        setError("Could not initiate Google Authentication. Please try again.");
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-card border border-slate-100 animate-fade-in text-slate-900">
      {/* Card Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Portal Access
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Select your role to sign in with Google
        </p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Builder (Admin) Option */}
        <button
          onClick={handleGoogleLogin}
          disabled={isPending}
          className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-soft hover:bg-slate-50 hover:border-amber-500/50 hover:ring-2 hover:ring-amber-500/10 transition-all disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900">
                Continue as Builder
              </span>
              <span className="block text-2xs text-slate-400 font-medium">
                Admin dashboard and report analytics
              </span>
            </div>
          </div>
          <svg className="h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </button>

        {/* Supervisor Option */}
        <button
          onClick={handleGoogleLogin}
          disabled={isPending}
          className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-soft hover:bg-slate-50 hover:border-amber-500/50 hover:ring-2 hover:ring-amber-500/10 transition-all disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-sm font-bold text-slate-900">
                Continue as Supervisor
              </span>
              <span className="block text-2xs text-slate-400 font-medium">
                Submit and track daily site logs
              </span>
            </div>
          </div>
          <svg className="h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </button>
      </div>

      <div className="mt-8 text-center text-3xs text-slate-400 font-medium leading-relaxed">
        Secure single sign-on powered by Google OAuth.<br />
        Existing accounts automatically retain their roles.
      </div>
    </div>
  );
}
