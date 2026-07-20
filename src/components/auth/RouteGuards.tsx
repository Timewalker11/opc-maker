import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useBusinessProfileStore } from "../../store/businessProfileStore";

// Wraps the authenticated app shell -- requires both a logged-in user and a completed business profile.
export function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  const isComplete = useBusinessProfileStore((s) => s.isComplete);
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!isComplete) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

// Wraps the onboarding wizard -- requires a logged-in user, but not a completed profile yet.
export function RequireAuthOnly() {
  const user = useAuthStore((s) => s.user);
  const isComplete = useBusinessProfileStore((s) => s.isComplete);

  if (!user) return <Navigate to="/login" replace />;
  if (isComplete) return <Navigate to="/" replace />;
  return <Outlet />;
}

// Wraps /login and /signup -- sends already-set-up users straight to the dashboard.
export function RedirectIfAuthed() {
  const user = useAuthStore((s) => s.user);
  const isComplete = useBusinessProfileStore((s) => s.isComplete);

  if (user && isComplete) return <Navigate to="/" replace />;
  if (user && !isComplete) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}
