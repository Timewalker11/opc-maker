import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types";
import { login as loginService, signup as signupService } from "../services/auth";
import { setToken, clearToken } from "../services/authToken";
import { ApiError } from "../services/apiClient";

interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading";
  errorMessage: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "idle",
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
    }),
    { name: "opc_auth", partialize: (state) => ({ user: state.user }) },
  ),
);
