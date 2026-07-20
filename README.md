# Business Dashboard

A single-owner business operating system: a dashboard for revenue, customers,
tasks, communications, marketing, and a coordinating AI agent, backed by a
generic OAuth integration framework for connecting real third-party apps.

## Running it

This is two projects: the dashboard (this directory) and its API (`server/`).

```
# Terminal 1 -- API
cd server
npm install
cp .env.example .env
# generate a real encryption key and drop it into .env as TOKEN_ENCRYPTION_KEY:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
npm run dev        # http://localhost:4000

# Terminal 2 -- dashboard
npm install
npm run dev         # http://localhost:5173
```

Requires Node 22.5+ (the API uses the built-in `node:sqlite` module, no native
compilation needed).

Visiting the dashboard with no session redirects to `/login` → sign up →
a short onboarding wizard (company name, business type, how you heard about
us) → the dashboard, all persisted in the API's SQLite database.

## Project layout

- `src/` -- the dashboard SPA (React + TypeScript + Vite). Most business data (customers, tasks, emails, etc.) is still mock data; see `src/services/*.ts` for the integration placeholders marking where each would hit a real endpoint.
- `server/` -- the API: real auth, business-profile persistence, and a generic OAuth integration registry (`server/README.md` has details, including how to add a new provider).

## Tech

React 19, TypeScript, Vite, React Router, Zustand. API: Express, `node:sqlite`, JWT auth, AES-256-GCM token encryption at rest.
