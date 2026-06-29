# GraphOne AI Startup Discovery Platform

A production-ready, high-performance, and high-fidelity intelligence layer for the generative AI economy—designed and engineered as a modern discovery platform.

## 🚀 Key Achievements & Architecture

- **SPA Router Engine**: Implemented a stateful hash-based client router, offering bookmarkable and shareable direct paths (`#company/openai`, `#investors`, `#products`) without causing page reload glitches.
- **Relational Backend REST API**: Powered by a robust, stateful Express backend with high-speed rate-limiting, error handling, Zod validation, and multi-layered in-memory TTL caching.
- **Rich Relational Seed Data**: Populated with 15 leading AI companies (OpenAI, Anthropic, Cursor, Lovable, etc.), 5 prime venture investors (Sequoia, a16z, Y Combinator, etc.), 20 high-fidelity AI products, and real-time news syndications.
- **Interactive SVG Ecosystem Graph**: Designed an interactive, circular SVG diagram demonstrating 1-hop relationships (investors, competitor labs, associated products) with responsive hover metrics and nodes.
- **Dynamic Valuation & Allocations**: Displays real-time portfolio allocations utilizing custom SVG donut charts.

---

## 📈 Trending Score Formula (Open-Ended Challenge)

We designed a compound dynamic formula to calculate a company's **Trending Score** out of a scale of 0-300+:

```
Trending Score = (Growth Score × 2.0) + Min(Employees × 0.1, 50) + Min(Funding Total × 0.02, 100) + Min(Product Upvotes × 0.005, 50) + (News Mentions count × 15) + [Bootstrapped Bonus: +40]
```

### Formula Reasoning:
1. **Growth Velocity (Weight 2.0)**: Captures user engagement, hiring plans, and traffic metrics.
2. **Resource Scaling (Cap 50)**: Rewards team size, ensuring proven teams receive weight without dominating.
3. **Capital Backing (Cap 100)**: Considers raw financial backing as a solid marker of venture validity.
4. **Product Upvotes (Cap 50)**: Ensures immediate developer/consumer product-market fit has substantial direct sway.
5. **Press Coverage (Weight 15 per story)**: Incorporates general awareness and media buzz.
6. **Bootstrapped Bonus (+40)**: Grants bootstrapped startups equal competitive standing for achieving high traction organically.

---

## 💻 Tech Stack

- **Frontend**: React (v19), TypeScript (strict mode), Tailwind CSS, Lucide icons, Framer Motion.
- **Backend**: Node.js, Express, Zod validations.
- **Schema & Database**: Prisma declarative models, PostgreSQL/Supabase compatible.

---

## 🛠️ Setup & Running

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run in development mode**:
   ```bash
   npm run dev
   ```

3. **Production build & compilation**:
   ```bash
   npm run build
   ```

4. **Start standalone server**:
   ```bash
   npm run start
   ```

---

## 🔑 Environment Variables (`.env`)

Create a `.env` file at the root:

```env
DATABASE_URL="postgresql://username:password@host:5432/database"
GRAPHONE_SECRET_KEY="graphone-dev-key"
```

*Note: Write operations like submitting a company require the `X-API-Key` header matching `graphone-dev-key`.*
