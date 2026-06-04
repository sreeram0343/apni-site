"use client";

import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface ImageItem {
  label: string;
  src: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
  gridClassName?: string;
}

export function ImageGallery({
  images,
  gridClassName = "grid gap-4 sm:grid-cols-2",
}: ImageGalleryProps) {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-slate-400 text-xs font-semibold py-4 text-center">
        No images uploaded
      </div>
    );
  }

  return (
    <>
      <div className={gridClassName}>
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setActivePhoto(img.src)}
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all hover:border-amber-500/40"
          >
            <img
              src={img.src}
              alt={img.label}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md">
                <ZoomIn className="h-3.5 w-3.5" />
                Zoom View
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/70 to-transparent p-4">
              <span className="text-3xs font-extrabold text-white block uppercase tracking-wider">
                {img.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm select-none">
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 rounded-full bg-slate-900 border border-slate-800 p-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
            <img
              src={activePhoto}
              alt="Enlarged view"
              className="max-h-[85vh] max-w-[90vw] object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
