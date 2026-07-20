import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AgentPanel } from "../agent/AgentPanel";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { useGlobalShortcuts } from "../../hooks/useGlobalShortcuts";
import { useUIStore } from "../../store/uiStore";
import "./app-shell.css";

export function AppShell() {
  useGlobalShortcuts();

  useEffect(() => {
    // The agent panel renders as a full overlay below 1024px -- start collapsed there
    // regardless of the persisted desktop preference, so it never covers the page on first load.
    if (window.matchMedia("(max-width: 1024px)").matches) {
      useUIStore.getState().setAgentPanelOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar />
      <div className="app-shell__main-col">
        <Topbar />
        <div className="app-shell__content-row">
          <main id="main-content" className="app-shell__main thin-scroll" tabIndex={-1}>
            <ErrorBoundary label="This page">
              <Outlet />
            </ErrorBoundary>
          </main>
          <ErrorBoundary label="Dashboard agent">
            <AgentPanel />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
