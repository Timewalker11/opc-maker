import { create } from "zustand";
import type { SocialPlatform, SocialPost } from "../types";
import { fetchSocialPosts } from "../services/social";

let newPostCounter = 0;

interface SocialState {
  items: SocialPost[];
  status: "idle" | "loading" | "error" | "ready";
  load: () => Promise<void>;
  addPost: (input: { platform: SocialPlatform; caption: string; scheduledAt: string }) => void;
  seedDemo: () => void;
}

const HOUR = 60 * 60 * 1000;

export const useSocialStore = create<SocialState>()((set) => ({
  items: [],
  status: "idle",
  load: async () => {
    set({ status: "loading" });
    try {
      const items = await fetchSocialPosts();
      set({ items, status: "ready" });
    } catch {
      set({ status: "error" });
    }
  },
  addPost: ({ platform, caption, scheduledAt }) => {
    newPostCounter += 1;
    const post: SocialPost = {
      id: `post_manual_${newPostCounter}`,
      platform,
      caption,
      scheduledAt,
      status: "scheduled",
    };
    set((s) => ({ items: [post, ...s.items] }));
  },
  seedDemo: () => {
    const now = Date.now();
    const items: SocialPost[] = [
      { id: "post_demo_1", platform: "instagram", caption: "New summer collection just dropped!", scheduledAt: new Date(now + 20 * HOUR).toISOString(), status: "scheduled" },
      { id: "post_demo_2", platform: "tiktok", caption: "Behind the scenes: how we pack your orders", scheduledAt: new Date(now + 44 * HOUR).toISOString(), status: "scheduled" },
      { id: "post_demo_3", platform: "facebook", caption: "Customer spotlight: our favorite recent picks", scheduledAt: new Date(now - 24 * HOUR).toISOString(), status: "published" },
      { id: "post_demo_4", platform: "linkedin", caption: "We're hiring! Join our growing team", scheduledAt: new Date(now - 96 * HOUR).toISOString(), status: "published" },
      { id: "post_demo_5", platform: "instagram", caption: "Draft: end of season sale announcement", scheduledAt: new Date(now + 96 * HOUR).toISOString(), status: "draft" },
    ];
    set({ items, status: "ready" });
  },
}));
