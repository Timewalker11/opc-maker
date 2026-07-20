import type { IntegrationInfo } from "../types";
import { apiFetch } from "./apiClient";

export function fetchIntegrations(): Promise<{ integrations: IntegrationInfo[] }> {
  return apiFetch<{ integrations: IntegrationInfo[] }>("/api/integrations");
}

export function connectIntegration(providerId: string): Promise<{ url: string }> {
  return apiFetch<{ url: string }>(`/api/integrations/${providerId}/connect`, { method: "POST" });
}

export function disconnectIntegration(providerId: string): Promise<void> {
  return apiFetch<void>(`/api/integrations/${providerId}`, { method: "DELETE" });
}
