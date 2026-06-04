"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { useAuth } from "@/auth/auth-context";
import { Shield, Users, AlertCircle, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field validation errors
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    startTransition(async () => {
      try {
        const result = await loginAction({ email, password });
        if (result.error) {
          setError(result.error);
        } else if (result.success && result.user) {
          // Update client auth context state
          login(result.user);
          
          // Redirect based on role
          if (result.user.role === "BUILDER_ADMIN") {
            router.push("/dashboard/admin");
          } else {
            router.push("/dashboard/supervisor");
          }
          router.refresh();
        }
      } catch (err) {
        console.error("Login submission error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setValidationErrors({});

    startTransition(async () => {
      try {
        const result = await loginAction({ email: demoEmail, password: demoPass });
        if (result.error) {
          setError(result.error);
        } else if (result.success && result.user) {
          login(result.user);
          if (result.user.role === "BUILDER_ADMIN") {
            router.push("/dashboard/admin");
          } else {
            router.push("/dashboard/supervisor");
          }
          router.refresh();
        }
      } catch (err) {
        console.error("Quick login error:", err);
        setError("Quick login failed. Please try again.");
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 animate-fade-in text-slate-900">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Sign in to your ApniSite console below
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-100">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="e.g. admin@apnisite.com"
              disabled={isPending}
              className={`w-full rounded-2xl border ${
                validationErrors.email ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"
              } bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:opacity-60`}
            />
          </div>
          {validationErrors.email && (
            <p className="text-2xs font-bold text-red-600 pl-1">{validationErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 block">Password</label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="Enter your password"
              disabled={isPending}
              className={`w-full rounded-2xl border ${
                validationErrors.password ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200"
              } bg-slate-50 py-3.5 pl-11 pr-11 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:opacity-60`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isPending}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-2xs font-bold text-red-600 pl-1">{validationErrors.password}</p>
          )}
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 py-4 px-4 text-sm font-bold shadow-md shadow-amber-500/10 hover:shadow-lg transition-all disabled:opacity-65 select-none cursor-pointer"
        >
          {isPending ? (
            <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
          ) : (
            <>
              Sign In to Portal
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8 select-none">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-3xs font-black uppercase tracking-widest text-slate-400">
          <span className="bg-white px-3">Quick Login (Demo Accounts)</span>
        </div>
      </div>

      {/* Quick Login Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 select-none">
        <button
          type="button"
          onClick={() => handleQuickLogin("admin@apnisite.com", "password123")}
          disabled={isPending}
          className="group flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-amber-50 hover:border-amber-500/40 text-center transition-all cursor-pointer disabled:opacity-50"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/50 text-amber-600 group-hover:bg-amber-100 transition-colors">
            <Shield className="h-4 w-4" />
          </div>
          <span className="block text-3xs font-extrabold text-slate-900 mt-2">
            Builder Admin
          </span>
          <span className="block text-[10px] font-medium text-slate-400 group-hover:text-slate-500 mt-0.5">
            admin@apnisite.com
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickLogin("supervisor@apnisite.com", "password123")}
          disabled={isPending}
          className="group flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-amber-50 hover:border-amber-500/40 text-center transition-all cursor-pointer disabled:opacity-50"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/50 text-amber-600 group-hover:bg-amber-100 transition-colors">
            <Users className="h-4 w-4" />
          </div>
          <span className="block text-3xs font-extrabold text-slate-900 mt-2">
            Supervisor 1
          </span>
          <span className="block text-[10px] font-medium text-slate-400 group-hover:text-slate-500 mt-0.5">
            supervisor@apnisite.com
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickLogin("sup2@apnisite.com", "password123")}
          disabled={isPending}
          className="group flex flex-col items-center justify-center p-2.5 rounded-2xl border border-slate-200/80 bg-slate-50 hover:bg-amber-50 hover:border-amber-500/40 text-center transition-all cursor-pointer disabled:opacity-50"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100/50 text-amber-600 group-hover:bg-amber-100 transition-colors">
            <Users className="h-4 w-4" />
          </div>
          <span className="block text-3xs font-extrabold text-slate-900 mt-2">
            Supervisor 2
          </span>
          <span className="block text-[10px] font-medium text-slate-400 group-hover:text-slate-500 mt-0.5">
            sup2@apnisite.com
          </span>
        </button>
      </div>
    </div>
  );
}
