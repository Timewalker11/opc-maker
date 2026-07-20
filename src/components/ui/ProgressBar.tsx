import "./progress-bar.css";

interface ProgressBarProps {
  value: number;
  max?: number;
  tone?: "accent" | "good" | "warning" | "critical";
  label?: string;
}

export function ProgressBar({ value, max = 100, tone = "accent", label }: ProgressBarProps) {
  const pct = max <= 0 ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      className="ui-progress"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={`ui-progress__fill ui-progress__fill--${tone}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
