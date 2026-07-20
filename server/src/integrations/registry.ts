import { env } from "../env.js";

export interface ProviderConfig {
  id: string;
  name: string;
  category: string;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientId: string;
  clientSecret: string;
}

// Adding a new integration is just adding an entry here (plus its client id/secret in .env) --
// the connect/callback/disconnect routes and token storage are all generic and don't change.
export const PROVIDERS: ProviderConfig[] = [
  {
    id: "shopify",
    name: "Shopify",
    category: "Ecommerce",
    // Real Shopify OAuth authorizes per-shop (https://{shop}.myshopify.com/admin/oauth/authorize).
    // This generic registry uses a placeholder host -- swap in the shop-specific URL to actually
    // connect a real store.
    authorizeUrl: "https://accounts.shopify.com/oauth/authorize",
    tokenUrl: "https://accounts.shopify.com/oauth/token",
    scopes: ["read_orders", "read_customers"],
    clientId: env.providers.shopify.clientId,
    clientSecret: env.providers.shopify.clientSecret,
  },
  {
    id: "google",
    name: "Google (Gmail + Calendar)",
    category: "Email & Scheduling",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/calendar.readonly"],
    clientId: env.providers.google.clientId,
    clientSecret: env.providers.google.clientSecret,
  },
];

export function findProvider(id: string): ProviderConfig | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function isConfigured(provider: ProviderConfig): boolean {
  return Boolean(provider.clientId && provider.clientSecret);
}
