import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CommandHistoryState {
  recent: string[];
  record: (command: string) => void;
}

export const useCommandHistoryStore = create<CommandHistoryState>()(
  persist(
    (set, get) => ({
      recent: [],
      record: (command) => {
        const withoutDupe = get().recent.filter((c) => c.toLowerCase() !== command.toLowerCase());
        set({ recent: [command, ...withoutDupe].slice(0, 6) });
      },
    }),
    { name: "opc_command_history" },
  ),
);
