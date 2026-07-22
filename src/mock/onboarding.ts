import type { OnboardingStep } from "../types";

export const onboardingSteps: OnboardingStep[] = [
  { id: "profile", label: "Complete your business profile", done: false, href: "/settings" },
  { id: "email", label: "Connect email", done: false, href: "/settings#integrations" },
  { id: "calendar", label: "Connect calendar", done: false, href: "/settings#integrations" },
  { id: "payments", label: "Connect a payment or ecommerce platform", done: false, href: "/settings#integrations" },
  { id: "social", label: "Connect social-media accounts", done: false, href: "/settings#integrations" },
  { id: "customers", label: "Import your customers", done: false, href: "/customers" },
  { id: "files", label: "Upload your first files", done: false, href: "/files" },
  { id: "agent", label: "Configure your AI agents", done: false, href: "/settings#agents" },
  { id: "automation", label: "Create your first automation", done: false, href: "/tasks" },
];
