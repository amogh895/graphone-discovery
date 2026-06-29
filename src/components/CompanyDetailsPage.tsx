import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Globe, 
  MapPin, 
  Calendar, 
  Users, 
  BadgeAlert, 
  DollarSign, 
  Layers, 
  Award, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Coins,
  History,
  ShieldCheck,
  User,
  Sparkles,
  Newspaper
} from "lucide-react";
import { Company, Founder, Product, FundingRound, NewsArticle } from "../types";
import EcosystemGraph from "./EcosystemGraph.tsx";
import ProductCard from "./ProductCard.tsx";

interface CompanyDetailsProps {
  companySlug: string;
  onBack: () => void;
  onCompanyClick: (slug: string) => void;
}

export default function CompanyDetailsPage({ companySlug, onBack, onCompanyClick }: CompanyDetailsProps) {
  const [data, setData] = useState<(Company & {
    founders: Founder[];
    products: Product[];
    funding_rounds: FundingRound[];
    news: NewsArticle[];
  }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarCompanies, setSimilarCompanies] = useState<Company[]>([]);

  useEffect(() => {
    async function fetchCompanyDetails() {
      setLoading(true);
      try {
        const response = await fetch(`/api/companies/${companySlug}`);
        const json = await response.json();
        if (json && json.data) {
          setData(json.data);
          
          // Also fetch similar companies of same category
          const similarResponse = await fetch(`/api/companies?category=${encodeURIComponent(json.data.category)}`);
          const similarJson = await similarResponse.json();
          if (similarJson && similarJson.data) {
            // filter out current company
            const filtered = similarJson.data.filter((c: Company) => c.slug !== companySlug);
            setSimilarCompanies(filtered.slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Failed to load company details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyDetails();
  }, [companySlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs font-mono text-slate-400">Loading startup profile data...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10" id="profile-not-found">
        <p className="text-red-400 font-medium">Failed to retrieve company details.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200">
          Go back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" id="company-detail-page">
      {/* Back navigation */}
      <button
        id="btn-back-to-dashboard"
        onClick={onBack}
        className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-400 hover:text-red-400 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>BACK TO DASHBOARD</span>
      </button>

      {/* 1. Header Profile Box */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden" id="company-header-box">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <img 
              referrerPolicy="no-referrer"
              src={data.logo_url} 
              alt={data.name} 
              className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover border border-slate-800 shadow-xl" 
            />
            
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">{data.name}</h1>
                
                {data.is_unicorn && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-red-600/10 text-red-400 border border-red-500/20">
                    UNICORN
                  </span>
                )}
                
                <span className="px-2 py-0.5 rounded text-[9px] font-bold font-mono bg-slate-800 text-slate-300 uppercase">
                  {data.stage}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 font-medium max-w-xl leading-relaxed">{data.description}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-mono text-slate-500 mt-3.5">
                <span className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-slate-600" />
                  <span>{data.hq_city}, {data.hq_country}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-slate-600" />
                  <span>Founded {data.founded_year}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-slate-600" />
                  <span>{data.employee_count.toLocaleString()} employees</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch md:items-end gap-3 w-full md:w-auto">
            <a
              id="company-website-btn"
              href={data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-200 hover:text-white rounded-lg border border-slate-800 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <Globe className="h-4 w-4" />
              <span>Visit website</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Key Valuation Bento metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="company-metrics-grid">
        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 block uppercase">Total Venture Funding</span>
          <span className="text-xl font-bold text-white block mt-1.5">
            {data.funding_total > 0 ? `$${data.funding_total}M` : "Bootstrapped"}
          </span>
          <span className="text-[10px] text-slate-600 font-mono block mt-1">Verified deals tracked</span>
        </div>

        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 block uppercase">Current Valuation</span>
          <span className="text-xl font-bold text-red-400 block mt-1.5">
            {data.valuation > 0 ? `$${(data.valuation / 1000).toFixed(1)}B` : "N/A"}
          </span>
          <span className="text-[10px] text-slate-600 font-mono block mt-1">Estimate market cap</span>
        </div>

        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 block uppercase">Growth Score</span>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className="text-xl font-bold text-emerald-400">{data.growth_score}%</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${data.growth_score}%` }}></div>
          </div>
        </div>

        <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 block uppercase">Data Confidence</span>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className="text-xl font-bold text-blue-400">{data.data_confidence_score}%</span>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </div>
          <span className="text-[10px] text-slate-600 font-mono block mt-1">Confidence quality score</span>
        </div>
      </section>

      {/* 3. Primary layout: Left/Right cols split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Founders, Products, Funding Rounds, News */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Ecosystem Graph insertion */}
          <EcosystemGraph companySlug={data.slug} />

          {/* Founders Section */}
          <div className="space-y-4" id="founders-section">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <User className="h-4 w-4 text-red-500" />
              <span>Founders & Leadership</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.founders.length > 0 ? (
                data.founders.map((founder) => (
                  <div key={founder.id} className="p-4 bg-slate-900/20 border border-slate-800/80 rounded-xl flex items-center space-x-3.5">
                    <img referrerPolicy="no-referrer" src={founder.photo_url} alt={founder.name} className="h-11 w-11 rounded-full object-cover border border-slate-800" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">{founder.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{founder.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center space-x-2">
                        {founder.twitter && <a href={founder.twitter} target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors">Twitter</a>}
                        {founder.linkedin && <a href={founder.linkedin} target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors">LinkedIn</a>}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-500">
                  No founder information verified for this entity.
                </div>
              )}
            </div>
          </div>

          {/* Products List Section */}
          <div className="space-y-4" id="company-products-section">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-red-500" />
              <span>Products Launched</span>
            </h3>

            <div className="space-y-3">
              {data.products.length > 0 ? (
                data.products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))
              ) : (
                <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-500">
                  No products linked to this profile.
                </div>
              )}
            </div>
          </div>

          {/* Funding rounds timeline */}
          <div className="space-y-4" id="company-funding-timeline-section">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <History className="h-4 w-4 text-red-500" />
              <span>Funding History & Timeline</span>
            </h3>

            <div className="bg-slate-900/10 border border-slate-800/50 rounded-xl p-5 space-y-5">
              {data.funding_rounds.length > 0 ? (
                <div className="relative border-l border-slate-800 pl-6 ml-3 space-y-6">
                  {data.funding_rounds.map((round) => (
                    <div key={round.id} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-slate-950 border-2 border-red-500" />
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200">{round.round_type} Round</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(round.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                        </div>

                        <div className="mt-1 flex items-baseline space-x-1">
                          <span className="text-sm font-bold text-red-400">${round.amount}M</span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{round.currency}</span>
                        </div>

                        {round.lead_investor && (
                          <div className="mt-2.5 flex items-center space-x-2">
                            <span className="text-[9px] font-mono text-slate-500 uppercase">Lead Investor:</span>
                            <div className="flex items-center space-x-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px] text-slate-300">
                              <img referrerPolicy="no-referrer" src={round.lead_investor.logo_url} alt="" className="h-3.5 w-3.5 rounded-full object-cover" />
                              <span className="font-semibold">{round.lead_investor.name}</span>
                            </div>
                          </div>
                        )}

                        {round.co_investors.length > 0 && (
                          <p className="text-[10px] text-slate-500 mt-1.5">
                            Co-investors: <span className="text-slate-400 font-medium">{round.co_investors.join(", ")}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-500">
                  No venture funding events tracked. Company is completely bootstrapped.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: News Articles, Competitors & Similar Startups */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Related News Articles feed */}
          <div className="space-y-4" id="company-news-section">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Newspaper className="h-4 w-4 text-red-500" />
              <span>Related Intelligence News</span>
            </h3>

            <div className="space-y-3">
              {data.news.length > 0 ? (
                data.news.map((news) => (
                  <div key={news.id} className="bg-slate-900/25 border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-red-400 font-bold">{news.tag}</span>
                      <span className="text-slate-500">{new Date(news.published_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200 leading-snug line-clamp-2 hover:text-red-400 transition-colors">
                      <a href={news.url} target="_blank" rel="noopener noreferrer">{news.title}</a>
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 font-medium">{news.summary}</p>
                    <div className="text-[9px] font-mono text-slate-500 pt-1.5 flex justify-between">
                      <span>Source: {news.source}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-500">
                  No verified news articles for this company.
                </div>
              )}
            </div>
          </div>

          {/* Similar Companies panel */}
          <div className="space-y-4" id="similar-labs-panel">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Layers className="h-4 w-4 text-red-500" />
              <span>Similar Labs & Competitors</span>
            </h3>

            <div className="space-y-3">
              {similarCompanies.length > 0 ? (
                similarCompanies.map((company) => (
                  <div
                    key={company.id}
                    id={`similar-lab-card-${company.slug}`}
                    onClick={() => onCompanyClick(company.slug)}
                    className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img referrerPolicy="no-referrer" src={company.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover border border-slate-800" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-200 group-hover:text-red-400 truncate">{company.name}</h4>
                        <span className="text-[9px] font-mono text-slate-500 truncate block">{company.category}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl text-center text-xs text-slate-500">
                  No overlapping startups found.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
