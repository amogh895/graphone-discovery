import React, { useState, useEffect } from "react";
import { Coins, Landmark, MapPin, Layers, Award, ChevronRight, RefreshCw, Layers3 } from "lucide-react";
import { Investor } from "../types";

interface InvestorsPageProps {
  onInvestorClick: (slug: string) => void;
}

export default function InvestorsPage({ onInvestorClick }: InvestorsPageProps) {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("All");

  const types = ["All", "VC", "Angel"];

  useEffect(() => {
    async function fetchInvestors() {
      setLoading(true);
      try {
        let url = "/api/investors";
        if (selectedType !== "All") {
          url += `?type=${selectedType}`;
        }
        const response = await fetch(url);
        const json = await response.json();
        if (json && json.data) {
          setInvestors(json.data);
        }
      } catch (error) {
        console.error("Failed to load investors list:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInvestors();
  }, [selectedType]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <RefreshCw className="h-7 w-7 text-red-500 animate-spin mb-2" />
        <span className="text-xs font-mono text-slate-500">Querying venture groups...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="investors-list-page">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none" />
        
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Coins className="text-emerald-500 h-5 w-5" />
            <span>AI Venture Investors Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Find the venture firms, accelerators, and private equity syndicates backing next-generation machine learning and foundational models.
          </p>
        </div>
      </section>

      {/* Filter Row */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {types.map((t) => (
          <button
            key={t}
            id={`investor-type-tab-${t.toLowerCase()}`}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selectedType === t
                ? "bg-emerald-600/10 border-emerald-500/30 text-emerald-400 font-bold"
                : "bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            {t === "All" ? "All Funds" : t}
          </button>
        ))}
      </div>

      {/* Grid of Investors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="investors-grid-list">
        {investors.map((investor) => (
          <div
            key={investor.id}
            id={`investor-card-${investor.slug}`}
            onClick={() => onInvestorClick(investor.slug)}
            className="bg-slate-900/30 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center space-x-3.5 mb-4">
                <img referrerPolicy="no-referrer" src={investor.logo_url} alt="" className="h-10 w-10 rounded-lg object-cover border border-slate-800" />
                <div>
                  <h3 className="font-semibold text-slate-200 text-sm group-hover:text-red-400 transition-colors">
                    {investor.name}
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                    {investor.type} &bull; Fund #{investor.fund_number}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {investor.bio}
              </p>

              {/* Tag Pillboxes */}
              <div className="flex flex-wrap gap-1 mt-4">
                {investor.sector_focus.slice(0, 2).map(sec => (
                  <span key={sec} className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-950 text-slate-500 uppercase border border-slate-900">
                    {sec}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-slate-600" />
                <span className="truncate max-w-[100px]">{investor.location.split(",")[0]}</span>
              </div>

              <div className="flex items-center space-x-2.5 text-right">
                <div>
                  <span className="text-slate-600 block text-[8px] font-semibold uppercase text-right">AUM</span>
                  <span className="text-slate-200 font-bold">
                    {investor.aum > 1000 ? `$${(investor.aum / 1000).toFixed(1)}B` : `$${investor.aum}M`}
                  </span>
                </div>
                <div className="border-l border-slate-800 h-5 pl-2.5">
                  <span className="text-slate-600 block text-[8px] font-semibold uppercase text-right">Check Size</span>
                  <span className="text-emerald-400 font-bold">
                    ${investor.avg_check_size}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
