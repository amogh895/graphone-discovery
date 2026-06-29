import React, { useState, useEffect } from "react";
import { ArrowLeft, Coins, Landmark, MapPin, Building2, ChevronRight, History, ShieldAlert, Award } from "lucide-react";
import { Investor, Company, FundingRound } from "../types";

interface InvestorProfileProps {
  investorSlug: string;
  onBack: () => void;
  onCompanyClick: (slug: string) => void;
}

export default function InvestorProfilePage({ investorSlug, onBack, onCompanyClick }: InvestorProfileProps) {
  const [data, setData] = useState<(Investor & {
    portfolio: Company[];
    portfolio_concentration: { name: string; percentage: number }[];
  }) | null>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvestorProfile() {
      setLoading(true);
      try {
        const response = await fetch(`/api/investors/${investorSlug}`);
        const json = await response.json();
        if (json && json.data) {
          setData(json.data);

          // Fetch recent investments timeline
          const invRes = await fetch(`/api/investors/${investorSlug}/investments`);
          const invJson = await invRes.json();
          if (invJson && invJson.data) {
            setInvestments(invJson.data);
          }
        }
      } catch (error) {
        console.error("Failed to load investor profile:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInvestorProfile();
  }, [investorSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs font-mono text-slate-500">Querying venture profile portfolio...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10" id="investor-not-found">
        <p className="text-red-400 font-medium">Failed to retrieve investor profile.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200">
          Back to Directory
        </button>
      </div>
    );
  }

  // Set colors for Portfolio Concentration Donut
  const colors = ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#64748b"];

  return (
    <div className="space-y-8 animate-fade-in" id="investor-profile-page">
      {/* Back button */}
      <button
        id="btn-back-to-investors"
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>BACK TO INVESTORS</span>
      </button>

      {/* Profile Header */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden" id="investor-profile-header">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center space-x-5">
            <img referrerPolicy="no-referrer" src={data.logo_url} alt="" className="h-16 w-16 rounded-xl object-cover border border-slate-800" />
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{data.name}</h1>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  {data.type} Group
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium max-w-xl leading-relaxed">{data.bio}</p>
              
              <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500 mt-3.5">
                <MapPin className="h-3.5 w-3.5 text-slate-600" />
                <span>{data.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="investor-stats-grid">
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 block uppercase">Estimated AUM</span>
          <span className="text-lg font-bold text-white block mt-1.5">
            {data.aum > 1000 ? `$${(data.aum / 1000).toFixed(1)}B` : `$${data.aum}M`}
          </span>
          <span className="text-[10px] text-slate-600 font-mono block mt-1">Capital pool size</span>
        </div>

        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 block uppercase">Avg Check Size</span>
          <span className="text-lg font-bold text-emerald-400 block mt-1.5">
            ${data.avg_check_size}M
          </span>
          <span className="text-[10px] text-slate-600 font-mono block mt-1">First-ticket average</span>
        </div>

        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 block uppercase">Active Seed Fund</span>
          <span className="text-lg font-bold text-white block mt-1.5">
            Fund #{data.fund_number}
          </span>
          <span className="text-[10px] text-slate-600 font-mono block mt-1">Active deployment vehicle</span>
        </div>

        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 block uppercase">Portfolio Companies</span>
          <span className="text-lg font-bold text-blue-400 block mt-1.5">
            {data.portfolio.length} Tracked
          </span>
          <span className="text-[10px] text-slate-600 font-mono block mt-1">Active venture holdings</span>
        </div>
      </section>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Portfolio Concentration & Investments timeline */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active holdings row */}
          <div className="space-y-4" id="portfolio-holdings-section">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-emerald-500" />
              <span>Venture Portfolio Holdings ({data.portfolio.length})</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.portfolio.map((company) => (
                <div
                  key={company.id}
                  id={`portfolio-holding-card-${company.slug}`}
                  onClick={() => onCompanyClick(company.slug)}
                  className="p-4 bg-slate-900/25 border border-slate-800/80 rounded-xl hover:border-slate-700 hover:bg-slate-900/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img referrerPolicy="no-referrer" src={company.logo_url} alt="" className="h-9 w-9 rounded-lg object-cover border border-slate-800" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-red-400 truncate">{company.name}</h4>
                      <span className="text-[9px] font-mono text-slate-500 block mt-0.5 truncate">{company.category} &bull; {company.stage}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-700 group-hover:text-slate-300 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Investment history timeline */}
          <div className="space-y-4" id="investment-history-section">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <History className="h-4 w-4 text-emerald-500" />
              <span>Recent Investment Events Timeline</span>
            </h3>

            <div className="bg-slate-900/10 border border-slate-800/50 rounded-xl p-5 space-y-4">
              {investments.length > 0 ? (
                <div className="space-y-4">
                  {investments.map((round) => (
                    <div 
                      key={round.id}
                      className="p-3.5 bg-slate-950/40 rounded-xl border border-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-800/80 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        {round.company?.logo_url ? (
                          <img referrerPolicy="no-referrer" src={round.company.logo_url} alt="" className="h-7 w-7 rounded object-cover border border-slate-800" />
                        ) : (
                          <span className="h-7 w-7 bg-slate-800 text-slate-300 rounded flex items-center justify-center font-bold text-[10px]">C</span>
                        )}
                        <div>
                          <button
                            onClick={() => round.company && onCompanyClick(round.company.slug)}
                            className="text-xs font-semibold text-slate-200 hover:text-red-400 text-left block"
                          >
                            {round.company?.name || "Verified Company"}
                          </button>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">{round.round_type} Round &bull; Lead</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 sm:text-right sm:justify-end">
                        <div className="font-mono">
                          <span className="text-xs font-bold text-slate-200">${round.amount}M</span>
                          <span className="text-[9px] text-slate-500 block uppercase">Amount</span>
                        </div>
                        <div className="border-l border-slate-800 h-6 pl-3 font-mono">
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            {new Date(round.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                          </span>
                          <span className="text-[9px] text-slate-500 block uppercase">Date</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-4 font-mono">No funding events recorded.</p>
              )}
            </div>
          </div>

        </div>

        {/* Right: Portfolio Concentration custom donut breakdown */}
        <div className="lg:col-span-1 space-y-4" id="portfolio-concentration-section">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Award className="h-4 w-4 text-emerald-500" />
            <span>Sector Allocations</span>
          </h3>

          <div className="bg-slate-900/25 border border-slate-800/80 rounded-xl p-5 space-y-6">
            {/* Visual SVG Sector concentration pie/donut mimic */}
            <div className="flex justify-center py-4 relative">
              <svg width="140" height="140" viewBox="0 0 40 40" className="transform -rotate-90">
                <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="#1e293b" strokeWidth="3" />
                
                {/* Dynamically draw colored circle stroke segments */}
                {data.portfolio_concentration.map((item, index) => {
                  const previousPercentageSum = data.portfolio_concentration
                    .slice(0, index)
                    .reduce((sum, item) => sum + item.percentage, 0);
                  
                  return (
                    <circle
                      key={item.name}
                      cx="20"
                      cy="20"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke={colors[index % colors.length]}
                      strokeWidth="3.2"
                      strokeDasharray={`${item.percentage} ${100 - item.percentage}`}
                      strokeDashoffset={-previousPercentageSum}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Top Sector</span>
                <span className="text-xs font-bold text-slate-200 truncate max-w-[90px]">{data.portfolio_concentration[0]?.name || "None"}</span>
              </div>
            </div>

            {/* List Concentration details */}
            <div className="space-y-3">
              {data.portfolio_concentration.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}></span>
                    <span className="text-slate-400 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-200 font-bold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
