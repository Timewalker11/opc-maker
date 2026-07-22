import type { ReactNode } from "react";
import { Icon } from "../../ui/Icon";
import { Button } from "../../ui/Button";
import { ProgressBar } from "../../ui/ProgressBar";
import "./wizard.css";

interface WizardShellProps {
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  canContinue: boolean;
  continueLabel: string;
  continueIcon?: ReactNode;
  showBack: boolean;
  showFooter?: boolean;
  wide?: boolean;
  children: ReactNode;
}

export function WizardShell({
  stepIndex,
  totalSteps,
  onBack,
  onContinue,
  canContinue,
  continueLabel,
  continueIcon,
  showBack,
  showFooter = true,
  wide = false,
  children,
}: WizardShellProps) {
  return (
    <div className="wizard-page">
      <div className={`wizard-shell ${wide ? "wizard-shell--wide" : ""}`}>
        <div className="wizard-shell__topbar">
          <span className="wizard-shell__mark" aria-hidden="true">
            <Icon name="layout" size={16} />
          </span>
          <div className="wizard-shell__progress">
            <ProgressBar value={stepIndex + 1} max={totalSteps} label="Setup progress" />
          </div>
          <span className="wizard-shell__step-count">
            Step {stepIndex + 1} of {totalSteps}
          </span>
        </div>

        <form
          className="wizard-shell__body"
          onSubmit={(e) => {
            e.preventDefault();
            if (canContinue) onContinue();
          }}
        >
          <div key={stepIndex} className="wizard-step">
            {children}
          </div>

          {showFooter && (
            <div className="wizard-shell__footer">
              {showBack ? (
                <Button type="button" variant="ghost" onClick={onBack}>
                  <Icon name="chevron-left" size={15} />
                  Back
                </Button>
              ) : (
                <span />
              )}
              <Button type="submit" variant="primary" disabled={!canContinue}>
                {continueLabel}
                {continueIcon}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
