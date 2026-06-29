import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import Footer from "./components/Footer";
import DashboardPage from "./components/DashboardPage";
import CompanyDetailsPage from "./components/CompanyDetailsPage";
import ProductsPage from "./components/ProductsPage";
import InvestorsPage from "./components/InvestorsPage";
import InvestorProfilePage from "./components/InvestorProfilePage";
import CreateCompanyModal from "./components/CreateCompanyModal";
import AiAnalystPage from "./components/AiAnalystPage";
import { ViewType } from "./types";

export default function App() {
  const [viewState, setViewState] = useState<{
    view: ViewType;
    selectedSlug?: string;
  }>({ view: "dashboard" });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Hash router synchronizer
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (!hash || hash === "#" || hash === "#dashboard") {
        setViewState({ view: "dashboard" });
      } else if (hash.startsWith("#company/")) {
        const slug = hash.split("/")[1];
        setViewState({ view: "company-details", selectedSlug: slug });
      } else if (hash === "#products") {
        setViewState({ view: "products" });
      } else if (hash === "#investors") {
        setViewState({ view: "investors" });
      } else if (hash.startsWith("#investor/")) {
        const slug = hash.split("/")[1];
        setViewState({ view: "investor-details", selectedSlug: slug });
      } else if (hash === "#ai-copilot") {
        setViewState({ view: "ai-copilot" });
      }
    };

    window.addEventListener("hashchange", parseHash);
    parseHash(); // Initial check

    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const handleNavigate = (view: ViewType, slug?: string) => {
    if (view === "dashboard") {
      window.location.hash = "#dashboard";
    } else if (view === "company-details" && slug) {
      window.location.hash = `#company/${slug}`;
    } else if (view === "products") {
      window.location.hash = "#products";
    } else if (view === "investors") {
      window.location.hash = "#investors";
    } else if (view === "investor-details" && slug) {
      window.location.hash = `#investor/${slug}`;
    } else if (view === "ai-copilot") {
      window.location.hash = "#ai-copilot";
    }
  };

  const handleCompanyCreated = () => {
    // Reload dashboard state to show newly created company
    setReloadKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans" id="app-root-container">
      {/* 1. App Sidebar Left */}
      <Sidebar 
        currentView={viewState.view} 
        onNavigate={handleNavigate}
        onOpenCreateCompany={() => setIsCreateModalOpen(true)}
      />

      {/* 2. Main Content Right */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* Top Header / Navigation Bar */}
        <header id="app-header-nav" className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-8 py-4 flex items-center justify-between gap-6">
          <SearchBar onNavigate={handleNavigate} />
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-mono font-bold text-slate-400 hover:text-slate-200 transition-colors hidden sm:block"
            >
              API Reference
            </a>
            
            <div className="h-5 w-[1px] bg-slate-900 hidden sm:block"></div>
            
            <div className="flex items-center space-x-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20"></span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">SECURE CONNECTION</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Views Wrapper */}
        <main className="flex-1 px-8 py-6 max-w-7xl w-full mx-auto" key={reloadKey}>
          {viewState.view === "dashboard" && (
            <DashboardPage 
              onCompanyClick={(slug) => handleNavigate("company-details", slug)}
              onNavigate={handleNavigate}
            />
          )}

          {viewState.view === "company-details" && viewState.selectedSlug && (
            <CompanyDetailsPage 
              companySlug={viewState.selectedSlug}
              onBack={() => handleNavigate("dashboard")}
              onCompanyClick={(slug) => handleNavigate("company-details", slug)}
            />
          )}

          {viewState.view === "products" && (
            <ProductsPage 
              onCompanyClick={(slug) => handleNavigate("company-details", slug)}
            />
          )}

          {viewState.view === "investors" && (
            <InvestorsPage 
              onInvestorClick={(slug) => handleNavigate("investor-details", slug)}
            />
          )}

          {viewState.view === "investor-details" && viewState.selectedSlug && (
            <InvestorProfilePage 
              investorSlug={viewState.selectedSlug}
              onBack={() => handleNavigate("investors")}
              onCompanyClick={(slug) => handleNavigate("company-details", slug)}
            />
          )}

          {viewState.view === "ai-copilot" && (
            <AiAnalystPage 
              onCompanyClick={(slug) => handleNavigate("company-details", slug)}
            />
          )}
        </main>

        {/* App footer */}
        <Footer />
      </div>

      {/* 3. Global Create Company overlay modal */}
      <CreateCompanyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onCompanyCreated={handleCompanyCreated}
      />
    </div>
  );
}
