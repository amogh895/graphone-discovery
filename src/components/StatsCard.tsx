import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
}

export default function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono tracking-wider text-slate-400 uppercase">{title}</span>
        <div className="p-2 bg-slate-800 rounded-lg text-slate-300 group-hover:text-red-400 group-hover:bg-red-500/10 transition-all duration-300">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      
      <div className="mt-3 flex items-baseline space-x-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {trend && (
          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
            {trend}
          </span>
        )}
      </div>
      
      {description && (
        <p className="mt-1 text-xs text-slate-500 font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
