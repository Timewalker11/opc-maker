import type {
  BusinessType,
  ChallengeId,
  DashboardCardConfig,
  DashboardCardId,
  HelpAreaId,
  OnboardingAnswers,
  Recommendation,
  SpecializedAgentId,
} from "../types";

const DEFAULT_ORDER: DashboardCardId[] = ["revenue", "tasks", "alerts", "customers", "calendar", "emails", "social", "storage"];

const BUSINESS_TYPE_WEIGHTS: Partial<Record<BusinessType, Partial<Record<DashboardCardId, number>>>> = {
  "retail-ecommerce": { revenue: 3, customers: 2 },
  "professional-services": { calendar: 2, tasks: 2 },
  realtor: { calendar: 3, customers: 2 },
  consultant: { calendar: 2, tasks: 2 },
  freelancer: { tasks: 3, emails: 1 },
  creator: { social: 3, storage: 1 },
  agency: { social: 2, customers: 2 },
  restaurant: { revenue: 2, calendar: 2 },
  healthcare: { calendar: 3, customers: 1 },
  education: { calendar: 2, storage: 1 },
  software: { tasks: 2, alerts: 1 },
  manufacturing: { revenue: 2, storage: 1 },
  construction: { tasks: 2, calendar: 2 },
  nonprofit: { customers: 2, emails: 1 },
};

const CHALLENGE_WEIGHTS: Partial<Record<ChallengeId, Partial<Record<DashboardCardId, number>>>> = {
  "customer-management": { customers: 3 },
  "lead-followup": { customers: 2, tasks: 1 },
  email: { emails: 3 },
  marketing: { social: 2 },
  "social-media": { social: 3 },
  scheduling: { calendar: 3 },
  invoices: { revenue: 2 },
  payments: { revenue: 2 },
  "file-organization": { storage: 3 },
  "project-management": { tasks: 3 },
  "repetitive-work": { tasks: 1 },
  "remembering-tasks": { tasks: 2 },
};

const AGENT_WEIGHTS: Partial<Record<SpecializedAgentId, Partial<Record<DashboardCardId, number>>>> = {
  finance: { revenue: 1 },
  scheduling: { calendar: 1 },
  social: { social: 1 },
  customer: { customers: 1 },
  email: { emails: 1 },
  storage: { storage: 1 },
  task: { tasks: 1 },
};

function addWeights(scores: Record<DashboardCardId, number>, weights?: Partial<Record<DashboardCardId, number>>) {
  if (!weights) return;
  for (const [id, weight] of Object.entries(weights) as [DashboardCardId, number][]) {
    scores[id] += weight;
  }
}

// Reorders and resizes the dashboard's fixed 8 card types based on what the owner told us
// during onboarding -- the card most relevant to their business type, stated challenges, and
// chosen agents rises to the top and gets the largest slot. Nothing is hidden; this only
// changes emphasis.
export function computeDashboardLayout(answers: OnboardingAnswers): DashboardCardConfig[] {
  const scores: Record<DashboardCardId, number> = {
    revenue: 0,
    tasks: 0,
    alerts: 0,
    customers: 0,
    calendar: 0,
    emails: 0,
    social: 0,
    storage: 0,
  };

  if (answers.businessType) addWeights(scores, BUSINESS_TYPE_WEIGHTS[answers.businessType]);
  for (const challenge of answers.challenges) addWeights(scores, CHALLENGE_WEIGHTS[challenge]);
  for (const agentId of answers.selectedAgents) addWeights(scores, AGENT_WEIGHTS[agentId]);

  const ranked = [...DEFAULT_ORDER].sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    return DEFAULT_ORDER.indexOf(a) - DEFAULT_ORDER.indexOf(b);
  });

  return ranked.map((id, index) => ({
    id,
    visible: true,
    size: index === 0 ? "lg" : index <= 3 ? "md" : "sm",
  }));
}

interface HelpAreaRecommendation {
  title: string;
  explanation: string;
  benefit: string;
  suggestedAction: string;
}

const HELP_AREA_RECOMMENDATIONS: Record<HelpAreaId, HelpAreaRecommendation> = {
  "growing-sales": {
    title: "Review your open sales opportunities",
    explanation: "You told us growing sales is a priority.",
    benefit: "Surface the leads most likely to close first.",
    suggestedAction: "Open the Sales Agent's ranked opportunity list",
  },
  "organizing-customers": {
    title: "Set up your unified customer view",
    explanation: "You told us organizing customers is a priority.",
    benefit: "One record per customer instead of scattered notes.",
    suggestedAction: "Review your customer list and merge duplicates",
  },
  "managing-email": {
    title: "Let the Email Agent triage your inbox",
    explanation: "You told us managing email is a priority.",
    benefit: "Urgent messages get flagged before you even open your inbox.",
    suggestedAction: "Review today's prioritized inbox",
  },
  marketing: {
    title: "Draft this month's campaign plan",
    explanation: "You told us marketing is a priority.",
    benefit: "A ready-to-edit plan instead of starting from a blank page.",
    suggestedAction: "Review the Marketing Agent's campaign draft",
  },
  "social-media": {
    title: "Schedule next week's social posts",
    explanation: "You told us social media is a priority.",
    benefit: "A week of posts queued up in one sitting.",
    suggestedAction: "Review the suggested posting schedule",
  },
  scheduling: {
    title: "Sync your calendar for automatic booking",
    explanation: "You told us scheduling is a priority.",
    benefit: "Fewer back-and-forth emails to find a time.",
    suggestedAction: "Connect your calendar",
  },
  "automating-work": {
    title: "Set up your first automation",
    explanation: "You told us repetitive work is slowing you down.",
    benefit: "Hand off one recurring task permanently.",
    suggestedAction: "Review the Automation Agent's first suggestion",
  },
  "file-organization": {
    title: "Organize your file library",
    explanation: "You told us file organization is a priority.",
    benefit: "Find any file in seconds instead of digging through folders.",
    suggestedAction: "Review the suggested folder structure",
  },
  analytics: {
    title: "Generate your first performance report",
    explanation: "You told us analytics is a priority.",
    benefit: "A plain-language summary of what's working.",
    suggestedAction: "Open this week's analytics summary",
  },
  "saving-time": {
    title: "See where the AI team can save you the most time",
    explanation: "You told us saving time is a priority.",
    benefit: "A short list of the highest-impact automations to turn on next.",
    suggestedAction: "Review time-saving suggestions",
  },
};

// Turns the "what would you like help with" answers into a starter set of recommendations,
// so the homepage isn't an empty state the moment onboarding finishes.
export function computeStarterRecommendations(answers: OnboardingAnswers): Recommendation[] {
  return answers.helpAreas.slice(0, 4).map((helpArea, index) => {
    const rec = HELP_AREA_RECOMMENDATIONS[helpArea];
    return {
      id: `onboarding_${helpArea}_${index}`,
      title: rec.title,
      explanation: rec.explanation,
      benefit: rec.benefit,
      priority: index === 0 ? "high" : "medium",
      suggestedAction: rec.suggestedAction,
      sensitiveAction: null,
      status: "pending",
    };
  });
}
