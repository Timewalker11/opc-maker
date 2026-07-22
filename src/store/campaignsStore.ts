import { create } from "zustand";
import type { Campaign } from "../types";
import { fetchCampaigns } from "../services/campaigns";

interface CampaignsState {
  items: Campaign[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  seedDemo: () => void;
}

export const useCampaignsStore = create<CampaignsState>()((set) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchCampaigns();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  seedDemo: () => {
    const items: Campaign[] = [
      { id: "camp_demo_1", name: "Summer Collection Launch", channel: "Instagram", status: "active", purchasesGenerated: 42, spend: 850, performance: "top-performer" },
      { id: "camp_demo_2", name: "Retarget Cart Abandoners", channel: "Google Ads", status: "active", purchasesGenerated: 18, spend: 620, performance: "on-track" },
      { id: "camp_demo_3", name: "Spring Newsletter", channel: "Email", status: "ended", purchasesGenerated: 9, spend: 0, performance: "on-track" },
      { id: "camp_demo_4", name: "TikTok Awareness Push", channel: "TikTok", status: "paused", purchasesGenerated: 3, spend: 400, performance: "underperforming" },
    ];
    set({ items, status: "ready" });
  },
}));
