import React, { useState } from "react";
import { ArrowBigUpDash, ExternalLink, Calendar, HelpCircle, Flame } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: any;
  product: Product;
  onCompanyClick?: (slug: string) => void;
  index?: number;
}

export default function ProductCard({ product, onCompanyClick, index }: ProductCardProps) {
  const [upvotes, setUpvotes] = useState(product.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    } else {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
    }
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700/80 hover:bg-slate-900/60 transition-all duration-300 flex items-start space-x-4 shadow-sm"
    >
      {/* Upvote controller */}
      <button
        id={`product-upvote-btn-${product.id}`}
        onClick={handleUpvote}
        className={`flex flex-col items-center justify-center p-2 rounded-lg border w-12 transition-all ${
          hasUpvoted
            ? "bg-red-600/10 border-red-500/40 text-red-400 font-bold"
            : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-100 hover:border-slate-700"
        }`}
      >
        <ArrowBigUpDash className={`h-5 w-5 ${hasUpvoted ? "fill-red-400/20 text-red-400" : ""}`} />
        <span className="text-xs font-mono mt-1 font-semibold">{upvotes.toLocaleString()}</span>
      </button>

      {/* Main product contents */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-slate-100 text-sm">{product.name}</h3>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-400 uppercase">
            {product.category}
          </span>
          {upvotes > 25000 && (
            <span className="inline-flex items-center text-[9px] text-orange-400 font-mono font-semibold px-1 py-0.5 bg-orange-950/20 rounded-md border border-orange-950">
              <Flame className="h-2.5 w-2.5 mr-0.5 fill-orange-400/10" />
              HOT
            </span>
          )}
        </div>

        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Footer meta elements */}
        <div className="mt-4 pt-3.5 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
          <div className="flex items-center space-x-3">
            {product.company && (
              <button
                id={`product-company-link-${product.id}`}
                onClick={() => onCompanyClick && onCompanyClick(product.company!.slug)}
                className="flex items-center space-x-1.5 group hover:text-red-400 transition-colors"
              >
                {product.company.logo_url ? (
                  <img 
                    referrerPolicy="no-referrer"
                    src={product.company.logo_url} 
                    alt={product.company.name} 
                    className="h-4 w-4 rounded-full object-cover" 
                  />
                ) : (
                  <span className="h-4 w-4 bg-slate-800 text-slate-300 flex items-center justify-center rounded-full text-[8px] font-bold">
                    {product.company.name[0]}
                  </span>
                )}
                <span className="font-semibold">{product.company.name}</span>
              </button>
            )}
            
            <span className="text-slate-700">&bull;</span>
            
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-slate-600" />
              <span>{new Date(product.launch_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}</span>
            </span>
          </div>

          <a
            href={product.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-slate-400 hover:text-red-400 transition-colors font-semibold"
          >
            <span>Visit website</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
