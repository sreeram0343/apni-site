"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/lib/validations";
import { loginAction } from "@/lib/actions/auth";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        
        const result = await loginAction(null, formData);
        if (result && result.error) {
          setError(result.error);
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "";
        if (errorMessage && !errorMessage.includes("NEXT_REDIRECT")) {
          setError("Invalid email or password");
        }
      }
    });
  };

  const fillDemo = (role: "admin" | "supervisor") => {
    if (role === "admin") {
      setValue("email", "admin@apnisite.com");
      setValue("password", "password123");
    } else {
      setValue("email", "supervisor@apnisite.com");
      setValue("password", "password123");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-card border border-slate-100 animate-fade-in text-slate-900">
      {/* Card Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 tracking-wide">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="admin@apnisite.com"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              disabled={isPending}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 tracking-wide">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember / Forget */}
        <div className="flex items-center justify-between text-xs font-medium">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/20"
            />
            Remember me
          </label>
          <a href="#" className="text-amber-600 hover:text-amber-500 transition-colors">
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-500/10 hover:bg-amber-400 hover:shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <p className="text-center text-3xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
          Demo Accounts
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => fillDemo("admin")}
            className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-left cursor-pointer hover:bg-amber-50 hover:border-amber-200 transition-all"
          >
            <span className="block text-xs font-bold text-slate-900 group-hover:text-amber-700">
              Admin
            </span>
            <span className="block text-2xs text-slate-500 mt-1 truncate">
              admin@apnisite.com
            </span>
            <span className="block text-2xs text-slate-400 mt-0.5">
              password123
            </span>
          </div>
          <div
            onClick={() => fillDemo("supervisor")}
            className="group rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-left cursor-pointer hover:bg-amber-50 hover:border-amber-200 transition-all"
          >
            <span className="block text-xs font-bold text-slate-900 group-hover:text-amber-700">
              Supervisor
            </span>
            <span className="block text-2xs text-slate-500 mt-1 truncate">
              supervisor@apnisite.com
            </span>
            <span className="block text-2xs text-slate-400 mt-0.5">
              password123
            </span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-3xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} ApniSite. All rights reserved.
      </div>
    </div>
  );
}
