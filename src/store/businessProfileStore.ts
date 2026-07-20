import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BusinessProfile } from "../types";
import { fetchBusinessProfile, saveBusinessProfile } from "../services/businessProfile";

interface BusinessProfileState {
  profile: BusinessProfile | null;
  isComplete: boolean;
  status: "idle" | "loading" | "done";
  loadProfile: () => Promise<void>;
  setProfile: (profile: BusinessProfile) => Promise<boolean>;
  reset: () => void;
}

export const useBusinessProfileStore = create<BusinessProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isComplete: false,
      status: "idle",
      // Reconciles the locally-cached profile (for a snappy first paint) with the server,
      // which is the source of truth -- e.g. logging in on a fresh browser with no local cache.
      loadProfile: async () => {
        set({ status: "loading" });
        try {
          const { profile } = await fetchBusinessProfile();
          set({ profile, isComplete: profile !== null, status: "done" });
        } catch {
          set({ status: "done" });
        }
      },
      setProfile: async (profile) => {
        try {
          const { profile: saved } = await saveBusinessProfile(profile);
          set({ profile: saved, isComplete: true });
          return true;
        } catch {
          return false;
        }
      },
      reset: () => set({ profile: null, isComplete: false, status: "idle" }),
    }),
    { name: "opc_business_profile" },
  ),
);
