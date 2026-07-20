import type { ReactNode } from "react";
import "./card.css";

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  headerAction?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  as?: "section" | "div";
  labelledBy?: string;
  padded?: boolean;
}

export function Card({
  title,
  subtitle,
  icon,
  headerAction,
  footer,
  children,
  className = "",
  as: Tag = "section",
  labelledBy,
  padded = true,
}: CardProps) {
  return (
    <Tag className={`ui-card ${className}`} aria-labelledby={labelledBy}>
      {(title || headerAction) && (
        <header className="ui-card__header">
          <div className="ui-card__heading">
            {icon && <span className="ui-card__icon">{icon}</span>}
            <div className="ui-card__heading-text">
              {title && <h3 className="ui-card__title">{title}</h3>}
              {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="ui-card__action">{headerAction}</div>}
        </header>
      )}
      <div className={padded ? "ui-card__body" : "ui-card__body ui-card__body--flush"}>{children}</div>
      {footer && <footer className="ui-card__footer">{footer}</footer>}
    </Tag>
  );
}
