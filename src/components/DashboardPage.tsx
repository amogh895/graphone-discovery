import { API_BASE } from "../config";
import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Building2, 
  TrendingUp, 
  Coins, 
  Sparkles, 
  Award, 
  Layers, 
  Layers2, 
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { Company } from "../types";
import StatsCard from "./StatsCard";
import CompanyCard from "./CompanyCard";

interface DashboardPageProps {
  onCompanyClick: (slug: string) => void;
  onNavigate: (view: "products" | "investors", slug?: string) => void;
}

export default function DashboardPage({ onCompanyClick, onNavigate }: DashboardPageProps) {
  const [stats, setStats] = useState<{
    total_companies: number;
    total_funding_m: number;
    total_investors: number;
    total_products: number;
    average_growth_score: number;
  } | null>(null);

  const [trendingCompanies, setTrendingCompanies] = useState<Company[]>([]);
  const [fastestGrowing, setFastestGrowing] = useState<Company[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Categories list
  const categories = [
    "All",
    "Foundation Models",
    "AI Coding",
    "AI Search",
    "AI Image",
    "AI Video",
    "AI Voice",
    "AI Infrastructure",
    "Healthcare & AI Legal"
  ];

  // Fetch initial dashboard metrics and tables
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Stats
        const statsRes = await fetch(`${API_BASE}/api/stats`);
        const statsJson = await statsRes.json();
        if (statsJson && statsJson.data) setStats(statsJson.data);

        // Trending
        const trendingRes = await fetch(`${API_BASE}/api/companies/trending`)
        const trendingJson = await trendingRes.json();
        if (trendingJson && trendingJson.data) setTrendingCompanies(trendingJson.data);

        // All companies
        const companiesRes = await fetch(`${API_BASE}/api/companies`)
        const companiesJson = await companiesRes.json();
        if (companiesJson && companiesJson.data) {
          setCompanies(companiesJson.data);
          
          // Filter out fastest growing
          const sortedByGrowth = [...companiesJson.data].sort((a, b) => b.growth_score - a.growth_score);
          setFastestGrowing(sortedByGrowth.slice(0, 5));
        }

      } catch (err) {
        console.error("Dashboard metrics load failure:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const filteredCompanies = selectedCategory === "All"
    ? companies
    : companies.filter(c => c.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 text-red-500 animate-spin mb-3" />
        <span className="text-xs font-mono text-slate-400">Loading intelligence layer...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in" id="dashboard-page">
      {/* 1. Hero banner with custom dynamic background pattern */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 md:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-slate-950/0 to-slate-950/0 pointer-events-none" />
        
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-wider bg-red-600/10 text-red-400 border border-red-500/20 uppercase mb-4">
            Discovering the AI Economy
          </span>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Discover the world&rsquo;s most innovative <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">AI companies</span>
          </h1>
          <p className="mt-3.5 text-xs md:text-sm text-slate-400 leading-relaxed max-w-lg">
            Explore AI startups, foundational LLM models, venture investors, and product metrics shaping the future of global machine intelligence.
          </p>
          <div className="mt-6 flex items-center space-x-3.5">
            <button
              id="hero-btn-explore-products"
              onClick={() => onNavigate("products")}
              className="px-4.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-lg shadow-red-950/30"
            >
              Explore Products
            </button>
            <button
              id="hero-btn-explore-investors"
              onClick={() => onNavigate("investors")}
              className="px-4.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all"
            >
              Venture Capitalists
            </button>
          </div>
        </div>
      </section>

      {/* 2. Stats Grid */}
      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-grid">
          <StatsCard
            title="Total Capital Tracked"
            value={`$${(stats.total_funding_m / 1000).toFixed(1)}B`}
            description="Across backed AI models"
            icon={Coins}
            trend="+12.4% MoM"
          />
          <StatsCard
            title="AI Companies"
            value={stats.total_companies}
            description="Verified model creators"
            icon={Building2}
          />
          <StatsCard
            title="AI Products"
            value={stats.total_products}
            description="Upvoted web apps"
            icon={Sparkles}
          />
          <StatsCard
            title="Mean Growth Score"
            value={`${stats.average_growth_score}%`}
            description="Aggregated velocity"
            icon={TrendingUp}
            trend="Strong"
          />
        </section>
      )}

      {/* 3. Top Trending Companies row */}
      <section id="trending-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-200 flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500/20 animate-pulse" />
              <span>Trending Companies</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">Ranked by calculated deal velocity, employee growth & upvotes</p>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-slate-900 text-slate-400 rounded-full">
            Top 10 Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {trendingCompanies.slice(0, 5).map((company, idx) => (
            <div 
              key={company.id}
              id={`trending-card-${company.slug}`}
              onClick={() => onCompanyClick(company.slug)}
              className="bg-slate-900/30 border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 cursor-pointer hover:bg-slate-900/50 transition-all flex flex-col justify-between group relative"
            >
              <div className="absolute top-2.5 right-3 text-[10px] font-mono text-slate-600 font-bold">
                #{idx + 1}
              </div>
              
              <div>
                <img referrerPolicy="no-referrer" src={company.logo_url} alt={company.name} className="h-8 w-8 rounded-md object-cover border border-slate-850 mb-3" />
                <h3 className="text-xs font-semibold text-slate-200 group-hover:text-red-400 truncate">{company.name}</h3>
                <p className="text-[9px] font-mono text-slate-500 mt-0.5 truncate">{company.category}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">{company.growth_score}% growth</span>
                <span className="text-slate-500">${company.funding_total > 0 ? `${company.funding_total}M` : "Bootstrapped"}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Secondary Bento Grid Section (Fastest Growing & Categories) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fastest growing list */}
        <div className="lg:col-span-1 bg-slate-900/25 border border-slate-800/60 rounded-xl p-5 space-y-4 flex flex-col justify-between" id="fastest-growing-card">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span>Fastest Growing AI Companies</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 mb-4">Highest growth metrics based on hiring and web traffic</p>
            
            <div className="space-y-2.5">
              {fastestGrowing.map((company, index) => (
                <div
                  key={company.id}
                  id={`fastest-growing-item-${company.slug}`}
                  onClick={() => onCompanyClick(company.slug)}
                  className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-900 hover:border-slate-800 flex items-center justify-between cursor-pointer group transition-all"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-slate-600 w-4">0{index + 1}</span>
                    <img referrerPolicy="no-referrer" src={company.logo_url} alt={company.name} className="h-6 w-6 rounded object-cover" />
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-red-400 truncate">{company.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold">
                    {company.growth_score}% growth
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate("products")}
            className="w-full mt-4 flex items-center justify-center space-x-1 py-2 rounded-lg bg-slate-950 border border-slate-850 hover:bg-slate-900 text-[11px] text-slate-400 hover:text-slate-200 font-mono transition-all"
          >
            <span>Explore product launches</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Categories & Directory */}
        <div className="lg:col-span-2 bg-slate-900/10 border border-slate-800/40 rounded-xl p-5 space-y-5 flex flex-col" id="companies-directory">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <Layers className="h-4 w-4 text-red-500" />
                <span>AI Companies Directory</span>
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Filter model creators by technology stack</p>
            </div>
            
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-2 py-0.5 rounded">
              Showing {filteredCompanies.length} companies
            </span>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`category-tab-${cat.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 border ${
                  selectedCategory === cat
                    ? "bg-red-600/10 border-red-500/30 text-red-400 font-semibold"
                    : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Companies Directory Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onClick={onCompanyClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Unicorn highlights Row */}
      <section className="bg-slate-950/40 border border-slate-900 rounded-xl p-6" id="unicorn-showcase">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-red-500" />
              <span>AI Unicorns ($1B+ Valuations)</span>
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Venture-backed market leaders driving global AI enterprise valuations</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {companies.filter(c => c.is_unicorn).slice(0, 4).map((company) => (
            <div
              key={company.id}
              id={`unicorn-showcase-item-${company.slug}`}
              onClick={() => onCompanyClick(company.slug)}
              className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/40 cursor-pointer transition-all flex items-center space-x-3"
            >
              <img referrerPolicy="no-referrer" src={company.logo_url} alt={company.name} className="h-9 w-9 rounded-md object-cover border border-slate-800" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate block">{company.name}</span>
                <span className="text-[10px] font-mono text-red-400 font-bold">${(company.valuation / 1000).toFixed(1)}B val</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
