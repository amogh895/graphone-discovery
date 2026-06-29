import React, { useState, useEffect } from "react";
import { Sparkles, Flame, Search, Layers, Calendar, HelpCircle } from "lucide-react";
import { Product } from "../types";
import ProductCard from "./ProductCard";

interface ProductsPageProps {
  onCompanyClick: (slug: string) => void;
}

export default function ProductsPage({ onCompanyClick }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"popular" | "newest">("popular");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Chat",
    "Code",
    "Image",
    "Video"
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let url = `/api/products?sort=${sortBy}`;
        if (selectedCategory !== "All") {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        const response = await fetch(url);
        const json = await response.json();
        if (json && json.data) {
          setProducts(json.data);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, sortBy]);

  // Client-side search filtering
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in" id="ai-products-directory-page">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Sparkles className="text-purple-500 h-5 w-5" />
              <span>AI Products Ecosystem</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Discover, rank, and explore state-of-the-art AI applications, foundational interfaces, and pair-coding assistants.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              id="sort-btn-popular"
              onClick={() => setSortBy("popular")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                sortBy === "popular"
                  ? "bg-purple-600/10 border border-purple-500/20 text-purple-400"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              POPULAR
            </button>
            <button
              id="sort-btn-newest"
              onClick={() => setSortBy("newest")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                sortBy === "newest"
                  ? "bg-purple-600/10 border border-purple-500/20 text-purple-400"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              NEWEST
            </button>
          </div>
        </div>
      </section>

      {/* Categories & Search Panel */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Categories horizontal list */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`product-category-tab-${cat.toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                selectedCategory === cat
                  ? "bg-purple-600/10 border-purple-500/30 text-purple-400 font-bold"
                  : "bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic product-specific search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            id="products-search-input"
            type="text"
            placeholder="Search products in this category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 text-slate-200 placeholder-slate-500 pl-9 pr-4 py-1.5 rounded-lg border border-slate-800 focus:border-purple-500/50 focus:outline-none text-xs font-medium"
          />
        </div>
      </section>

      {/* Products list or empty state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <span className="text-xs font-mono text-slate-500">Querying products...</span>
        </div>
      ) : (
        <div className="space-y-4" id="products-grid-list">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCompanyClick={onCompanyClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/10 border border-slate-900 rounded-xl p-8 text-center text-slate-500" id="products-empty-state">
              <p className="text-xs font-mono">No products matched your search filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
