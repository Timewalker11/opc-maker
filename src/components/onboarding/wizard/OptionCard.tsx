import type { ReactNode } from "react";
import { Icon } from "../../ui/Icon";
import type { IconName } from "../../ui/Icon";

interface OptionCardProps {
  icon?: IconName;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  endSlot?: ReactNode;
}

export function OptionCard({ icon, label, description, selected, onClick, disabled = false, size = "md", endSlot }: OptionCardProps) {
  return (
    <button
      type="button"
      className={`option-card option-card--${size} ${selected ? "option-card--selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {icon && (
        <span className="option-card__icon">
          <Icon name={icon} size={size === "sm" ? 16 : 20} />
        </span>
      )}
      <span className="option-card__text">
        <span className="option-card__label">{label}</span>
        {description && <span className="option-card__description">{description}</span>}
      </span>
      {endSlot}
      <span className="option-card__check" aria-hidden="true">
        <Icon name="check" size={13} />
      </span>
    </button>
  );
}
