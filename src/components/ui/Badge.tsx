import type { ReactNode } from "react";
import "./badge.css";

export type BadgeTone = "neutral" | "good" | "warning" | "serious" | "critical" | "accent";

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  icon?: ReactNode;
}

export function Badge({ tone = "neutral", children, icon }: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge--${tone}`}>
      {icon}
      {children}
    </span>
  );
}
