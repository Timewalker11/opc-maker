import type { ReactNode, KeyboardEvent, MouseEvent } from "react";

interface ClickableRegionProps {
  onClick: () => void;
  ariaLabel: string;
  children: ReactNode;
}

// A div-based "button" for wrapping content that itself contains nested
// interactive elements (checkboxes, buttons) -- a real <button> can't
// legally contain those.
export function ClickableRegion({ onClick, ariaLabel, children }: ClickableRegionProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  }

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    onClick();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      className="ui-card__body-trigger"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
