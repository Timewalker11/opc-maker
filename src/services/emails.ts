import type { EmailMessage } from "../types";
import { emails } from "../mock/emails";
import { mockRequest } from "./apiClient";

// Integration placeholder: GET /api/inbox (Gmail/Outlook connector)
export function fetchEmails(): Promise<EmailMessage[]> {
  return mockRequest(emails);
}
