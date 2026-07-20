import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import { useBusinessProfileStore } from "../store/businessProfileStore";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signup = useAuthStore((s) => s.signup);
  const status = useAuthStore((s) => s.status);
  const errorMessage = useAuthStore((s) => s.errorMessage);
  const resetProfile = useBusinessProfileStore((s) => s.reset);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await signup(name, email, password);
    if (ok) {
      resetProfile();
      navigate("/onboarding", { replace: true });
    }
  }

  return (
    <AuthLayout title="Create your account" description="Set up your business operating system in a couple of minutes.">
      <form className="auth-form" onSubmit={handleSubmit}>
        {errorMessage && <p className="auth-form__error">{errorMessage}</p>}
        <div className="auth-form__field">
          <label htmlFor="name">Your name</label>
          <input id="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button className="auth-form__submit" variant="primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="auth-layout__footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthLayout>
  );
}
