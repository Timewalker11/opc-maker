import type { BusinessType, ReferralSource } from "../types";

export const BUSINESS_TYPES: Array<{ value: BusinessType; label: string }> = [
  { value: "ecommerce", label: "E-commerce / retail online" },
  { value: "software", label: "Software / SaaS" },
  { value: "services", label: "Professional services" },
  { value: "creative", label: "Creative / agency" },
  { value: "retail", label: "Retail / brick-and-mortar" },
  { value: "other", label: "Other" },
];

export const REFERRAL_SOURCES: Array<{ value: ReferralSource; label: string }> = [
  { value: "search", label: "Search engine" },
  { value: "social", label: "Social media" },
  { value: "referral", label: "Friend or colleague" },
  { value: "ad", label: "An advertisement" },
  { value: "other", label: "Other" },
];
