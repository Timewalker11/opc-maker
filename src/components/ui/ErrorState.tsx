import { Icon } from "./Icon";
import { Button } from "./Button";
import "./state.css";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
  compact = false,
}: ErrorStateProps) {
  return (
    <div className={`ui-state ui-state--error ${compact ? "ui-state--compact" : ""}`} role="alert">
      <div className="ui-state__icon ui-state__icon--error">
        <Icon name="alert-triangle" size={compact ? 18 : 22} />
      </div>
      <p className="ui-state__title">{title}</p>
      <p className="ui-state__desc">{description}</p>
      {onRetry && (
        <div className="ui-state__action">
          <Button size="sm" variant="secondary" onClick={onRetry} icon={<Icon name="undo" size={14} />}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
