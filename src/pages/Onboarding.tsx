import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { BusinessType, ReferralSource } from "../types";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import { useBusinessProfileStore } from "../store/businessProfileStore";
import { BUSINESS_TYPES, REFERRAL_SOURCES } from "../mock/onboardingOptions";

export function Onboarding() {
  const user = useAuthStore((s) => s.user);
  const setProfile = useBusinessProfileStore((s) => s.setProfile);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("ecommerce");
  const [ownerName, setOwnerName] = useState(user?.name ?? "");
  const [referralSource, setReferralSource] = useState<ReferralSource>("search");
  const [touched, setTouched] = useState(false);

  const step1Valid = companyName.trim().length > 0;
  const step2Valid = ownerName.trim().length > 0;

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!step1Valid) return;
    setTouched(false);
    setStep(1);
  }

  function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!step2Valid) return;
    setProfile({ companyName: companyName.trim(), businessType, ownerName: ownerName.trim(), referralSource });
    navigate("/", { replace: true });
  }

  return (
    <AuthLayout title="Set up your business" description="A couple of quick questions to tailor your dashboard." width="md">
      {step === 0 ? (
        <form className="auth-form" onSubmit={handleNext}>
          <div className="auth-form__field">
            <label htmlFor="companyName">Company name</label>
            <input
              id="companyName"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoFocus
            />
            {touched && !step1Valid && <p className="auth-form__error">Enter your company name.</p>}
          </div>
          <div className="auth-form__field">
            <label htmlFor="businessType">What type of business is it?</label>
            <select id="businessType" value={businessType} onChange={(e) => setBusinessType(e.target.value as BusinessType)}>
              {BUSINESS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <Button className="auth-form__submit" variant="primary" type="submit">
            Continue
          </Button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleFinish}>
          <div className="auth-form__field">
            <label htmlFor="ownerName">Your name</label>
            <input
              id="ownerName"
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              autoFocus
            />
            {touched && !step2Valid && <p className="auth-form__error">Enter your name.</p>}
          </div>
          <div className="auth-form__field">
            <label htmlFor="referralSource">How did you hear about us?</label>
            <select
              id="referralSource"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value as ReferralSource)}
            >
              {REFERRAL_SOURCES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div className="auth-wizard__row">
            <Button variant="secondary" type="button" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button variant="primary" type="submit">
              Finish setup
            </Button>
          </div>
        </form>
      )}
      <div className="auth-wizard__steps" aria-hidden="true">
        <span className={`auth-wizard__step-dot ${step === 0 ? "auth-wizard__step-dot--active" : ""}`} />
        <span className={`auth-wizard__step-dot ${step === 1 ? "auth-wizard__step-dot--active" : ""}`} />
      </div>
    </AuthLayout>
  );
}
