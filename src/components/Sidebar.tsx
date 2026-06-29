import React from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Sparkles, 
  Coins, 
  Newspaper, 
  HelpCircle,
  TrendingUp,
  UserCheck,
  Bot
} from "lucide-react";
import { ViewType } from "../types";

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType, slug?: string) => void;
  onOpenCreateCompany: () => void;
}

export default function Sidebar({ currentView, onNavigate, onOpenCreateCompany }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "AI Products", icon: Sparkles },
    { id: "investors", label: "Investors", icon: Coins },
    { id: "ai-copilot", label: "AI Analyst", icon: Bot }
  ];

  return (
    <aside 
      id="app-sidebar" 
      className="w-64 bg-slate-950 text-slate-100 border-r border-slate-900 flex flex-col fixed h-screen left-0 top-0 z-30"
    >
      {/* Brand logo */}
      <div className="p-6 border-b border-slate-900 flex items-center space-x-3">
        <div className="h-9 w-9 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-red-900/20">
          G
        </div>
        <div>
          <span className="font-bold text-lg tracking-tight text-white">graph<span className="text-red-500">one</span></span>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">AI Intelligence</p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3">Explore Platform</p>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
                           (item.id === "dashboard" && currentView === "company-details") ||
                           (item.id === "investors" && currentView === "investor-details");
          return (
            <button
              key={item.id}
              id={`sidebar-link-${item.id}`}
              onClick={() => onNavigate(item.id as ViewType)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? "bg-red-600/10 text-red-400 border border-red-900/30 font-semibold" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100 border border-transparent"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-red-400" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="pt-6">
          <p className="px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3">Contribute</p>
          <button
            id="sidebar-btn-add-company"
            onClick={onOpenCreateCompany}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all shadow-lg shadow-red-950/40"
          >
            <Building2 className="h-4 w-4" />
            <span>Submit Startup</span>
          </button>
        </div>
      </nav>

      {/* Bottom telemetry/status lines (honest, clean, minimal metrics) */}
      <div className="p-4 border-t border-slate-900 text-[11px] text-slate-500 font-mono space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>API Online</span>
          </span>
          <span className="text-slate-600">v1.2.0</span>
        </div>
        <p className="text-[10px] text-slate-600 leading-tight">
          Real-time insights connecting founders, products & capital.
        </p>
      </div>
    </aside>
  );
}
