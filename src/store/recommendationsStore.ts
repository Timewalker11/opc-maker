import { create } from "zustand";
import type { Recommendation } from "../types";
import { fetchRecommendations } from "../services/recommendations";
import { sendEmailReply, publishPost, chargeCustomer, deleteFile, modifyPayment, contactCustomer } from "../services/actions";
import { useAgentStore } from "./agentStore";

async function executeRecommendation(rec: Recommendation): Promise<void> {
  switch (rec.sensitiveAction) {
    case "send-email":
      await sendEmailReply(rec.id, rec.suggestedAction);
      break;
    case "publish-post":
      await publishPost(rec.id);
      break;
    case "charge-customer":
      await chargeCustomer(rec.id, 0);
      break;
    case "delete-file":
      await deleteFile(rec.id);
      break;
    case "modify-payment":
      await modifyPayment(rec.id);
      break;
    case "contact-customer":
      await contactCustomer(rec.id, "email");
      break;
    default:
      break;
  }
}

interface RecommendationsState {
  items: Recommendation[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  approve: (id: string) => Promise<void>;
  dismiss: (id: string) => void;
  edit: (id: string, suggestedAction: string) => void;
  seed: (items: Recommendation[]) => void;
}

export const useRecommendationsStore = create<RecommendationsState>()((set, get) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchRecommendations();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  approve: async (id) => {
    const rec = get().items.find((r) => r.id === id);
    if (!rec) return;
    await executeRecommendation(rec);
    set((s) => ({ items: s.items.map((r) => (r.id === id ? { ...r, status: "approved" } : r)) }));
    useAgentStore.getState().logActivity(`Approved recommendation: ${rec.title}`, true);
  },
  dismiss: (id) => set((s) => ({ items: s.items.map((r) => (r.id === id ? { ...r, status: "dismissed" } : r)) })),
  edit: (id, suggestedAction) =>
    set((s) => ({ items: s.items.map((r) => (r.id === id ? { ...r, suggestedAction } : r)) })),
  // Seeds recommendations generated from the onboarding wizard's answers, so the homepage
  // reflects the owner's stated priorities immediately instead of starting from empty.
  seed: (items) => set((s) => ({ items: [...items, ...s.items], status: "ready" })),
}));
