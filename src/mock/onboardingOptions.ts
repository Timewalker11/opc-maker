import type { ReferralSource } from "../types";

export const REFERRAL_SOURCES: Array<{ value: ReferralSource; label: string }> = [
  { value: "search", label: "Search engine" },
  { value: "social", label: "Social media" },
  { value: "referral", label: "Friend or colleague" },
  { value: "ad", label: "An advertisement" },
  { value: "other", label: "Other" },
];
