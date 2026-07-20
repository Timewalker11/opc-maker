import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BusinessProfile } from "../types";

interface BusinessProfileState {
  profile: BusinessProfile | null;
  isComplete: boolean;
  setProfile: (profile: BusinessProfile) => void;
  reset: () => void;
}

export const useBusinessProfileStore = create<BusinessProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isComplete: false,
      setProfile: (profile) => set({ profile, isComplete: true }),
      reset: () => set({ profile: null, isComplete: false }),
    }),
    { name: "opc_business_profile" },
  ),
);
