import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { dbStore } from "./src/db/dbStore.js";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Simple memory caching engine with TTL
class SimpleCache {
  private cache = new Map<string, { data: any; expiresAt: number }>();

  public get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  public set(key: string, data: any, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000
    });
  }
}

const apiCache = new SimpleCache();

// Middleware: JSON Body Parser
app.use(express.json());

// Middleware: Simple Rate Limiting (100 req/min)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "unknown-ip";
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    return next();
  }

  if (record.count >= 100) {
    return res.status(429).json({
      error: {
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded. Maximum 100 requests per minute."
      }
    });
  }

  record.count += 1;
  next();
}

app.use("/api/", rateLimiter);

// Standard Format Response helper
function sendResponse(res: Response, data: any, status = 200, meta: any = {}) {
  res.status(status).json({
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    },
    error: null
  });
}

// Standard Error Response helper
function sendError(res: Response, code: string, message: string, status = 400) {
  res.status(status).json({
    data: null,
    meta: { timestamp: new Date().toISOString() },
    error: { code, message }
  });
}

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. GET /api/stats (Cached)
app.get("/api/stats", (req: Request, res: Response) => {
  const cacheKey = "api_stats";
  const cachedData = apiCache.get(cacheKey);

  if (cachedData) {
    return sendResponse(res, cachedData, 200, { cached: true });
  }

  const companiesCount = dbStore.companies.length;
  const fundingTotal = dbStore.companies.reduce((sum, c) => sum + (c.funding_total || 0), 0);
  const investorsCount = dbStore.investors.length;
  const productsCount = dbStore.products.length;
  const averageGrowth = dbStore.companies.reduce((sum, c) => sum + (c.growth_score || 0), 0) / (companiesCount || 1);

  const stats = {
    total_companies: companiesCount,
    total_funding_m: Math.round(fundingTotal * 10) / 10,
    total_investors: investorsCount,
    total_products: productsCount,
    average_growth_score: Math.round(averageGrowth * 10) / 10
  };

  apiCache.set(cacheKey, stats, 15); // cache for 15 seconds
  sendResponse(res, stats, 200, { cached: false });
});

// 2. GET /api/companies (With filters & sorting)
app.get("/api/companies", (req: Request, res: Response) => {
  const { category, stage, country, sort, q } = req.query;

  let list = [...dbStore.companies];

  // Filtering
  if (category) {
    list = list.filter(c => c.category.toLowerCase() === String(category).toLowerCase());
  }
  if (stage) {
    list = list.filter(c => c.stage.toLowerCase() === String(stage).toLowerCase());
  }
  if (country) {
    list = list.filter(c => c.hq_country.toLowerCase() === String(country).toLowerCase());
  }
  if (q) {
    const searchStr = String(q).toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(searchStr) || c.description.toLowerCase().includes(searchStr));
  }

  // Map to include computed trending score
  let mappedList = list.map(c => ({
    ...c,
    trending_score: dbStore.getCompanyTrendingScore(c)
  }));

  // Sorting
  if (sort === "funded") {
    mappedList.sort((a, b) => b.funding_total - a.funding_total);
  } else if (sort === "new") {
    mappedList.sort((a, b) => b.founded_year - a.founded_year);
  } else {
    // default to trending
    mappedList.sort((a, b) => b.trending_score - a.trending_score);
  }

  sendResponse(res, mappedList);
});

// 3. GET /api/companies/trending (Top 10 - Cached)
app.get("/api/companies/trending", (req: Request, res: Response) => {
  const cacheKey = "companies_trending";
  const cachedData = apiCache.get(cacheKey);

  if (cachedData) {
    return sendResponse(res, cachedData, 200, { cached: true });
  }

  const companiesWithScore = dbStore.companies.map(c => ({
    ...c,
    trending_score: dbStore.getCompanyTrendingScore(c)
  }));

  companiesWithScore.sort((a, b) => b.trending_score - a.trending_score);
  const top10 = companiesWithScore.slice(0, 10);

  apiCache.set(cacheKey, top10, 10); // Cache for 10s
  sendResponse(res, top10, 200, { cached: false });
});

// 4. GET /api/companies/:slug (Full profile + relations)
app.get("/api/companies/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;
  const company = dbStore.companies.find(c => c.slug === slug);

  if (!company) {
    return sendError(res, "NOT_FOUND", `Company with slug "${slug}" not found`, 404);
  }

  const fullProfile = dbStore.getCompanyWithRelations(company);
  sendResponse(res, fullProfile);
});

