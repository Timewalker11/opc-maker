const STORAGE_KEY = "opc_session_token";

let inMemoryToken: string | null = null;

export function setToken(token: string) {
  inMemoryToken = token;
  try {
    // sessionStorage (not localStorage) so a token never outlives the browser tab;
    // a production backend should move this to an httpOnly cookie instead.
    window.sessionStorage.setItem(STORAGE_KEY, token);
  } catch {
    // storage unavailable -- token still works for this page load via the in-memory copy
  }
}

export function getToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  try {
    inMemoryToken = window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    inMemoryToken = null;
  }
  return inMemoryToken;
}

export function clearToken() {
  inMemoryToken = null;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
