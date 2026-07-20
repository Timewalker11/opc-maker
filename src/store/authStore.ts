import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types";
import { login as loginService, signup as signupService, fetchCurrentUser } from "../services/auth";
import { setToken, clearToken, getToken } from "../services/authToken";
import { ApiError } from "../services/apiClient";

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading";
  hydrationStatus: "pending" | "done";
  errorMessage: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "idle",
      hydrationStatus: "pending",
      errorMessage: null,
      login: async (email, password) => {
        set({ status: "loading", errorMessage: null });
        try {
          const result = await loginService(email, password);
          setToken(result.token);
          set({ user: result.user, status: "idle" });
          return true;
        } catch (err) {
          set({ status: "idle", errorMessage: err instanceof ApiError ? err.message : "Something went wrong." });
          return false;
        }
      },
      signup: async (name, email, password) => {
        set({ status: "loading", errorMessage: null });
        try {
          const result = await signupService(name, email, password);
          setToken(result.token);
          set({ user: result.user, status: "idle" });
          return true;
        } catch (err) {
          set({ status: "idle", errorMessage: err instanceof ApiError ? err.message : "Something went wrong." });
          return false;
        }
      },
      logout: () => {
        clearToken();
        set({ user: null });
      },
      clearError: () => set({ errorMessage: null }),
      // The token lives in sessionStorage (cleared per tab), but `user` is persisted to
      // localStorage for a snappy first paint. On boot we reconcile the two by re-verifying
      // the token against the server -- a stale `user` with no valid token must not be
      // treated as logged in.
      hydrate: async () => {
        if (!getToken()) {
          set({ user: null, hydrationStatus: "done" });
          return;
        }
        try {
          const { user } = await fetchCurrentUser();
          set({ user, hydrationStatus: "done" });
        } catch {
          clearToken();
          set({ user: null, hydrationStatus: "done" });
        }
      },
    }),
    { name: "opc_auth", partialize: (state) => ({ user: state.user }) },
  ),
);
