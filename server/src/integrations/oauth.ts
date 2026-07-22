import type { ProviderConfig } from "./registry.js";

export function buildAuthorizeUrl(provider: ProviderConfig, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: provider.scopes.join(" "),
    state,
    access_type: "offline",
    // Google only issues a refresh token on first consent; without forcing the consent screen,
    // a reconnect (or a second connect attempt on an account that's already authorized this app)
    // silently comes back with no refresh token, so the connection can never renew itself.
    prompt: "consent",
  });
  return `${provider.authorizeUrl}?${params.toString()}`;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export async function exchangeCodeForToken(
  provider: ProviderConfig,
  code: string,
  redirectUri: string,
): Promise<TokenResponse> {
  const res = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as TokenResponse;
}

// Exchanges a stored refresh token for a fresh access token -- providers don't return a new
// refresh token here, so callers should keep reusing the one already on file.
export async function refreshAccessToken(provider: ProviderConfig, refreshToken: string): Promise<TokenResponse> {
  const res = await fetch(provider.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as TokenResponse;
}
