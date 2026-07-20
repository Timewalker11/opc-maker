import type { RelatedRecord } from "../types";

const HREF_BY_TYPE: Record<RelatedRecord["type"], string> = {
  customer: "/customers",
  campaign: "/marketing",
  task: "/work",
  file: "/files",
  invoice: "/analytics",
  order: "/customers",
  project: "/work",
  email: "/communications",
};

export function relatedHref(related: RelatedRecord): string {
  return HREF_BY_TYPE[related.type];
}
