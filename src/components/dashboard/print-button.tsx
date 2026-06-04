"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  const printStyles = `
    @media print {
      /* Hide sidebar navigation, buttons, and system controls */
      aside,
      header,
      button,
      nav,
      .print-hidden,
      .print\\:hidden {
        display: none !important;
      }
      
      /* Reset layout wrappers to full white page */
      html, body, main, .print-container {
        background: #ffffff !important;
        color: #0f172a !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        box-shadow: none !important;
      }

      /* Clean page spacing */
      main {
        padding: 2rem !important;
      }

      /* Force standard typography color modifications */
      h1, h2, h3, h4, span, p, div, td, th {
        color: #0f172a !important;
      }
      
      /* Subtitles color adjustments */
      .text-slate-400, .text-slate-500 {
        color: #475569 !important;
      }

      /* Restyle visual dark boxes into bordered elements */
      .rounded-xl, .rounded-2xl {
        background: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        box-shadow: none !important;
      }

      /* Remove background gradients */
      .bg-slate-900, .bg-slate-950, .bg-slate-900\\/50, .bg-slate-900\\/30, .bg-slate-950\\/40 {
        background-color: #ffffff !important;
        background: #ffffff !important;
        border-color: #cbd5e1 !important;
      }

      /* Adjust grid formatting for printer-friendly reading */
      .print-grid {
        display: block !important;
      }
      
      .print-grid > * {
        margin-bottom: 1.5rem !important;
        page-break-inside: avoid !important;
      }

      /* Clean images sizing */
      img {
        max-height: 220px !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 6px !important;
        page-break-inside: avoid !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <button
        onClick={handlePrint}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-850 hover:text-white transition-all cursor-pointer print:hidden"
      >
        <Printer className="h-4 w-4" />
        Export PDF
      </button>
    </>
  );
}
