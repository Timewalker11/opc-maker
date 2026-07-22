export interface GmailEmailDTO {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  receivedAt: string;
  unread: boolean;
  urgent: boolean;
  needsResponse: boolean;
  businessRelated: boolean;
}

interface GmailHeader {
  name: string;
  value: string;
}

interface GmailMessageListResponse {
  messages?: { id: string }[];
}

interface GmailMessageResponse {
  id: string;
  snippet?: string;
  internalDate?: string;
  labelIds?: string[];
  payload?: { headers?: GmailHeader[] };
}

function headerValue(headers: GmailHeader[], name: string): string | undefined {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value;
}

// Gmail has no "needs a reply" concept of its own, so this looks for the phrasing people
// actually use when they're waiting on an answer -- a direct question, or a common ask-for-a-reply
// turn of phrase in the subject or snippet.
const RESPONSE_REQUEST_PATTERNS = [
  /\?/,
  /please (respond|reply|confirm|advise|let me know)/i,
  /could you/i,
  /can you/i,
  /would you/i,
  /let me know/i,
  /waiting (for|on) (your|a) (reply|response)/i,
  /need(s)? your (input|response|approval|confirmation|feedback)/i,
  /at your earliest convenience/i,
  /looking forward to (your|hearing)/i,
];

function looksLikeItNeedsResponse(subject: string, preview: string): boolean {
  const text = `${subject} ${preview}`;
  return RESPONSE_REQUEST_PATTERNS.some((pattern) => pattern.test(text));
}

// Gmail auto-sorts newsletters, social notifications, and promos into these categories --
// mail without any of them is what lands in Primary, which is the closest signal to
// "a real business conversation" Gmail's own labels can give us.
const NON_BUSINESS_CATEGORY_LABELS = ["CATEGORY_PROMOTIONS", "CATEGORY_SOCIAL", "CATEGORY_UPDATES", "CATEGORY_FORUMS"];

function looksBusinessRelated(labelIds: string[]): boolean {
  return !NON_BUSINESS_CATEGORY_LABELS.some((label) => labelIds.includes(label));
}

// Splits a "From" header like `Jane Doe <jane@example.com>` into name/email; falls back to
// treating the whole header as both when it isn't in that shape.
function parseFrom(value: string | undefined): { name: string; email: string } {
  if (!value) return { name: "Unknown sender", email: "" };
  const match = value.match(/^(.*?)\s*<(.+)>$/);
  if (match) {
    const name = match[1].replace(/"/g, "").trim();
    return { name: name || match[2], email: match[2] };
  }
  return { name: value, email: value };
}

// Fetches the most recent inbox messages for the already-authorized user and maps them into
// this app's EmailMessage shape. Uses format=metadata so each message fetch stays small --
// this never reads full message bodies.
export async function fetchGmailInbox(accessToken: string, limit = 12): Promise<GmailEmailDTO[]> {
  const authHeaders = { Authorization: `Bearer ${accessToken}` };

  const listRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${limit}&labelIds=INBOX`,
    { headers: authHeaders },
  );
  if (!listRes.ok) {
    throw new Error(`Gmail list failed: ${listRes.status} ${await listRes.text()}`);
  }
  const list = (await listRes.json()) as GmailMessageListResponse;
  const ids = (list.messages ?? []).map((m) => m.id);

  const messages = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}` +
          `?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
        { headers: authHeaders },
      );
      if (!res.ok) return null;
      return (await res.json()) as GmailMessageResponse;
    }),
  );

  return messages
    .filter((m): m is GmailMessageResponse => m !== null)
    .map((m) => {
      const headers = m.payload?.headers ?? [];
      const { name, email } = parseFrom(headerValue(headers, "From"));
      const labelIds = m.labelIds ?? [];
      const subject = headerValue(headers, "Subject") ?? "(no subject)";
      const preview = m.snippet ?? "";
      return {
        id: m.id,
        senderName: name,
        senderEmail: email,
        subject,
        preview,
        receivedAt: m.internalDate ? new Date(Number(m.internalDate)).toISOString() : new Date().toISOString(),
        unread: labelIds.includes("UNREAD"),
        urgent: labelIds.includes("IMPORTANT"),
        needsResponse: looksLikeItNeedsResponse(subject, preview),
        businessRelated: looksBusinessRelated(labelIds),
      };
    })
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}
