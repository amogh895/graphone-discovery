import React from "react";

export default function Footer() {
  return (
    <footer id="app-footer" className="mt-20 border-t border-slate-900 bg-slate-950/20 py-8 px-6 text-center text-xs text-slate-500 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-red-600 rounded flex items-center justify-center font-bold text-xs text-white">G</div>
          <span className="font-semibold text-slate-400">graphone Discovery Platform</span>
        </div>
        
        <p className="max-w-md md:text-right text-slate-600 leading-relaxed text-[11px]">
          Data confidence scores, dynamic valuations, and ecosystem networks are derived via state-of-the-art startup scraping metrics. Subject to platform updates.
        </p>
      </div>
      <p className="mt-6 text-[10px] text-slate-700">
        &copy; {new Date().getFullYear()} GraphOne. All rights reserved. Built for professional intelligence.
      </p>
    </footer>
  );
}