// 5. GET /api/companies/:slug/funding (Funding rounds timeline)
app.get("/api/companies/:slug/funding", (req: Request, res: Response) => {
  const { slug } = req.params;
  const company = dbStore.companies.find(c => c.slug === slug);

  if (!company) {
    return sendError(res, "NOT_FOUND", `Company with slug "${slug}" not found`, 404);
  }

  const rounds = dbStore.fundingRounds.filter(f => f.company_id === company.id);
  rounds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  sendResponse(res, rounds);
});

// 6. GET /api/companies/:slug/products (Products)
app.get("/api/companies/:slug/products", (req: Request, res: Response) => {
  const { slug } = req.params;
  const company = dbStore.companies.find(c => c.slug === slug);

  if (!company) {
    return sendError(res, "NOT_FOUND", `Company with slug "${slug}" not found`, 404);
  }

  const products = dbStore.products.filter(p => p.company_id === company.id);
  sendResponse(res, products);
});

// 7. GET /api/companies/:slug/graph (1-hop Ecosystem Graph)
app.get("/api/companies/:slug/graph", (req: Request, res: Response) => {
  const { slug } = req.params;
  const company = dbStore.companies.find(c => c.slug === slug);

  if (!company) {
    return sendError(res, "NOT_FOUND", `Company with slug "${slug}" not found`, 404);
  }

  const rounds = dbStore.fundingRounds.filter(f => f.company_id === company.id);
  const leadInvestorIds = rounds.map(r => r.lead_investor_id).filter(id => id !== null) as string[];
  const investors = dbStore.investors.filter(i => leadInvestorIds.includes(i.id));
  const products = dbStore.products.filter(p => p.company_id === company.id);
  
  // Competitors are companies in the same category
  const competitors = dbStore.companies.filter(c => c.category === company.category && c.id !== company.id);

  // Return nodes and edges
  const nodes = [
    { id: company.id, label: company.name, type: "company", logo: company.logo_url },
    ...investors.map(i => ({ id: i.id, label: i.name, type: "investor", logo: i.logo_url })),
    ...products.map(p => ({ id: p.id, label: p.name, type: "product" })),
    ...competitors.map(c => ({ id: c.id, label: c.name, type: "competitor", logo: c.logo_url }))
  ];

  const edges: { source: string; target: string; relationship: string }[] = [];
  
  investors.forEach(inv => {
    edges.push({ source: inv.id, target: company.id, relationship: "Investor" });
  });

  products.forEach(prod => {
    edges.push({ source: company.id, target: prod.id, relationship: "Product" });
  });

  competitors.forEach(comp => {
    edges.push({ source: company.id, target: comp.id, relationship: "Competitor" });
  });

  sendResponse(res, { nodes, edges });
});

// 8. GET /api/investors (List with filters)
app.get("/api/investors", (req: Request, res: Response) => {
  const { type, stage, sector } = req.query;
  let list = [...dbStore.investors];

  if (type) {
    list = list.filter(i => i.type.toLowerCase() === String(type).toLowerCase());
  }
  if (stage) {
    list = list.filter(i => i.stage_focus.some(s => s.toLowerCase() === String(stage).toLowerCase()));
  }
  if (sector) {
    list = list.filter(i => i.sector_focus.some(s => s.toLowerCase() === String(sector).toLowerCase()));
  }

  sendResponse(res, list);
});

// 9. GET /api/investors/:slug (Profile + portfolio breakdown)
app.get("/api/investors/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;
  const investor = dbStore.investors.find(i => i.slug === slug);

  if (!investor) {
    return sendError(res, "NOT_FOUND", `Investor with slug "${slug}" not found`, 404);
  }

  // Get portfolio companies
  const rounds = dbStore.fundingRounds.filter(r => r.lead_investor_id === investor.id);
  const companyIds = Array.from(new Set(rounds.map(r => r.company_id)));
  const portfolio = dbStore.companies.filter(c => companyIds.includes(c.id));

  // Compute concentration percentages
  const categoryCounts: Record<string, number> = {};
  portfolio.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const totalPortfolio = portfolio.length || 1;
  const portfolio_concentration = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    percentage: Math.round((categoryCounts[cat] / totalPortfolio) * 100)
  })).sort((a, b) => b.percentage - a.percentage);

  sendResponse(res, {
    ...investor,
    portfolio,
    portfolio_concentration
  });
});

// 10. GET /api/investors/:slug/investments (Investment History)
app.get("/api/investors/:slug/investments", (req: Request, res: Response) => {
  const { slug } = req.params;
  const investor = dbStore.investors.find(i => i.slug === slug);

  if (!investor) {
    return sendError(res, "NOT_FOUND", `Investor with slug "${slug}" not found`, 404);
  }

  const rounds = dbStore.fundingRounds.filter(
    r => r.lead_investor_id === investor.id || r.co_investors.includes(investor.name)
  );

  const enrichedRounds = rounds.map(r => {
    const company = dbStore.companies.find(c => c.id === r.company_id);
    return {
      ...r,
      company: company ? { name: company.name, slug: company.slug, logo_url: company.logo_url } : null
    };
  });

  sendResponse(res, enrichedRounds);
});

