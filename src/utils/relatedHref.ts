import type { RelatedRecord } from "../types";

const HREF_BY_TYPE: Record<RelatedRecord["type"], string> = {
  customer: "/customers",
  campaign: "/marketing",
  task: "/tasks",
  file: "/files",
  invoice: "/analytics",
  order: "/customers",
  project: "/tasks",
  email: "/communications",
};

export function relatedHref(related: RelatedRecord): string {
  return HREF_BY_TYPE[related.type];
}
