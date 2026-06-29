import React, { useState } from "react";
import { X, Check, AlertCircle, Building2 } from "lucide-react";

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated: () => void;
}

export default function CreateCompanyModal({ isOpen, onClose, onCompanyCreated }: CreateCompanyModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Foundation Models");
  const [fundingTotal, setFundingTotal] = useState<number>(0);
  const [employeeCount, setEmployeeCount] = useState<number>(1);
  const [foundedYear, setFoundedYear] = useState<number>(2026);
  const [hqCity, setHqCity] = useState("");
  const [hqCountry, setHqCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [stage, setStage] = useState("Seed");
  const [isUnicorn, setIsUnicorn] = useState(false);
  const [valuation, setValuation] = useState<number>(0);
  const [growthScore, setGrowthScore] = useState<number>(50);

  const [apiKey, setApiKey] = useState("graphone-dev-key"); // Default key pre-filled for convenience
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      description,
      category,
      funding_total: Number(fundingTotal),
      employee_count: Number(employeeCount),
      founded_year: Number(foundedYear),
      hq_city: hqCity,
      hq_country: hqCountry,
      website,
      stage,
      is_unicorn: isUnicorn,
      valuation: Number(valuation),
      growth_score: Number(growthScore)
    };

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error?.message || "Failed to submit company");
      }

      setSuccess(true);
      setTimeout(() => {
        onCompanyCreated();
        onClose();
        // Reset states
        setName("");
        setDescription("");
        setHqCity("");
        setHqCountry("");
        setWebsite("");
        setSuccess(false);
      }, 1500);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-red-500" />
            <span className="font-semibold text-slate-100">Submit New AI Startup</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 flex items-start space-x-3 text-xs text-red-400 font-medium">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-center space-x-3 text-xs text-emerald-400 font-medium">
              <Check className="h-5 w-5 flex-shrink-0" />
              <span>Startup submitted successfully! refreshing list...</span>
            </div>
          )}

          {/* Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cohere"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Website URL *</label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Short Description *</label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a professional description explaining their AI model architecture and market sector..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              >
                <option value="Foundation Models">Foundation Models</option>
                <option value="AI Coding">AI Coding</option>
                <option value="AI Search">AI Search</option>
                <option value="AI Image">AI Image</option>
                <option value="AI Video">AI Video</option>
                <option value="AI Voice">AI Voice</option>
                <option value="AI Infrastructure">AI Infrastructure</option>
                <option value="Healthcare & AI Legal">Healthcare & AI Legal</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Current Funding Stage *</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              >
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Series D">Series D</option>
                <option value="Growth">Growth</option>
                <option value="Bootstrapped">Bootstrapped</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Founded Year *</label>
              <input
                type="number"
                required
                min={1900}
                max={2026}
                value={foundedYear}
                onChange={(e) => setFoundedYear(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Funding Total ($M)</label>
              <input
                type="number"
                min={0}
                value={fundingTotal}
                onChange={(e) => setFundingTotal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Valuation ($M)</label>
              <input
                type="number"
                min={0}
                value={valuation}
                onChange={(e) => setValuation(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Employees</label>
              <input
                type="number"
                min={1}
                value={employeeCount}
                onChange={(e) => setEmployeeCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">Growth Score (0-100)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={growthScore}
                onChange={(e) => setGrowthScore(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">HQ City *</label>
              <input
                type="text"
                required
                value={hqCity}
                onChange={(e) => setHqCity(e.target.value)}
                placeholder="e.g. Bengaluru"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 font-semibold mb-1">HQ Country *</label>
              <input
                type="text"
                required
                value={hqCountry}
                onChange={(e) => setHqCountry(e.target.value)}
                placeholder="e.g. India"
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Unicorn tag */}
          <div className="flex items-center space-x-3.5 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
            <input
              type="checkbox"
              id="is_unicorn"
              checked={isUnicorn}
              onChange={(e) => setIsUnicorn(e.target.checked)}
              className="h-4 w-4 bg-slate-950 text-red-500 rounded border-slate-800 focus:ring-red-500"
            />
            <label htmlFor="is_unicorn" className="text-xs font-mono font-semibold uppercase text-slate-300 cursor-pointer">
              Mark company as an Active AI Unicorn ($1B+ Valuation)
            </label>
          </div>

          {/* Auth Key Input */}
          <div className="pt-3 border-t border-slate-850">
            <label className="block text-[10px] font-mono uppercase text-red-500 font-semibold mb-1 flex items-center space-x-1">
              <span>Write Auth Header (X-API-Key)</span>
            </label>
            <input
              type="password"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter api key..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-700 rounded-lg px-3 py-2 text-xs focus:border-red-500/50 focus:outline-none"
            />
            <span className="text-[9px] text-slate-500 font-mono mt-1 block">Default development key is pre-filled.</span>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-850">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-lg text-xs font-semibold transition-all border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-red-950/40"
            >
              {loading ? "Submitting..." : "Submit Startup"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