// 11. GET /api/investors/most-active
app.get("/api/investors/most-active", (req: Request, res: Response) => {
  const investorsWithDeals = dbStore.investors.map(inv => {
    const dealsCount = dbStore.fundingRounds.filter(r => r.lead_investor_id === inv.id).length;
    return {
      ...inv,
      deal_count_90_days: dealsCount
    };
  });

  investorsWithDeals.sort((a, b) => b.deal_count_90_days - a.deal_count_90_days);
  sendResponse(res, investorsWithDeals);
});

// 12. GET /api/products (List with categories & sorting)
app.get("/api/products", (req: Request, res: Response) => {
  const { category, sort } = req.query;
  let list = [...dbStore.products];

  if (category) {
    list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  const enrichedList = list.map(p => {
    const company = dbStore.companies.find(c => c.id === p.company_id);
    return {
      ...p,
      company: company ? { name: company.name, slug: company.slug, logo_url: company.logo_url } : null
    };
  });

  if (sort === "newest") {
    enrichedList.sort((a, b) => new Date(b.launch_date).getTime() - new Date(a.launch_date).getTime());
  } else {
    // default: popular by upvotes
    enrichedList.sort((a, b) => b.upvotes - a.upvotes);
  }

  sendResponse(res, enrichedList);
});

// 13. GET /api/products/:slug (Search by product name slug)
app.get("/api/products/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;
  const product = dbStore.products.find(
    p => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );

  if (!product) {
    return sendError(res, "NOT_FOUND", `Product with slug "${slug}" not found`, 404);
  }

  const company = dbStore.companies.find(c => c.id === product.company_id);
  sendResponse(res, {
    ...product,
    company: company ? { name: company.name, slug: company.slug, logo_url: company.logo_url } : null
  });
});

// 14. GET /api/news (Paginated with tag filter)
app.get("/api/news", (req: Request, res: Response) => {
  const { tag } = req.query;
  let list = [...dbStore.newsArticles];

  if (tag) {
    list = list.filter(n => n.tag.toLowerCase() === String(tag).toLowerCase());
  }

  list.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  sendResponse(res, list);
});

// 15. GET /api/news/trending
app.get("/api/news/trending", (req: Request, res: Response) => {
  // Sort by recency for trending news mock
  const list = [...dbStore.newsArticles];
  list.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  sendResponse(res, list.slice(0, 5));
});

// 16. GET /api/search (Cross-entity search)
app.get("/api/search", (req: Request, res: Response) => {
  const query = String(req.query.q || "").toLowerCase().trim();

  if (!query) {
    return sendResponse(res, {
      companies: [],
      investors: [],
      founders: [],
      products: []
    });
  }

  const matchedCompanies = dbStore.companies.filter(
    c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query) || c.category.toLowerCase().includes(query)
  ).slice(0, 5);

  const matchedInvestors = dbStore.investors.filter(
    i => i.name.toLowerCase().includes(query) || i.bio.toLowerCase().includes(query)
  ).slice(0, 5);

  const matchedFounders = dbStore.founders.filter(
    f => f.name.toLowerCase().includes(query) || f.bio.toLowerCase().includes(query)
  ).slice(0, 5);

  const matchedProducts = dbStore.products.filter(
    p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
  ).slice(0, 5);

  sendResponse(res, {
    companies: matchedCompanies,
    investors: matchedInvestors,
    founders: matchedFounders,
    products: matchedProducts
  });
});

// 17. POST /api/companies (With API validation and schema check)
app.post("/api/companies", (req: Request, res: Response) => {
  const apiKey = req.headers["x-api-key"];
  
  if (!apiKey) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "X-API-Key header is missing"
      }
    });
  }

  try {
    const validatedData = dbStore.companyCreateSchema.parse(req.body);
    const newCompany = dbStore.addCompany(validatedData);
    sendResponse(res, newCompany, 201, { status: "created" });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: err.issues.map(e => `${e.path.join(".")}: ${e.message}`).join(", ")
        }
      });
    }
    return sendError(res, "CONFLICT", err.message || "An error occurred", 409);
  }
});

// 18. GET /api/founders/:slug
app.get("/api/founders/:slug", (req: Request, res: Response) => {
  const { slug } = req.params;
  const founder = dbStore.founders.find(f => f.slug === slug);

  if (!founder) {
    return sendError(res, "NOT_FOUND", `Founder with slug "${slug}" not found`, 404);
  }

  const company = dbStore.companies.find(c => c.id === founder.company_id);
  sendResponse(res, {
    ...founder,
    company: company ? { name: company.name, slug: company.slug, logo_url: company.logo_url } : null
  });
});

