import type { ReactNode } from "react";
import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import "./state.css";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}

export function EmptyState({ icon = "layout", title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`ui-state ${compact ? "ui-state--compact" : ""}`}>
      <div className="ui-state__icon">
        <Icon name={icon} size={compact ? 18 : 22} />
      </div>
      <p className="ui-state__title">{title}</p>
      {description && <p className="ui-state__desc">{description}</p>}
      {action && <div className="ui-state__action">{action}</div>}
    </div>
  );
}
