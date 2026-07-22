import { Router } from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { findProvider } from "../integrations/registry.js";
import { refreshAccessToken } from "../integrations/oauth.js";
import { encryptToken, decryptToken } from "../crypto.js";
import { fetchGmailInbox } from "../integrations/gmail.js";

const router = Router();

interface ConnectionRow {
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
}

// The one real, non-mock data domain: once Gmail is connected, this reads the actual inbox
// through the stored (encrypted) OAuth token instead of the frontend's static mock list.
router.get("/", requireAuth, async (req, res) => {
  const row = db
    .prepare("SELECT access_token, refresh_token, expires_at FROM integration_connections WHERE user_id = ? AND provider = 'google'")
    .get(req.userId!) as ConnectionRow | undefined;

  if (!row) {
    return res.json({ emails: [], connected: false });
  }

  // Everything below reads a stored, encrypted token and calls out to Google -- both can fail
  // in ways that aren't the caller's fault (a corrupted row, a revoked grant, a network blip).
  // This whole block is one try/catch so any of those failures reach the owner as a normal error
  // response instead of an uncaught exception, which -- since this is an async handler that
  // Express can't auto-catch -- would otherwise crash the whole server process.
  try {
    let accessToken = decryptToken(row.access_token);
    const expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : null;
    const needsRefresh = expiresAt !== null && expiresAt < Date.now() + 30_000;

    if (needsRefresh) {
      if (!row.refresh_token) {
        return res.status(409).json({ error: "Your Gmail connection expired -- reconnect it from Integrations." });
      }
      try {
        const provider = findProvider("google")!;
        const refreshed = await refreshAccessToken(provider, decryptToken(row.refresh_token));
        accessToken = refreshed.access_token;
        const newExpiresAt = refreshed.expires_in
          ? new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
          : null;
        db.prepare(
          "UPDATE integration_connections SET access_token = ?, expires_at = ? WHERE user_id = ? AND provider = 'google'",
        ).run(encryptToken(accessToken), newExpiresAt, req.userId!);
      } catch (err) {
        console.error("Gmail token refresh failed:", err);
        return res.status(409).json({ error: "Your Gmail connection expired -- reconnect it from Integrations." });
      }
    }

    try {
      const emails = await fetchGmailInbox(accessToken);
      res.json({ emails, connected: true });
    } catch (err) {
      console.error("Gmail fetch failed:", err);
      res.status(502).json({ error: "Couldn't reach Gmail. Try again in a moment." });
    }
  } catch (err) {
    console.error("Gmail request failed:", err);
    res.status(409).json({ error: "Your Gmail connection looks broken -- reconnect it from Integrations." });
  }
});

export default router;
