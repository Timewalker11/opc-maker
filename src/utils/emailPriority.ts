import type { EmailMessage } from "../types";

// An email is worth surfacing if it's still unread or specifically asks for a reply --
// read-but-answered mail is filtered out everywhere this is used.
export function needsAttention(email: EmailMessage): boolean {
  return email.unread || email.needsResponse;
}

// Urgent sits above business-related, which sits above everything else that still needs attention.
export function priorityRank(email: EmailMessage): number {
  if (email.urgent) return 2;
  if (email.businessRelated) return 1;
  return 0;
}

export function sortByPriority(emails: EmailMessage[]): EmailMessage[] {
  return [...emails].sort((a, b) => priorityRank(b) - priorityRank(a) || b.receivedAt.localeCompare(a.receivedAt));
}
