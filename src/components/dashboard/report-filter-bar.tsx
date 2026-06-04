"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface ReportFilterBarProps {
  initialSearch?: string;
}

export function ReportFilterBar({ initialSearch = "" }: ReportFilterBarProps) {
  const router = useRouter();

  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (search.trim()) {
      params.set("search", search.trim());
    }
    
    params.set("page", "1"); // Reset pagination on search
    router.push(`/dashboard/reports?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    router.push("/dashboard/reports");
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="flex flex-col gap-3 sm:flex-row items-stretch sm:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-card max-w-2xl select-none"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by supervisor or keywords..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-450 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 sm:flex-initial rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 shadow-soft transition-all cursor-pointer"
        >
          Search
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center"
          title="Reset filters"
        >
          <SlidersHorizontal className="h-4.5 w-4.5" />
        </button>
      </div>
    </form>
  );
}
