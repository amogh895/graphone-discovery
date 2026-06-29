import React from "react";
import { Building2, Sparkles, MapPin, Layers, ExternalLink } from "lucide-react";
import { Company } from "../types";

interface CompanyCardProps {
  key?: any;
  company: Company;
  onClick: (slug: string) => void;
  index?: number;
}

export default function CompanyCard({ company, onClick, index }: CompanyCardProps) {
  return (
    <div 
      id={`company-card-${company.slug}`}
      onClick={() => onClick(company.slug)}
      className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 hover:bg-slate-900/60 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative shadow-md overflow-hidden"
    >
      {/* Decorative rank number if index is passed */}
      {index !== undefined && (
        <div className="absolute top-2 right-3 font-mono text-[9px] font-bold text-slate-700">
          #{String(index + 1).padStart(2, "0")}
        </div>
      )}

      <div>
        <div className="flex items-start space-x-3.5">
          {company.logo_url ? (
            <img 
              referrerPolicy="no-referrer"
              src={company.logo_url} 
              alt={company.name} 
              className="h-11 w-11 rounded-lg object-cover border border-slate-800"
            />
          ) : (
            <div className="h-11 w-11 bg-slate-800 text-slate-300 font-semibold flex items-center justify-center rounded-lg text-sm">
              {company.name[0]}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-semibold text-slate-100 text-sm group-hover:text-red-400 transition-colors truncate">
                {company.name}
              </h3>
              {company.is_unicorn && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                  UNICORN
                </span>
              )}
            </div>
            
            <p className="text-[11px] font-mono font-medium text-slate-500 flex items-center space-x-1 mt-0.5">
              <span>{company.category}</span>
              <span>&bull;</span>
              <span>{company.stage}</span>
            </p>
          </div>
        </div>

        <p className="mt-3.5 text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
          {company.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3 text-slate-600" />
          <span className="truncate max-w-[120px]">{company.hq_city}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-right">
          <div>
            <span className="text-slate-600 block text-[8px] font-semibold text-right uppercase">Funding</span>
            <span className="text-slate-200 font-semibold">
              {company.funding_total > 0 ? `$${company.funding_total}M` : "Bootstrapped"}
            </span>
          </div>
          <div className="border-l border-slate-800 h-5 pl-2">
            <span className="text-slate-600 block text-[8px] font-semibold text-right uppercase">Growth</span>
            <span className="text-emerald-400 font-semibold">
              {company.growth_score}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
