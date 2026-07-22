import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SpecializedAgentId } from "../types";

export const AGENT_LOCK_DAYS = 7;
const LOCK_DURATION_MS = AGENT_LOCK_DAYS * 24 * 60 * 60 * 1000;

interface AgentSelectionState {
  activeAgentIds: SpecializedAgentId[];
  activatedAt: Partial<Record<SpecializedAgentId, string>>;
  setActiveAgents: (ids: SpecializedAgentId[]) => void;
  activate: (id: SpecializedAgentId) => void;
  // Returns false (and leaves the agent active) if it's still within its lock window.
  deactivate: (id: SpecializedAgentId) => boolean;
  // Null if the agent isn't active or was activated before this feature existed.
  getLockedUntil: (id: SpecializedAgentId) => Date | null;
}

// Tracks which specialized agents the owner has turned on -- seeded from the "choose your AI
// team" onboarding step (max 3 there), but open-ended afterwards via the Agent Center. Each
// activation is timestamped so a newly-turned-on agent can't be switched back off for a week --
// long enough to actually evaluate it before undoing the choice.
export const useAgentSelectionStore = create<AgentSelectionState>()(
  persist(
    (set, get) => ({
      activeAgentIds: [],
      activatedAt: {},
      setActiveAgents: (ids) => {
        const now = new Date().toISOString();
        const activatedAt: Partial<Record<SpecializedAgentId, string>> = {};
        ids.forEach((id) => {
          activatedAt[id] = now;
        });
        set({ activeAgentIds: ids, activatedAt });
      },
      activate: (id) =>
        set((s) => {
          if (s.activeAgentIds.includes(id)) return s;
          return {
            activeAgentIds: [...s.activeAgentIds, id],
            activatedAt: { ...s.activatedAt, [id]: new Date().toISOString() },
          };
        }),
      deactivate: (id) => {
        const lockedUntil = get().getLockedUntil(id);
        if (lockedUntil && lockedUntil.getTime() > Date.now()) return false;
        set((s) => {
          const activatedAt = { ...s.activatedAt };
          delete activatedAt[id];
          return { activeAgentIds: s.activeAgentIds.filter((a) => a !== id), activatedAt };
        });
        return true;
      },
      getLockedUntil: (id) => {
        const activatedAtIso = get().activatedAt[id];
        if (!activatedAtIso) return null;
        return new Date(new Date(activatedAtIso).getTime() + LOCK_DURATION_MS);
      },
    }),
    { name: "opc_agent_selection" },
  ),
);
