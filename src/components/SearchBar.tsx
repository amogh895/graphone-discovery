import React, { useState, useEffect, useRef } from "react";
import { Search, Building2, Coins, Sparkles, User, Delete, X } from "lucide-react";
import { ViewType } from "../types";

interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  category?: string;
  type?: string;
  description?: string;
  logo_url?: string;
}

interface SearchBarProps {
  onNavigate: (view: ViewType, slug?: string) => void;
}

export default function SearchBar({ onNavigate }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    companies: SearchResultItem[];
    investors: SearchResultItem[];
    founders: SearchResultItem[];
    products: SearchResultItem[];
  }>({ companies: [], investors: [], founders: [], products: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global '/' keypress listener to auto-focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener to close search results dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trigger search on input query change
  useEffect(() => {
    if (!query.trim()) {
      setResults({ companies: [], investors: [], founders: [], products: [] });
      setIsOpen(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const json = await response.json();
        if (json && json.data) {
          setResults(json.data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (view: ViewType, slug: string) => {
    onNavigate(view, slug);
    setQuery("");
    setIsOpen(false);
  };

  const hasResults = 
    results.companies.length > 0 || 
    results.investors.length > 0 || 
    results.founders.length > 0 || 
    results.products.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-xl" id="search-bar-container">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          ref={inputRef}
          id="search-input"
          type="text"
          placeholder="Search companies, founders, investors, products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          className="w-full bg-slate-900 text-slate-100 placeholder-slate-400 pl-11 pr-12 py-2.5 rounded-full border border-slate-800 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 focus:outline-none text-sm font-medium transition-all"
        />
        {query ? (
          <button 
            id="search-clear-btn"
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 p-1 rounded-full hover:bg-slate-800 transition-all"
          >
            <X className="h-3 w-3" />
          </button>
        ) : null}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-slate-700 font-mono pointer-events-none">
          /
        </div>
      </div>

      {isOpen && (
        <div id="search-dropdown" className="absolute left-0 right-0 mt-2 bg-slate-950 border border-slate-900 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[480px] overflow-y-auto">
          {isLoading && (
            <div className="p-4 text-center text-xs text-slate-400">Searching...</div>
          )}
          
          {!isLoading && !hasResults && (
            <div className="p-6 text-center text-sm text-slate-500">
              No results found for &ldquo;<span className="text-slate-300 font-medium">{query}</span>&rdquo;
            </div>
          )}

          {!isLoading && hasResults && (
            <div className="py-2.5 space-y-4">
              {/* Companies Category */}
              {results.companies.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center space-x-1.5">
                    <Building2 className="h-3 w-3" />
                    <span>Companies</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {results.companies.map((company) => (
                      <button
                        key={company.id}
                        id={`search-result-company-${company.slug}`}
                        onClick={() => handleSelect("company-details", company.slug)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-900 flex items-center space-x-3 transition-colors"
                      >
                        {company.logo_url ? (
                          <img referrerPolicy="no-referrer" src={company.logo_url} alt={company.name} className="h-7 w-7 rounded object-cover" />
                        ) : (
                          <div className="h-7 w-7 bg-slate-800 text-slate-300 font-semibold flex items-center justify-center rounded text-xs">{company.name[0]}</div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{company.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{company.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Category */}
              {results.products.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center space-x-1.5">
                    <Sparkles className="h-3 w-3" />
                    <span>AI Products</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {results.products.map((product) => (
                      <button
                        key={product.id}
                        id={`search-result-product-${product.slug}`}
                        onClick={() => handleSelect("products", "")}
                        className="w-full text-left px-4 py-2 hover:bg-slate-900 flex items-center space-x-3 transition-colors"
                      >
                        <div className="h-7 w-7 bg-red-950/30 text-red-400 font-semibold flex items-center justify-center rounded text-xs">P</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{product.name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{product.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Investors Category */}
              {results.investors.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center space-x-1.5">
                    <Coins className="h-3 w-3" />
                    <span>Investors</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {results.investors.map((investor) => (
                      <button
                        key={investor.id}
                        id={`search-result-investor-${investor.slug}`}
                        onClick={() => handleSelect("investor-details", investor.slug)}
                        className="w-full text-left px-4 py-2 hover:bg-slate-900 flex items-center space-x-3 transition-colors"
                      >
                        {investor.logo_url ? (
                          <img referrerPolicy="no-referrer" src={investor.logo_url} alt={investor.name} className="h-7 w-7 rounded object-cover" />
                        ) : (
                          <div className="h-7 w-7 bg-slate-800 text-slate-300 font-semibold flex items-center justify-center rounded text-xs">{investor.name[0]}</div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{investor.name}</p>
                          <p className="text-xs text-slate-400">{investor.type} &bull; {investor.location}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Founders Category */}
              {results.founders.length > 0 && (
                <div>
                  <div className="px-4 py-1.5 text-[10px] font-mono tracking-widest text-slate-500 uppercase flex items-center space-x-1.5">
                    <User className="h-3 w-3" />
                    <span>Founders</span>
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {results.founders.map((founder) => (
                      <button
                        key={founder.id}
                        id={`search-result-founder-${founder.slug}`}
                        onClick={() => handleSelect("company-details", "openai")} // Go to their company
                        className="w-full text-left px-4 py-2 hover:bg-slate-900 flex items-center space-x-3 transition-colors"
                      >
                        {founder.photo_url ? (
                          <img referrerPolicy="no-referrer" src={founder.photo_url} alt={founder.name} className="h-7 w-7 rounded-full object-cover" />
                        ) : (
                          <div className="h-7 w-7 bg-slate-800 text-slate-300 font-semibold flex items-center justify-center rounded-full text-xs">{founder.name[0]}</div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{founder.name}</p>
                          <p className="text-xs text-slate-400">{founder.title}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
