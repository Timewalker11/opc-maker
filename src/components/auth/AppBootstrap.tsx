import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "../../store/authStore";
import { useBusinessProfileStore } from "../../store/businessProfileStore";
import "./auth-layout.css";

// Verifies the session (and loads the business profile, if any) before the router ever
// renders a route -- otherwise a returning user could flash the login or onboarding page
// for a moment before the real state comes back from the server.
export function AppBootstrap({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const authHydration = useAuthStore((s) => s.hydrationStatus);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const profileStatus = useBusinessProfileStore((s) => s.status);
  const loadProfile = useBusinessProfileStore((s) => s.loadProfile);

  useEffect(() => {
    hydrateAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authHydration === "done" && user && profileStatus === "idle") {
      loadProfile();
    }
  }, [authHydration, user, profileStatus, loadProfile]);

  const authReady = authHydration === "done";
  const profileReady = !user || profileStatus !== "loading";

  if (!authReady || !profileReady) {
    return (
      <div className="auth-layout">
        <p className="auth-layout__loading">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
