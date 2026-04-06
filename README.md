# FinFlow — Personal Finance Dashboard

A premium, data-rich personal finance dashboard built with React, TypeScript, and Tailwind CSS. Inspired by Monarch Money and Toshl with a teal/dark-green color palette.

## Features

- **Dashboard** — Net worth summary, balance trend chart, spending breakdown donut
- **Transactions** — Filterable list with admin add/delete capabilities
- **Budget** — Category-based budget tracking with progress bars
- **Reports** — Cash flow, spending by category (bubble chart), and income breakdown
- **Goals** — Savings goal cards with contribution drawer, emoji icons, progress tracking
- **Insights** — AI-powered financial tips
- **Role Switching** — Toggle between Admin and Viewer roles in the sidebar
- **Dark Mode** — Full dark/light theme support via top-bar toggle

## Tech Stack

- **React 18** + **TypeScript 5**
- **Vite 5** — Dev server & bundler
- **Tailwind CSS 3** — Utility-first styling
- **shadcn/ui** — Accessible component primitives
- **Recharts** — Charts & data visualisation
- **React Router 6** — Client-side routing
- **React Context** — Global state management

## Prerequisites

- **Node.js** ≥ 18
- **npm** or **bun**

## Run Locally (VS Code)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd finflow

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Useful Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Deploy to Vercel

### Option A — Via Vercel Dashboard

1. Push your code to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects **Vite** — no config changes needed.
4. Click **Deploy**. Your app will be live in ~60 seconds.

### Option B — Via Vercel CLI

```bash
# 1. Install the CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

### Environment Variables

No environment variables are required for the default setup. If you add backend integrations later, configure them in the Vercel dashboard under **Settings → Environment Variables**.

## Project Structure

```
src/
├── components/     # Reusable UI components (AppShell, NavLink, shadcn/ui)
├── context/        # AppContext for global state & role management
├── data/           # Mock data for dashboard, transactions, goals
├── hooks/          # Custom hooks (use-mobile, use-toast)
├── pages/          # Route pages (Dashboard, Transactions, Reports, etc.)
├── assets/         # Static assets
└── lib/            # Utility functions
```

## Files Safe to Delete Before Deploying

These files are development/testing-only and can be removed from your GitHub repo or Vercel deployment:

| File / Folder | Reason |
|---|---|
| `playwright.config.ts` | Playwright test config |
| `playwright-fixture.ts` | Playwright test fixture |
| `vitest.config.ts` | Vitest test config |
| `src/test/` | Test files |
| `eslint.config.js` | Linting config (not needed at runtime) |
| `tsconfig.node.json` | TypeScript config for tooling |
| `.gitignore` | Only needed in repo, not in build |
| `bun.lock` / `bun.lockb` | Bun lockfiles (if using npm) |
| `public/robots.txt` | Optional — remove if you don't need SEO control |
| `src/assets/*.asset.json` | Asset metadata files (not bundled) |

> **Note:** Vite only bundles files imported in your source code. Most config files are already excluded from the production `dist/` build automatically. These are safe to delete from your repo if you want a cleaner codebase.

## License

MIT
