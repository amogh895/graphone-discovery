export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  funding_total: number; // in millions
  employee_count: number;
  founded_year: number;
  hq_city: string;
  hq_country: string;
  logo_url: string;
  website: string;
  stage: string;
  is_unicorn: boolean;
  valuation: number; // in millions
  growth_score: number;
  last_scraped_at: string;
  data_confidence_score: number;
}

export interface Investor {
  id: string;
  name: string;
  slug: string;
  type: string;
  bio: string;
  aum: number; // in millions
  portfolio_count: number;
  stage_focus: string[];
  sector_focus: string[];
  location: string;
  logo_url: string;
  avg_check_size: number; // in millions
  fund_number: number;
}

export interface FundingRound {
  id: string;
  company_id: string;
  round_type: string;
  amount: number; // in millions
  currency: string;
  date: string;
  lead_investor_id: string | null;
  co_investors: string[]; // names of other investors
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

export const initialCompanies: Company[] = [
  {
    id: "co_1",
    name: "OpenAI",
    slug: "openai",
    description: "An AI research and deployment company building safe and beneficial artificial general intelligence.",
    category: "Foundation Models",
    funding_total: 13000,
    employee_count: 1400,
    founded_year: 2015,
    hq_city: "San Francisco",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop&q=80",
    website: "https://openai.com",
    stage: "Growth",
    is_unicorn: true,
    valuation: 157000,
    growth_score: 98,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 95
  },
  {
    id: "co_2",
    name: "Anthropic",
    slug: "anthropic",
    description: "A public benefit corporation dedicated to building helpful, honest, and harmless AI systems.",
    category: "Foundation Models",
    funding_total: 9700,
    employee_count: 850,
    founded_year: 2021,
    hq_city: "San Francisco",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80",
    website: "https://anthropic.com",
    stage: "Growth",
    is_unicorn: true,
    valuation: 40000,
    growth_score: 95,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 93
  },
  {
    id: "co_3",
    name: "Perplexity",
    slug: "perplexity",
    description: "An AI-powered conversational search engine that delivers real-time, accurate answers with citations.",
    category: "AI Search",
    funding_total: 510,
    employee_count: 180,
    founded_year: 2022,
    hq_city: "San Francisco",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&h=100&fit=crop&q=80",
    website: "https://perplexity.ai",
    stage: "Series C",
    is_unicorn: true,
    valuation: 9000,
    growth_score: 97,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 94
  },
  {
    id: "co_4",
    name: "Cursor",
    slug: "cursor",
    description: "An AI-first code editor built for pair-programming with a highly contextual assistant.",
    category: "AI Coding",
    funding_total: 68,
    employee_count: 45,
    founded_year: 2022,
    hq_city: "San Francisco",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop&q=80",
    website: "https://cursor.com",
    stage: "Series A",
    is_unicorn: false,
    valuation: 400,
    growth_score: 99,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 92
  },
  {
    id: "co_5",
    name: "Midjourney",
    slug: "midjourney",
    description: "An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.",
    category: "AI Image",
    funding_total: 0,
    employee_count: 60,
    founded_year: 2021,
    hq_city: "San Francisco",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100&h=100&fit=crop&q=80",
    website: "https://midjourney.com",
    stage: "Bootstrapped",
    is_unicorn: true,
    valuation: 10000,
    growth_score: 92,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 91
  },
  {
    id: "co_6",
    name: "Runway",
    slug: "runway",
    description: "An applied AI research company shaping the next era of art, entertainment, and human creativity with generative video.",
    category: "AI Video",
    funding_total: 237,
    employee_count: 150,
    founded_year: 2018,
    hq_city: "New York",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=100&h=100&fit=crop&q=80",
    website: "https://runwayml.com",
    stage: "Series C",
    is_unicorn: true,
    valuation: 1500,
    growth_score: 89,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 90
  },
  {
    id: "co_7",
    name: "Hugging Face",
    slug: "hugging-face",
    description: "The platform where the machine learning community collaborates on models, datasets, and applications.",
    category: "AI Infrastructure",
    funding_total: 395,
    employee_count: 310,
    founded_year: 2016,
    hq_city: "Paris",
    hq_country: "France",
    logo_url: "https://images.unsplash.com/photo-1601153211116-62431f822383?w=100&h=100&fit=crop&q=80",
    website: "https://huggingface.co",
    stage: "Series D",
    is_unicorn: true,
    valuation: 4500,
    growth_score: 91,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 95
  },
  {
    id: "co_8",
    name: "ElevenLabs",
    slug: "elevenlabs",
    description: "A voice technology research company developing the most realistic, versatile, and contextually-aware AI audio software.",
    category: "AI Voice",
    funding_total: 101,
    employee_count: 120,
    founded_year: 2022,
    hq_city: "London",
    hq_country: "UK",
    logo_url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop&q=80",
    website: "https://elevenlabs.io",
    stage: "Series B",
    is_unicorn: true,
    valuation: 1100,
    growth_score: 96,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 94
  },
  {
    id: "co_9",
    name: "Pika",
    slug: "pika",
    description: "An AI video generation platform that lets anyone easily animate their ideas into professional-grade videos.",
    category: "AI Video",
    funding_total: 55,
    employee_count: 40,
    founded_year: 2023,
    hq_city: "Palo Alto",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=100&h=100&fit=crop&q=80",
    website: "https://pika.art",
    stage: "Series A",
    is_unicorn: false,
    valuation: 250,
    growth_score: 86,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 88
  },
  {
    id: "co_10",
    name: "Lovable",
    slug: "lovable",
    description: "An AI application building platform designed to enable anyone to generate, edit, and launch web applications using natural language.",
    category: "AI Coding",
    funding_total: 7.5,
    employee_count: 25,
    founded_year: 2024,
    hq_city: "Stockholm",
    hq_country: "Sweden",
    logo_url: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=100&h=100&fit=crop&q=80",
    website: "https://lovable.dev",
    stage: "Seed",
    is_unicorn: false,
    valuation: 35,
    growth_score: 94,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 87
  },
  {
    id: "co_11",
    name: "Cognition",
    slug: "cognition",
    description: "An applied AI lab focused on reasoning, creating Devin, the world's first fully autonomous AI software engineer.",
    category: "AI Coding",
    funding_total: 196,
    employee_count: 60,
    founded_year: 2023,
    hq_city: "San Francisco",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop&q=80",
    website: "https://cognition.ai",
    stage: "Series B",
    is_unicorn: true,
    valuation: 2000,
    growth_score: 93,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 90
  },
  {
    id: "co_12",
    name: "Harvey",
    slug: "harvey",
    description: "An AI-powered legal platform designed specifically for law firms, providing tools for drafting, research, and analysis.",
    category: "Healthcare & AI Legal",
    funding_total: 106,
    employee_count: 110,
    founded_year: 2022,
    hq_city: "San Francisco",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&h=100&fit=crop&q=80",
    website: "https://harvey.ai",
    stage: "Series B",
    is_unicorn: true,
    valuation: 1500,
    growth_score: 88,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 92
  },
  {
    id: "co_13",
    name: "Glean",
    slug: "glean",
    description: "An enterprise generative AI search and knowledge management platform connecting all corporate applications and data safely.",
    category: "AI Search",
    funding_total: 350,
    employee_count: 450,
    founded_year: 2019,
    hq_city: "Palo Alto",
    hq_country: "USA",
    logo_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop&q=80",
    website: "https://glean.com",
    stage: "Series D",
    is_unicorn: true,
    valuation: 4600,
    growth_score: 92,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 94
  },
  {
    id: "co_14",
    name: "Cohere",
    slug: "cohere",
    description: "An enterprise-focused foundation model company providing highly secure LLMs and search/retrieval embeddings.",
    category: "Foundation Models",
    funding_total: 970,
    employee_count: 400,
    founded_year: 2019,
    hq_city: "Toronto",
    hq_country: "Canada",
    logo_url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=100&h=100&fit=crop&q=80",
    website: "https://cohere.com",
    stage: "Series D",
    is_unicorn: true,
    valuation: 5500,
    growth_score: 90,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 93
  },
  {
    id: "co_15",
    name: "Mistral AI",
    slug: "mistral-ai",
    description: "A European AI company championing open-source models, custom training architectures, and high-performance computing.",
    category: "Foundation Models",
    funding_total: 640,
    employee_count: 100,
    founded_year: 2023,
    hq_city: "Paris",
    hq_country: "France",
    logo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80",
    website: "https://mistral.ai",
    stage: "Series B",
    is_unicorn: true,
    valuation: 6000,
    growth_score: 94,
    last_scraped_at: new Date().toISOString(),
    data_confidence_score: 91
  }
];

export const initialInvestors: Investor[] = [
  {
    id: "inv_1",
    name: "Sequoia Capital",
    slug: "sequoia-capital",
    type: "VC",
    bio: "Sequoia Capital helps daring founders build legendary companies, from idea to IPO and beyond. They partner with visionaries in AI and advanced software.",
    aum: 85000,
    portfolio_count: 1200,
    stage_focus: ["Seed", "Series A", "Series B", "Growth"],
    sector_focus: ["Foundation Models", "AI Coding", "AI Search", "AI Infrastructure"],
    location: "Menlo Park, California, USA",
    logo_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&q=80",
    avg_check_size: 15,
    fund_number: 12
  },
  {
    id: "inv_2",
    name: "Andreessen Horowitz",
    slug: "a16z",
    type: "VC",
    bio: "Andreessen Horowitz (a16z) is a stage-agnostic venture capital firm that backs bold entrepreneurs building the future through technology.",
    aum: 43000,
    portfolio_count: 950,
    stage_focus: ["Seed", "Series A", "Series B", "Growth"],
    sector_focus: ["Foundation Models", "AI Coding", "AI Voice", "AI Search", "AI Video"],
    location: "Menlo Park, California, USA",
    logo_url: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&h=100&fit=crop&q=80",
    avg_check_size: 20,
    fund_number: 8
  },
  {
    id: "inv_3",
    name: "Founders Fund",
    slug: "founders-fund",
    type: "VC",
    bio: "Founders Fund is a San Francisco-based venture capital firm investing in science and technology companies solving difficult problems.",
    aum: 11000,
    portfolio_count: 320,
    stage_focus: ["Seed", "Series A", "Series B"],
    sector_focus: ["Foundation Models", "AI Coding", "Healthcare & AI Legal"],
    location: "San Francisco, California, USA",
    logo_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=100&h=100&fit=crop&q=80",
    avg_check_size: 12,
    fund_number: 6
  },
  {
    id: "inv_4",
    name: "Y Combinator",
    slug: "y-combinator",
    type: "Angel",
    bio: "Y Combinator is a startup accelerator that launches twice a year and provides seed funding, mentorship, and an unparalleled founder network.",
    aum: 5000,
    portfolio_count: 4500,
    stage_focus: ["Seed"],
    sector_focus: ["AI Coding", "AI Voice", "AI Search", "AI Video", "AI Image"],
    location: "Mountain View, California, USA",
    logo_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&q=80",
    avg_check_size: 0.5,
    fund_number: 28
  },
  {
    id: "inv_5",
    name: "General Catalyst",
    slug: "general-catalyst",
    type: "VC",
    bio: "General Catalyst invests in powerful, positive change that endures, backing early-stage and growth equity startups globally.",
    aum: 25000,
    portfolio_count: 650,
    stage_focus: ["Seed", "Series A", "Series B", "Growth"],
    sector_focus: ["AI Infrastructure", "AI Search", "Healthcare & AI Legal"],
    location: "Cambridge, Massachusetts, USA",
    logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&q=80",
    avg_check_size: 10,
    fund_number: 11
  }
];

export const initialFounders: Founder[] = [
  {
    id: "f_1",
    name: "Sam Altman",
    slug: "sam-altman",
    title: "CEO & Co-founder",
    company_id: "co_1",
    bio: "Sam Altman is an American entrepreneur, investor, and CEO of OpenAI.",
    twitter: "https://twitter.com/sama",
    linkedin: "https://linkedin.com/in/samaltman",
    location: "San Francisco, CA",
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "f_2",
    name: "Dario Amodei",
    slug: "dario-amodei",
    title: "CEO & Co-founder",
    company_id: "co_2",
    bio: "Dario Amodei is an Italian-American artificial intelligence researcher and CEO of Anthropic. Previously, VP of Research at OpenAI.",
    twitter: "https://twitter.com/darioamodei",
    linkedin: "https://linkedin.com/in/dario-amodei",
    location: "San Francisco, CA",
    photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "f_3",
    name: "Aravind Srinivas",
    slug: "aravind-srinivas",
    title: "CEO & Co-founder",
    company_id: "co_3",
    bio: "Aravind Srinivas is the CEO of Perplexity AI. Formerly AI researcher at OpenAI, DeepMind, and Google.",
    twitter: "https://twitter.com/aravsrinivas",
    linkedin: "https://linkedin.com/in/aravindsrinivas",
    location: "San Francisco, CA",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "f_4",
    name: "Arvid Lunnemar",
    slug: "arvid-lunnemar",
    title: "Co-founder",
    company_id: "co_4",
    bio: "Arvid is one of the key creators behind Cursor, an AI-first development experience.",
    twitter: "https://twitter.com/arvidl",
    location: "San Francisco, CA",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80"
  },
  {
    id: "f_5",
    name: "David Holz",
    slug: "david-holz",
    title: "Founder & CEO",
    company_id: "co_5",
    bio: "David Holz is the founder of Midjourney. He previously co-founded Leap Motion and conducted research at NASA.",
    twitter: "https://twitter.com/davidholz",
    location: "San Francisco, CA",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80"
  }
];

export const initialFundingRounds: FundingRound[] = [
  {
    id: "fr_1",
    company_id: "co_1",
    round_type: "Series B",
    amount: 1000,
    currency: "USD",
    date: "2019-07-22",
    lead_investor_id: "inv_2",
    co_investors: ["Kholsa Ventures", "Tiger Global"]
  },
  {
    id: "fr_2",
    company_id: "co_1",
    round_type: "Growth",
    amount: 10000,
    currency: "USD",
    date: "2023-01-23",
    lead_investor_id: "inv_1",
    co_investors: ["Microsoft", "a16z", "Founders Fund"]
  },
  {
    id: "fr_3",
    company_id: "co_2",
    round_type: "Series C",
    amount: 450,
    currency: "USD",
    date: "2023-05-23",
    lead_investor_id: "inv_5",
    co_investors: ["Google", "Salesforce Ventures", "Zoom Ventures"]
  },
  {
    id: "fr_4",
    company_id: "co_2",
    round_type: "Growth",
    amount: 4000,
    currency: "USD",
    date: "2024-03-27",
    lead_investor_id: "inv_2",
    co_investors: ["Amazon", "Sequoia Capital"]
  },
  {
    id: "fr_5",
    company_id: "co_3",
    round_type: "Series B",
    amount: 73.6,
    currency: "USD",
    date: "2024-01-04",
    lead_investor_id: "inv_3",
    co_investors: ["Jeff Bezos", "NVIDIA", "NEA"]
  },
  {
    id: "fr_6",
    company_id: "co_3",
    round_type: "Series C",
    amount: 250,
    currency: "USD",
    date: "2024-04-23",
    lead_investor_id: "inv_1",
    co_investors: ["a16z", "DST Global", "Madrone Capital Partners"]
  },
  {
    id: "fr_7",
    company_id: "co_4",
    round_type: "Seed",
    amount: 8,
    currency: "USD",
    date: "2023-04-12",
    lead_investor_id: "inv_4",
    co_investors: ["First Round Capital"]
  },
  {
    id: "fr_8",
    company_id: "co_4",
    round_type: "Series A",
    amount: 60,
    currency: "USD",
    date: "2024-08-22",
    lead_investor_id: "inv_2",
    co_investors: ["Sequoia Capital", "Stripe founders"]
  },
  {
    id: "fr_9",
    company_id: "co_11",
    round_type: "Series A",
    amount: 21,
    currency: "USD",
    date: "2024-03-12",
    lead_investor_id: "inv_3",
    co_investors: ["Elad Gil", "Patrick Collison"]
  },
  {
    id: "fr_10",
    company_id: "co_11",
    round_type: "Series B",
    amount: 175,
    currency: "USD",
    date: "2024-04-25",
    lead_investor_id: "inv_3",
    co_investors: ["Founders Fund", "Index Ventures"]
  }
];

export const initialProducts: Product[] = [
  {
    id: "pr_1",
    company_id: "co_1",
    name: "ChatGPT",
    description: "Conversational language model capable of answering questions, writing essays, debugging code, and engaging in deep dialog.",
    category: "Chat",
    launch_date: "2022-11-30",
    upvotes: 42350,
    website_url: "https://chatgpt.com"
  },
  {
    id: "pr_2",
    company_id: "co_1",
    name: "GPT-4o",
    description: "Omni model processing text, audio, and vision inputs in real-time, delivering ultra-fast responses and human-like interactions.",
    category: "Chat",
    launch_date: "2024-05-13",
    upvotes: 38200,
    website_url: "https://openai.com/gpt-4o"
  },
  {
    id: "pr_3",
    company_id: "co_2",
    name: "Claude 3.5 Sonnet",
    description: "Anthropic's highest performance model setting new industry benchmarks for graduate-level reasoning, code generation, and visual processing.",
    category: "Chat",
    launch_date: "2024-06-20",
    upvotes: 31200,
    website_url: "https://claude.ai"
  },
  {
    id: "pr_4",
    company_id: "co_3",
    name: "Perplexity Copilot",
    description: "AI conversational search assistant that asks clarifying questions to tailor comprehensive reports with cited references.",
    category: "Chat",
    launch_date: "2023-05-15",
    upvotes: 19800,
    website_url: "https://perplexity.ai"
  },
  {
    id: "pr_5",
    company_id: "co_4",
    name: "Cursor Editor",
    description: "A customized fork of VS Code equipped with deeply-integrated AI modules for chat, tab completion, edits, and multiline suggestions.",
    category: "Code",
    launch_date: "2023-01-15",
    upvotes: 28500,
    website_url: "https://cursor.sh"
  },
  {
    id: "pr_6",
    company_id: "co_5",
    name: "Midjourney v6",
    description: "State-of-the-art text-to-image engine capable of photorealism, precise text rendering, and incredibly detailed artistic representations.",
    category: "Image",
    launch_date: "2023-12-21",
    upvotes: 27100,
    website_url: "https://midjourney.com"
  },
  {
    id: "pr_7",
    company_id: "co_6",
    name: "Runway Gen-3 Alpha",
    description: "High-fidelity text-to-video generation tool offering supreme control over camera movements, character consistency, and physics simulation.",
    category: "Video",
    launch_date: "2024-06-17",
    upvotes: 18900,
    website_url: "https://runwayml.com/gen-3"
  },
  {
    id: "pr_8",
    company_id: "co_7",
    name: "Hugging Face Spaces",
    description: "The easiest way to host, demo, and share machine learning models, applications, and interactive dashboards with the public.",
    category: "Image",
    launch_date: "2021-10-12",
    upvotes: 15400,
    website_url: "https://huggingface.co/spaces"
  },
  {
    id: "pr_9",
    company_id: "co_8",
    name: "ElevenLabs Reader",
    description: "A powerful audio generator turning any document, book, article, or PDF into crystal-clear natural narration in your preferred voice.",
    category: "Video",
    launch_date: "2024-06-25",
    upvotes: 14500,
    website_url: "https://elevenlabs.io/app"
  },
  {
    id: "pr_10",
    company_id: "co_9",
    name: "Pika 1.0",
    description: "An advanced video editing and synthesis model with options for aspect-ratio modification, inpainting, and text-to-video controls.",
    category: "Video",
    launch_date: "2023-11-28",
    upvotes: 12100,
    website_url: "https://pika.art"
  },
  {
    id: "pr_11",
    company_id: "co_10",
    name: "Lovable Software Builder",
    description: "An AI-powered builder that interprets user instructions to generate high-fidelity fully styled interactive web frontends in seconds.",
    category: "Code",
    launch_date: "2024-10-01",
    upvotes: 9500,
    website_url: "https://lovable.dev"
  },
  {
    id: "pr_12",
    company_id: "co_11",
    name: "Devin",
    description: "The first fully autonomous AI software engineer, capable of browsing, writing code, executing files, and debugging web-apps independently.",
    category: "Code",
    launch_date: "2024-03-12",
    upvotes: 32500,
    website_url: "https://cognition.ai/blog/introducing-devin"
  },
  {
    id: "pr_13",
    company_id: "co_12",
    name: "Harvey Assistant",
    description: "Professional generative AI lawyer co-pilot, capable of complete contract audits, citation finding, and state regulatory compliance analyses.",
    category: "Chat",
    launch_date: "2023-03-15",
    upvotes: 8900,
    website_url: "https://harvey.ai"
  },
  {
    id: "pr_14",
    company_id: "co_13",
    name: "Glean Workplace Search",
    description: "Generative search assistant indexing all slack, drive, jira, and outlook logs to find internal documents instantly.",
    category: "Chat",
    launch_date: "2021-09-01",
    upvotes: 11200,
    website_url: "https://glean.com"
  },
  {
    id: "pr_15",
    company_id: "co_14",
    name: "Cohere Command R+",
    description: "Highly scalable LLM fine-tuned for production RAG pipelines, database access, tool calling, and global 10-language translations.",
    category: "Chat",
    launch_date: "2024-04-04",
    upvotes: 13900,
    website_url: "https://cohere.com/model-registry"
  },
  {
    id: "pr_16",
    company_id: "co_15",
    name: "Codestral",
    description: "High-speed 22-billion parameter model optimized for code autocomplete, filler lines, and custom code translations in 80+ programming languages.",
    category: "Code",
    launch_date: "2024-05-29",
    upvotes: 14800,
    website_url: "https://mistral.ai/news/codestral"
  },
  {
    id: "pr_17",
    company_id: "co_1",
    name: "DALL-E 3",
    description: "A photorealistic and highly precise image generation engine deeply integrated into ChatGPT for precise prompt matching.",
    category: "Image",
    launch_date: "2023-10-04",
    upvotes: 21200,
    website_url: "https://openai.com/dall-e-3"
  },
  {
    id: "pr_18",
    company_id: "co_2",
    name: "Artifacts",
    description: "A rich workspace to view, edit, run, and modify generated HTML, SVG, and React applications directly inside Claude.",
    category: "Code",
    launch_date: "2024-06-20",
    upvotes: 26500,
    website_url: "https://claude.ai"
  },
  {
    id: "pr_19",
    company_id: "co_6",
    name: "Runway Gen-2",
    description: "Pioneering text-to-video AI rendering tool driving cinematic video sequences from short texts or starter reference frames.",
    category: "Video",
    launch_date: "2023-03-20",
    upvotes: 15100,
    website_url: "https://runwayml.com"
  },
  {
    id: "pr_20",
    company_id: "co_8",
    name: "ElevenLabs Dubbing",
    description: "Instant voice-preserving video translation tool that translates dialogue into 29+ languages while keeping original voices intact.",
    category: "Video",
    launch_date: "2023-10-10",
    upvotes: 17200,
    website_url: "https://elevenlabs.io"
  }
];

export const initialNewsArticles: NewsArticle[] = [
  {
    id: "news_1",
    title: "OpenAI Closes Landmark $6.6B Funding Round at $157B Valuation",
    url: "https://techcrunch.com/openai-6-6-billion",
    published_at: "2024-10-02T12:00:00Z",
    source: "TechCrunch",
    tag: "Funding",
    related_company_ids: ["co_1"],
    summary: "OpenAI announced a huge funding round of $6.6 billion to accelerate AGI research and expand compute infrastructure globally."
  },
  {
    id: "news_2",
    title: "Anthropic Unveils Claude 3.5 Sonnet, Beating Leading Industry Models",
    url: "https://venturebeat.com/anthropic-claude-3-5",
    published_at: "2024-06-20T08:00:00Z",
    source: "VentureBeat",
    tag: "Product Launch",
    related_company_ids: ["co_2"],
    summary: "Anthropic launched Claude 3.5 Sonnet, showing major logic gains, deep coding efficiency, and an interactive 'Artifacts' environment."
  },
  {
    id: "news_3",
    title: "Perplexity Launches Pro Search Upgrade with Advanced Multi-Step Reasoning",
    url: "https://wired.com/perplexity-pro-search",
    published_at: "2024-07-15T09:00:00Z",
    source: "Wired",
    tag: "Product Launch",
    related_company_ids: ["co_3"],
    summary: "Perplexity's latest search feature breaks down complex questions into systematic sub-searches, compiling comprehensive reports with links."
  },
  {
    id: "news_4",
    title: "Cognition AI Announces Devin, An Autonomous AI Software Developer",
    url: "https://bloomberg.com/cognition-devin",
    published_at: "2024-03-12T10:00:00Z",
    source: "Bloomberg",
    tag: "Product Launch",
    related_company_ids: ["co_11"],
    summary: "Cognition AI raised eyebrows worldwide with Devin, an AI agent capable of planning and coding full-stack programs autonomously."
  },
  {
    id: "news_5",
    title: "Sequoia Capital Doubles Down on Generative AI with Dedicated Fund Expansion",
    url: "https://reuters.com/sequoia-ai-expansion",
    published_at: "2024-05-18T14:30:00Z",
    source: "Reuters",
    tag: "Funding",
    related_company_ids: ["co_4", "co_3", "co_1"],
    summary: "Sequoia announced increased capital allocations targeting next-generation AI developer tools, custom foundation interfaces, and security startups."
  }
];
