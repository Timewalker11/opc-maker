import type { EmailMessage } from "../types";
import { apiFetch } from "./apiClient";

export interface InboxResult {
  emails: EmailMessage[];
  connected: boolean;
}

// Backed by the real Gmail connection once one exists (server reads the actual inbox through
// the stored OAuth token) -- returns an empty, disconnected inbox otherwise, so the UI can
// tell "nothing connected yet" apart from "connected, inbox genuinely empty".
export function fetchEmails(): Promise<InboxResult> {
  return apiFetch<InboxResult>("/api/emails");
}
