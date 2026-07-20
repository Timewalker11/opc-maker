import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import { useBusinessProfileStore } from "../store/businessProfileStore";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const status = useAuthStore((s) => s.status);
  const errorMessage = useAuthStore((s) => s.errorMessage);
  const isComplete = useBusinessProfileStore((s) => s.isComplete);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      const from = (location.state as { from?: string } | null)?.from;
      navigate(isComplete ? from ?? "/" : "/onboarding", { replace: true });
    }
  }

  return (
    <AuthLayout title="Log in" description="Welcome back to your business dashboard.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {errorMessage && <p className="auth-form__error">{errorMessage}</p>}
        <div className="auth-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-form__field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button className="auth-form__submit" variant="primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in…" : "Log in"}
        </Button>
      </form>
      <p className="auth-layout__footer">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthLayout>
  );
}
