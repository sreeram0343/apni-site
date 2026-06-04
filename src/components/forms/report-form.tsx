"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { reportSchema } from "@/lib/validations";
import { createReportAction } from "@/lib/actions/reports";
import { Camera, Users, Clipboard, Wrench, AlertCircle, ArrowRight, X } from "lucide-react";

type ReportFormValues = z.infer<typeof reportSchema>;

export function DailyReportForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [files, setFiles] = useState<{
    attendance: File | null;
    progress1: File | null;
    progress2: File | null;
  }>({
    attendance: null,
    progress1: null,
    progress2: null,
  });

  const [fileKeys, setFileKeys] = useState<{
    attendance: number;
    progress1: number;
    progress2: number;
  }>({
    attendance: 0,
    progress1: 0,
    progress2: 0,
  });

  const [previews, setPreviews] = useState<{
    attendance: string | null;
    progress1: string | null;
    progress2: string | null;
  }>({
    attendance: null,
    progress1: null,
    progress2: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      workersPresent: 1,
      tasksCompleted: "",
      materialsUsed: "",
      attendancePhoto: "",
      progressPhoto1: "",
      progressPhoto2: "",
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "attendancePhoto" | "progressPhoto1" | "progressPhoto2"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(field, "provided", { shouldValidate: true });

      const previewKey = field === "attendancePhoto" ? "attendance" : field === "progressPhoto1" ? "progress1" : "progress2";
      setFiles((prev) => ({ ...prev, [previewKey]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [previewKey]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (field: "attendancePhoto" | "progressPhoto1" | "progressPhoto2") => {
    setValue(field, "", { shouldValidate: true });
    const previewKey = field === "attendancePhoto" ? "attendance" : field === "progressPhoto1" ? "progress1" : "progress2";
    setPreviews((prev) => ({ ...prev, [previewKey]: null }));
    setFiles((prev) => ({ ...prev, [previewKey]: null }));
    setFileKeys((prev) => ({ ...prev, [previewKey]: prev[previewKey] + 1 }));
  };

  const onSubmit = (data: ReportFormValues) => {
    const attendanceFile = files.attendance;

    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("workersPresent", String(data.workersPresent));
      formData.append("tasksCompleted", data.tasksCompleted);
      formData.append("materialsUsed", data.materialsUsed);

      if (attendanceFile) {
        formData.append("attendancePhoto", attendanceFile);
      }

      const progress1File = files.progress1;
      if (progress1File) {
        formData.append("progressPhoto1", progress1File);
      }

      const progress2File = files.progress2;
      if (progress2File) {
        formData.append("progressPhoto2", progress2File);
      }

      const result = await createReportAction(formData);
      if (result && result.error) {
        setError(result.error);
      } else {
        router.push(result.reportId ? `/dashboard/reports/${result.reportId}` : "/dashboard/supervisor");
        router.refresh();
      }
    });
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 select-none">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Form Fields Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-card space-y-6 text-slate-900">
        
        {/* Date Display (Auto-generated) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">
            Log Date
          </label>
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 font-bold select-none">
            {formattedDate}
          </div>
        </div>

        {/* Workers Present */}
        <div className="space-y-2 max-w-xs">
          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
            <Users className="h-4.5 w-4.5 text-amber-500" />
            Workers Present Today *
          </label>
          <input
            {...register("workersPresent", { valueAsNumber: true })}
            type="number"
            min="1"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all font-semibold"
            placeholder="e.g. 15"
          />
          {errors.workersPresent && (
            <p className="text-xs text-red-500 font-semibold mt-1">{errors.workersPresent.message}</p>
          )}
        </div>

        {/* Tasks Completed */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
            <Clipboard className="h-4.5 w-4.5 text-amber-500" />
            Tasks Completed Today *
          </label>
          <textarea
            {...register("tasksCompleted")}
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all resize-y leading-relaxed font-medium"
            placeholder="List completed tasks (e.g. Columns concreting, steel fixing)..."
          />
          {errors.tasksCompleted && (
            <p className="text-xs text-red-500 font-semibold mt-1">{errors.tasksCompleted.message}</p>
          )}
        </div>

        {/* Materials Used */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
            <Wrench className="h-4.5 w-4.5 text-amber-500" />
            Materials Consumed / Received *
          </label>
          <textarea
            {...register("materialsUsed")}
            rows={4}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all resize-y leading-relaxed font-medium"
            placeholder="List materials and quantities (e.g. Cement: 50 bags, Sand: 5 brass)..."
          />
          {errors.materialsUsed && (
            <p className="text-xs text-red-500 font-semibold mt-1">{errors.materialsUsed.message}</p>
          )}
        </div>
      </div>

      {/* Upload slots container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-card space-y-6 text-slate-900">
        <div>
          <h3 className="text-sm font-bold text-slate-700 tracking-wide uppercase">
            Upload Site Media
          </h3>
          <p className="text-3xs text-slate-400 mt-1 font-semibold">
            JPG, PNG or WEBP (Max. 5MB)
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          
          {/* Attendance Photo slot */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 tracking-wide">
              Attendance Photo
            </label>
            <div className="relative">
              <input
                key={fileKeys.attendance}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "attendancePhoto")}
                className="hidden"
                id="attendancePhoto-upload"
              />
              {previews.attendance ? (
                <div className="relative aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={previews.attendance}
                    alt="Attendance Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto("attendancePhoto")}
                    className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-all shadow-md cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="attendancePhoto-upload"
                  className="flex flex-col items-center justify-center aspect-video rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-amber-500/50 transition-all cursor-pointer select-none"
                >
                  <Camera className="h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 font-bold">Upload Photo</span>
                  <span className="text-3xs text-slate-400 mt-1 font-semibold">Optional</span>
                </label>
              )}
            </div>
            {errors.attendancePhoto && (
              <p className="text-xs text-red-500 font-semibold mt-1">{errors.attendancePhoto.message}</p>
            )}
          </div>

          {/* Progress Photo 1 slot */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 tracking-wide">
              Progress Photo 1
            </label>
            <div className="relative">
              <input
                key={fileKeys.progress1}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "progressPhoto1")}
                className="hidden"
                id="progress1-upload"
              />
              {previews.progress1 ? (
                <div className="relative aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={previews.progress1}
                    alt="Progress 1 Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto("progressPhoto1")}
                    className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-all shadow-md cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="progress1-upload"
                  className="flex flex-col items-center justify-center aspect-video rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-amber-500/50 transition-all cursor-pointer select-none"
                >
                  <Camera className="h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 font-bold">Upload Photo</span>
                  <span className="text-3xs text-slate-400 mt-1 font-semibold">Optional</span>
                </label>
              )}
            </div>
          </div>

          {/* Progress Photo 2 slot */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 tracking-wide">
              Progress Photo 2
            </label>
            <div className="relative">
              <input
                key={fileKeys.progress2}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "progressPhoto2")}
                className="hidden"
                id="progress2-upload"
              />
              {previews.progress2 ? (
                <div className="relative aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                  <img
                    src={previews.progress2}
                    alt="Progress 2 Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto("progressPhoto2")}
                    className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-all shadow-md cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="progress2-upload"
                  className="flex flex-col items-center justify-center aspect-video rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-amber-500/50 transition-all cursor-pointer select-none"
                >
                  <Camera className="h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 font-bold">Upload Photo</span>
                  <span className="text-3xs text-slate-400 mt-1 font-semibold">Optional</span>
                </label>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Button Panel */}
      <div className="flex justify-end gap-3.5 select-none">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer"
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-amber-400 hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
          ) : (
            <>
              Submit Report <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
