import { randomUUID } from "node:crypto";
import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { PROVIDERS, findProvider, isConfigured } from "../integrations/registry.js";
import { buildAuthorizeUrl, exchangeCodeForToken } from "../integrations/oauth.js";
import { encryptToken } from "../crypto.js";
import { env } from "../env.js";

const router = Router();

function redirectUriForCallback() {
  // Shared across every provider -- the state token (not the URL) tells the callback which
  // provider and user this is for. Whatever real app you register must allow this exact URI.
  return `http://localhost:${env.port}/api/integrations/callback`;
}

interface ConnectionRow {
  provider: string;
  connected_at: string;
}

router.get("/", requireAuth, (req, res) => {
  const rows = db
    .prepare("SELECT provider, connected_at FROM integration_connections WHERE user_id = ?")
    .all(req.userId!) as unknown as ConnectionRow[];
  const connectedByProvider = new Map(rows.map((r) => [r.provider, r.connected_at]));

  const integrations = PROVIDERS.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    configured: isConfigured(p),
    connected: connectedByProvider.has(p.id),
    connectedAt: connectedByProvider.get(p.id) ?? null,
  }));

  res.json({ integrations });
});

router.post("/:provider/connect", requireAuth, (req, res) => {
  const provider = findProvider(req.params.provider);
  if (!provider) return res.status(404).json({ error: "Unknown provider." });
  if (!isConfigured(provider)) {
    return res.status(400).json({ error: `${provider.name} isn't configured on the server yet.` });
  }

  const state = randomUUID();
  db.prepare("INSERT INTO oauth_states (state, user_id, provider) VALUES (?, ?, ?)").run(state, req.userId!, provider.id);

  res.json({ url: buildAuthorizeUrl(provider, redirectUriForCallback(), state) });
});

// Shared callback for every provider -- looks the user and provider up from the one-time state
// token rather than requiring the browser to carry an auth header on this redirect.
router.get("/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${env.frontendUrl}/integrations?error=${encodeURIComponent(String(error))}`);
  }
  if (typeof code !== "string" || typeof state !== "string") {
    return res.redirect(`${env.frontendUrl}/integrations?error=missing_code_or_state`);
  }

  const stateRow = db.prepare("SELECT * FROM oauth_states WHERE state = ?").get(state) as
    | { state: string; user_id: string; provider: string }
    | undefined;
  db.prepare("DELETE FROM oauth_states WHERE state = ?").run(state);

  if (!stateRow) {
    return res.redirect(`${env.frontendUrl}/integrations?error=invalid_or_expired_state`);
  }

  const provider = findProvider(stateRow.provider);
  if (!provider) {
    return res.redirect(`${env.frontendUrl}/integrations?error=unknown_provider`);
  }

  try {
    const tokenResponse = await exchangeCodeForToken(provider, code, redirectUriForCallback());
    const expiresAt = tokenResponse.expires_in
      ? new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString()
      : null;

    db.prepare(
      `INSERT INTO integration_connections (id, user_id, provider, access_token, refresh_token, expires_at, scopes)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (user_id, provider) DO UPDATE SET
         access_token = excluded.access_token,
         refresh_token = excluded.refresh_token,
         expires_at = excluded.expires_at,
         connected_at = datetime('now')`,
    ).run(
      randomUUID(),
      stateRow.user_id,
      provider.id,
      encryptToken(tokenResponse.access_token),
      tokenResponse.refresh_token ? encryptToken(tokenResponse.refresh_token) : null,
      expiresAt,
      provider.scopes.join(" "),
    );

    res.redirect(`${env.frontendUrl}/integrations?connected=${provider.id}`);
  } catch (err) {
    console.error("OAuth token exchange failed:", err);
    res.redirect(`${env.frontendUrl}/integrations?error=token_exchange_failed`);
  }
});

router.delete("/:provider", requireAuth, (req, res) => {
  db.prepare("DELETE FROM integration_connections WHERE user_id = ? AND provider = ?").run(req.userId!, req.params.provider);
  res.status(204).end();
});

export default router;
