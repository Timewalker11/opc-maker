import type { AuthUser } from "../types";
import { apiFetch } from "./apiClient";

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export function login(email: string, password: string): Promise<AuthResult> {
  return apiFetch<AuthResult>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signup(name: string, email: string, password: string): Promise<AuthResult> {
  return apiFetch<AuthResult>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export function fetchCurrentUser(): Promise<{ user: AuthUser }> {
  return apiFetch<{ user: AuthUser }>("/api/auth/me");
}
