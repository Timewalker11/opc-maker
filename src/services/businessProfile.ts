import type { BusinessProfile } from "../types";
import { apiFetch } from "./apiClient";

export function fetchBusinessProfile(): Promise<{ profile: BusinessProfile | null }> {
  return apiFetch<{ profile: BusinessProfile | null }>("/api/business-profile");
}

export function saveBusinessProfile(profile: BusinessProfile): Promise<{ profile: BusinessProfile }> {
  return apiFetch<{ profile: BusinessProfile }>("/api/business-profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}
