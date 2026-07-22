import { Icon } from "../../ui/Icon";
import type { IconName } from "../../ui/Icon";

const SATELLITES: { icon: IconName; angle: number }[] = [
  { icon: "users", angle: -90 },
  { icon: "megaphone", angle: -30 },
  { icon: "folder", angle: 30 },
  { icon: "mail", angle: 90 },
  { icon: "bar-chart", angle: 150 },
  { icon: "sparkles", angle: 210 },
];

function WelcomeIllustration() {
  const cx = 100;
  const cy = 100;
  const r = 74;
  return (
    <svg className="wizard-welcome__illustration" viewBox="0 0 200 200" role="img" aria-label="Your business connected to customers, marketing, files, email, analytics, and AI">
      {SATELLITES.map(({ angle }, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * r;
        const y = cy + Math.sin(rad) * r;
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border-strong)" strokeWidth={1.5} />;
      })}
      {SATELLITES.map(({ icon, angle }, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * r;
        const y = cy + Math.sin(rad) * r;
        return (
          <g key={icon + i} transform={`translate(${x}, ${y})`}>
            <circle r={20} fill="var(--surface)" stroke="var(--border)" strokeWidth={1.5} />
            <g transform="translate(-9, -9)" stroke="var(--text-secondary)">
              <Icon name={icon} size={18} />
            </g>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={28} fill="var(--text-primary)" />
      <g transform={`translate(${cx - 11}, ${cy - 11})`} stroke="var(--surface)">
        <Icon name="user-circle" size={22} />
      </g>
    </svg>
  );
}

export function StepWelcome() {
  return (
    <div className="wizard-welcome">
      <WelcomeIllustration />
      <h1 className="wizard-welcome__title">Welcome to your Business Operating System</h1>
      <p className="wizard-welcome__subtitle">
        Let's learn about your business so we can build a workspace that fits how you work. This only takes about two
        minutes.
      </p>
      <span className="wizard-welcome__time">
        <Icon name="clock" size={13} />
        About 2–3 minutes
      </span>
    </div>
  );
}
