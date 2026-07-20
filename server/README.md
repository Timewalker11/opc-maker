# opc-maker API

A small Express + SQLite backend providing real auth, business-profile
persistence, and a generic OAuth integration registry for the dashboard
frontend in `../`.

## Running it

```
cd server
npm install
cp .env.example .env   # fill in JWT_SECRET / TOKEN_ENCRYPTION_KEY for anything beyond local dev
npm run dev
```

Listens on `http://localhost:4000` by default. The frontend expects it there
(`VITE_API_URL`, see the root `.env.example`).

`TOKEN_ENCRYPTION_KEY` must be a 64-character hex string (32 bytes). Generate one with:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## What's here

- **Auth** (`routes/auth.ts`) -- signup/login with bcrypt-hashed passwords, JWT issuance, `GET /api/auth/me` to verify a token and restore a session.
- **Business profile** (`routes/businessProfile.ts`) -- persists the onboarding wizard's answers per user.
- **Integrations** (`routes/integrations.ts`, `integrations/`) -- a generic OAuth connect/callback/disconnect flow driven entirely by a provider registry (`integrations/registry.ts`). No per-provider route code -- adding a provider means adding one config entry.

OAuth access/refresh tokens are encrypted at rest (`crypto.ts`, AES-256-GCM) and never sent back to the frontend -- the API only ever returns connection status (`connected: true/false`, `connectedAt`), never the token itself.

## Adding a new integration provider

1. Register an OAuth app with the provider. Set its redirect URI to `http://localhost:4000/api/integrations/callback` (this one URI is shared by every provider -- the OAuth `state` param, not the URL, tells the callback which provider and user it's for).
2. Add its client id/secret to `.env` (see `.env.example` for the pattern).
3. Add one entry to the `PROVIDERS` array in `integrations/registry.ts`: id, display name, category, authorize/token URLs, and scopes.

That's it -- `/api/integrations`, `/api/integrations/:provider/connect`, the shared `/api/integrations/callback`, and `/api/integrations/:provider` (disconnect) all work against the registry automatically.

## Current limitations

This proves the connection infrastructure -- it does not yet pull real data
(orders, emails, etc.) from a connected provider. Once a provider is
connected, the next step is a per-provider sync job that uses the stored,
decrypted token to call that provider's actual API and populate real business
data instead of the frontend's mock data.

Shopify's real OAuth authorizes per-shop
(`https://{shop}.myshopify.com/admin/oauth/authorize`); the registry entry
here uses a placeholder host to keep the example generic. Swap in the
shop-specific URL to actually connect a store.
