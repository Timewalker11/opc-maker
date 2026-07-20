import type { SearchResult } from "../types";
import { customers } from "../mock/customers";
import { emails } from "../mock/emails";
import { tasks, isOverdue } from "../mock/tasks";
import { calendarEvents } from "../mock/calendar";
import { files } from "../mock/files";
import { orders } from "../mock/orders";
import { invoices } from "../mock/invoices";
import { campaigns } from "../mock/campaigns";
import { notes } from "../mock/notes";
import { socialPosts } from "../mock/social";
import { integrations } from "../mock/integrations";
import { mockRequest } from "./apiClient";

function buildIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  for (const c of customers) {
    index.push({
      id: c.id,
      category: "customers",
      title: c.name,
      meta: `${c.source} · joined ${new Date(c.createdAt).toLocaleDateString()} · $${c.lifetimeValue} lifetime value`,
      href: "/customers",
    });
  }
  for (const e of emails) {
    index.push({
      id: e.id,
      category: "emails",
      title: e.subject,
      meta: `${e.senderName}${e.needsResponse ? " · needs a response" : ""}${e.urgent ? " · urgent" : ""}`,
      href: "/communications",
    });
  }
  for (const t of tasks) {
    index.push({
      id: t.id,
      category: "tasks",
      title: t.title,
      meta: isOverdue(t) ? "Overdue" : `Due ${new Date(t.dueAt).toLocaleDateString()}`,
      href: "/work",
    });
  }
  for (const ev of calendarEvents) {
    index.push({
      id: ev.id,
      category: "events",
      title: ev.title,
      meta: new Date(ev.startAt).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" }),
      href: "/work",
    });
  }
  for (const f of files) {
    index.push({
      id: f.id,
      category: "files",
      title: f.name,
      meta: f.relatedTo ? `Related to ${f.relatedTo.label}` : "Uploaded " + new Date(f.uploadedAt).toLocaleDateString(),
      href: "/files",
    });
    if (f.kind === "image") {
      index.push({
        id: `${f.id}_media`,
        category: "media",
        title: f.name,
        meta: "Media library",
        href: "/files",
      });
    }
  }
  for (const o of orders) {
    index.push({
      id: o.id,
      category: "orders",
      title: `Order ${o.id.replace("ord_", "#")} · ${o.customerName}`,
      meta: `$${o.amount} via ${o.source}`,
      href: "/customers",
    });
  }
  for (const inv of invoices) {
    index.push({
      id: inv.id,
      category: "invoices",
      title: `Invoice ${inv.id.replace("inv_", "#")} · ${inv.customerName}`,
      meta: `$${inv.amount} · ${inv.status}`,
      href: "/analytics",
    });
  }
  for (const camp of campaigns) {
    index.push({
      id: camp.id,
      category: "campaigns",
      title: camp.name,
      meta: `${camp.channel} · ${camp.purchasesGenerated} purchases generated · ${camp.performance}`,
      href: "/marketing",
    });
  }
  for (const n of notes) {
    index.push({
      id: n.id,
      category: "notes",
      title: n.content,
      meta: n.relatedTo ? `Related to ${n.relatedTo.label}` : "Note",
      href: "/customers",
    });
  }
  for (const p of socialPosts) {
    index.push({
      id: p.id,
      category: "posts",
      title: p.caption,
      meta: `${p.platform} · ${p.status}`,
      href: "/marketing",
    });
  }
  for (const i of integrations) {
    index.push({
      id: i.id,
      category: "integrations",
      title: i.name,
      meta: `${i.category} · ${i.status}`,
      href: "/integrations",
    });
  }

  return index;
}

const searchIndex = buildIndex();

function normalize(str: string) {
  return str.toLowerCase();
}

export function searchAll(rawQuery: string): Promise<SearchResult[]> {
  const query = normalize(rawQuery.trim());
  if (!query) return mockRequest([], { latencyMs: 0 });

  const terms = query.split(/\s+/).filter((t) => !["find", "show", "me", "a", "the", "that", "with"].includes(t));

  const results = searchIndex.filter((item) => {
    const haystack = normalize(`${item.title} ${item.meta} ${item.category}`);
    return terms.some((term) => haystack.includes(term));
  });

  return mockRequest(results, { latencyMs: 220 });
}
