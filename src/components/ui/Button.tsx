import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconOnly?: boolean;
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconOnly = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`ui-btn ui-btn--${variant} ui-btn--${size} ${iconOnly ? "ui-btn--icon-only" : ""} ${className}`}
      {...rest}
    >
      {icon && <span className="ui-btn__icon">{icon}</span>}
      {!iconOnly && children}
      {iconOnly && children && <span className="visually-hidden">{children}</span>}
    </button>
  );
}
