export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  funding_total: number;
  employee_count: number;
  founded_year: number;
  hq_city: string;
  hq_country: string;
  logo_url: string;
  website: string;
  stage: string;
  is_unicorn: boolean;
  valuation: number;
  growth_score: number;
  last_scraped_at: string;
  data_confidence_score: number;
  trending_score?: number;
}

export interface Investor {
  id: string;
  name: string;
  slug: string;
  type: string;
  bio: string;
  aum: number;
  portfolio_count: number;
  stage_focus: string[];
  sector_focus: string[];
  location: string;
  logo_url: string;
  avg_check_size: number;
  fund_number: number;
}

export interface Founder {
  id: string;
  name: string;
  slug: string;
  title: string;
  company_id: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
  location: string;
  photo_url: string;
}

export interface Product {
  id: string;
  company_id: string;
  name: string;
  description: string;
  category: string;
  launch_date: string;
  upvotes: number;
  website_url: string;
  company?: {
    name: string;
    slug: string;
    logo_url: string;
  };
}

export interface FundingRound {
  id: string;
  company_id: string;
  round_type: string;
  amount: number;
  currency: string;
  date: string;
  lead_investor_id: string | null;
  co_investors: string[];
  lead_investor?: {
    name: string;
    slug: string;
    logo_url: string;
  } | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  published_at: string;
  source: string;
  tag: string;
  related_company_ids: string[];
  summary: string;
}

export type ViewType = "dashboard" | "company-details" | "products" | "investors" | "investor-details" | "ai-copilot";

export interface NavigationState {
  view: ViewType;
  selectedSlug?: string;
}
