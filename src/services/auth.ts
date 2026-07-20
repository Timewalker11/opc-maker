import type { AuthUser } from "../types";
import { mockRequest, mockFailure } from "./apiClient";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface AuthResult {
  token: string;
  user: AuthUser;
}

// Integration placeholder: POST /api/auth/login
export function login(email: string, password: string): Promise<AuthResult> {
  if (!EMAIL_RE.test(email)) return mockFailure("Enter a valid email address.", 400);
  if (password.length < 6) return mockFailure("Incorrect email or password.", 401);

  const name = email.split("@")[0].replace(/[._-]/g, " ");
  return mockRequest({
    token: `mock_token_${Math.random().toString(36).slice(2)}`,
    user: { name: titleCase(name), email },
  });
}

// Integration placeholder: POST /api/auth/signup
export function signup(name: string, email: string, password: string): Promise<AuthResult> {
  if (!name.trim()) return mockFailure("Enter your name.", 400);
  if (!EMAIL_RE.test(email)) return mockFailure("Enter a valid email address.", 400);
  if (password.length < 6) return mockFailure("Password must be at least 6 characters.", 400);

  return mockRequest({
    token: `mock_token_${Math.random().toString(36).slice(2)}`,
    user: { name: name.trim(), email },
  });
}

function titleCase(str: string): string {
  return str
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
