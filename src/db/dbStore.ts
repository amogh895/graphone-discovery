import { z } from "zod";
import {
  initialCompanies,
  initialInvestors,
  initialFounders,
  initialFundingRounds,
  initialProducts,
  initialNewsArticles,
  Company,
  Investor,
  Founder,
  FundingRound,
  Product,
  NewsArticle
} from "../data/seedData.js";

// In-memory relational database state
class DatabaseStore {
  public companies: Company[] = [...initialCompanies];
  public investors: Investor[] = [...initialInvestors];
  public founders: Founder[] = [...initialFounders];
  public fundingRounds: FundingRound[] = [...initialFundingRounds];
  public products: Product[] = [...initialProducts];
  public newsArticles: NewsArticle[] = [...initialNewsArticles];

  // Calculated dynamic fields
  public getCompanyTrendingScore(company: Company): number {
    const companyProducts = this.products.filter(p => p.company_id === company.id);
    const totalUpvotes = companyProducts.reduce((sum, p) => sum + p.upvotes, 0);
    const newsCount = this.newsArticles.filter(n => n.related_company_ids.includes(company.id)).length;
    
    // Score based on metrics
    const growthComponent = (company.growth_score || 50) * 2.0;
    const employeeComponent = Math.min(company.employee_count * 0.1, 50); // cap at 50
    const fundingComponent = Math.min(company.funding_total * 0.02, 100); // cap at 100
    const upvotesComponent = Math.min(totalUpvotes * 0.005, 50); // cap at 50
    const newsComponent = newsCount * 15; // 15 points per article

    let baseScore = growthComponent + employeeComponent + fundingComponent + upvotesComponent + newsComponent;
    
    // Bootstrapped reward (scaling high growth without funds)
    if (company.stage === "Bootstrapped") {
      baseScore += 40;
    }

    return Math.round(baseScore * 10) / 10;
  }

  // Get full company payload with relations
  public getCompanyWithRelations(company: Company) {
    const cFounders = this.founders.filter(f => f.company_id === company.id);
    const cProducts = this.products.filter(p => p.company_id === company.id);
    const cFunding = this.fundingRounds.filter(f => f.company_id === company.id);
    const cNews = this.newsArticles.filter(n => n.related_company_ids.includes(company.id));

    // Map lead investor logo/details to funding rounds
    const detailedFunding = cFunding.map(round => {
      const investor = round.lead_investor_id 
        ? this.investors.find(i => i.id === round.lead_investor_id) 
        : null;
      return {
        ...round,
        lead_investor: investor ? {
          name: investor.name,
          slug: investor.slug,
          logo_url: investor.logo_url
        } : null
      };
    });

    return {
      ...company,
      trending_score: this.getCompanyTrendingScore(company),
      founders: cFounders,
      products: cProducts,
      funding_rounds: detailedFunding,
      news: cNews
    };
  }

  // Zod Validation Schema for creating a company
  public companyCreateSchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string().min(2, "Category is required"),
    funding_total: z.number().nonnegative().optional().default(0),
    employee_count: z.number().int().nonnegative().optional().default(1),
    founded_year: z.number().int().min(1900).max(2026),
    hq_city: z.string().min(2),
    hq_country: z.string().min(2),
    website: z.string().url(),
    stage: z.string().min(2),
    is_unicorn: z.boolean().optional().default(false),
    valuation: z.number().nonnegative().optional().default(0),
    growth_score: z.number().min(0).max(100).optional().default(50)
  });

  public addCompany(data: z.infer<typeof this.companyCreateSchema>) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    
    // Check duplication
    if (this.companies.some(c => c.slug === slug)) {
      throw new Error(`Company with name "${data.name}" already exists.`);
    }

    const newCompany: Company = {
      id: `co_${this.companies.length + 1}`,
      ...data,
      slug,
      logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80",
      last_scraped_at: new Date().toISOString(),
      data_confidence_score: 90
    };

    this.companies.push(newCompany);
    return newCompany;
  }
}

export const dbStore = new DatabaseStore();
export type { Company, Investor, Founder, FundingRound, Product, NewsArticle };
