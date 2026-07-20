import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  agentPanelOpen: boolean;
  toggleAgentPanel: () => void;
  setAgentPanelOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      mobileNavOpen: false,
      setMobileNavOpen: (v) => set({ mobileNavOpen: v }),
      agentPanelOpen: true,
      toggleAgentPanel: () => set({ agentPanelOpen: !get().agentPanelOpen }),
      setAgentPanelOpen: (v) => set({ agentPanelOpen: v }),
      searchOpen: false,
      setSearchOpen: (v) => set({ searchOpen: v }),
      commandOpen: false,
      setCommandOpen: (v) => set({ commandOpen: v }),
      notificationsOpen: false,
      setNotificationsOpen: (v) => set({ notificationsOpen: v }),
    }),
    { name: "opc_ui_state", partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed, agentPanelOpen: state.agentPanelOpen }) },
  ),
);