// 19. GET /api/feed (Activity Feed mixing News, Funding rounds, Products)
app.get("/api/feed", (req: Request, res: Response) => {
  const items: any[] = [];

  // Mix news
  dbStore.newsArticles.forEach(news => {
    const relCompanies = dbStore.companies.filter(c => news.related_company_ids.includes(c.id));
    items.push({
      type: "news",
      id: news.id,
      title: news.title,
      summary: news.summary,
      source: news.source,
      tag: news.tag,
      date: news.published_at,
      companies: relCompanies.map(c => ({ name: c.name, slug: c.slug }))
    });
  });

  // Mix funding rounds
  dbStore.fundingRounds.forEach(round => {
    const company = dbStore.companies.find(c => c.id === round.company_id);
    if (company) {
      const investor = round.lead_investor_id 
        ? dbStore.investors.find(i => i.id === round.lead_investor_id) 
        : null;
      items.push({
        type: "funding",
        id: round.id,
        title: `${company.name} raised $${round.amount}M in ${round.round_type}`,
        date: round.date,
        amount: round.amount,
        round_type: round.round_type,
        company: { name: company.name, slug: company.slug, logo_url: company.logo_url },
        lead_investor: investor ? { name: investor.name, slug: investor.slug } : null
      });
    }
  });

  // Mix newly launched products
  dbStore.products.forEach(prod => {
    const company = dbStore.companies.find(c => c.id === prod.company_id);
    if (company) {
      items.push({
        type: "product_launch",
        id: prod.id,
        title: `New product launched: ${prod.name} by ${company.name}`,
        description: prod.description,
        date: prod.launch_date,
        category: prod.category,
        upvotes: prod.upvotes,
        company: { name: company.name, slug: company.slug, logo_url: company.logo_url }
      });
    }
  });

  // Sort by date descending
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  sendResponse(res, items.slice(0, 20));
});


// GEMINI INTELLIGENCE ASSISTANT

let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

app.post("/api/ai/chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return sendError(res, "BAD_REQUEST", "messages array is required in body", 400);
    }

    // Get DB info for context
    const companiesList = dbStore.companies
      .map(c => `- **${c.name}** (${c.category}, Stage: ${c.stage}): ${c.description}. Valuation: $${c.valuation}M, Funding: $${c.funding_total}M. Growth Score: ${c.growth_score}/100.`)
      .join("\n");

    const investorsList = dbStore.investors
      .map(i => `- **${i.name}** (${i.type}): Focuses on stages [${i.stage_focus.join(", ")}] and sectors [${i.sector_focus.join(", ")}]. Bio: ${i.bio}`)
      .join("\n");

    const productsList = dbStore.products
      .map(p => `- **${p.name}** (${p.category}): ${p.description}. Upvotes: ${p.upvotes}`)
      .join("\n");

    const newsList = dbStore.newsArticles
      .map(n => `- **${n.title}** (${n.tag}): ${n.summary} [Source: ${n.source}]`)
      .join("\n");

    const systemInstruction = `You are "GraphOne Copilot", the leading AI Startup & Venture Intelligence Assistant for the GraphOne Discovery platform.
You possess real-time access to the platform's database containing active AI startups, venture investors, newly launched products, and industry news.

Here is the complete state of the GraphOne live database:
=== COMPANIES ===
${companiesList}

=== INVESTORS ===
${investorsList}

=== PRODUCTS ===
${productsList}

=== RECENT VENTURE NEWS ===
${newsList}

 role:
1. Act as an elite Venture Capitalist and Product-Market Fit analyst.
2. Provide concise, deep, actionable insights with structural markdown headings, bold accents, bullet points, and data-driven estimates.
3. Reference real startups or investors from our database whenever relevant.
4. When comparing startups or analyzing a sector, explain the "Growth Score" or structural alignment.
5. If requested to talk about general tech or companies outside this list (e.g., OpenAI, Anthropic), use your full web knowledge base but state clearly how they relate or compare to our current listed entities.
6. Speak directly, objectively, and avoid verbose platitudes. Maximize visual scanability of your markdown response.`;

    const client = getGemini();

    // Map messages history to Gemini parts structure
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I was unable to formulate a response. Please check your query details.";
    sendResponse(res, { content: reply });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    sendError(res, "AI_SERVICE_ERROR", err.message || "An error occurred with the AI Service. Please verify that the GEMINI_API_KEY is configured in the Secrets panel.", 500);
  }
});


// ==========================================
// VITE OR STATIC FRONTEND SERVING
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

 app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
}

start();
